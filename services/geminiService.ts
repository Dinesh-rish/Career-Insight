import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, STAGE_SPECIFIC_QUESTIONS } from "../constants";
import { UserContext, Stage, CareerAnalysis, CareerCard, RoadmapLevel } from "../types";

/**
 * Strips markdown code blocks (```json ... ```) from the response text
 * to ensure JSON.parse works correctly.
 */
const cleanJsonString = (text: string): string => {
  let clean = text.trim();
  // Remove markdown code blocks if present
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(json)?/, '').replace(/```$/, '');
  }
  return clean.trim();
};

/**
 * Validates and sanitizes the raw API response to match the CareerAnalysis interface.
 * Provides safe defaults for missing or malformed data to prevent UI crashes.
 */
const sanitizeAnalysisData = (data: any): CareerAnalysis => {
  // Helper: Ensure value is an array, else return empty array
  const asArray = (arr: any, defaultArr: any[] = []) => Array.isArray(arr) ? arr : defaultArr;

  // Helper: Ensure value is a string, else return default string
  const asString = (str: any, defaultStr = "") => (typeof str === 'string' || typeof str === 'number') ? String(str).trim() : defaultStr;

  // 1. Sanitize Talent Profile
  const talentProfile = {
    topStrengths: asArray(data?.talentProfile?.topStrengths).map(s => asString(s)).filter(s => s.length > 0),
    workingNature: asString(data?.talentProfile?.workingNature, "Balanced Professional")
  };

  // 2. Sanitize Career Cards
  // Ensure we have an array, map over it safely, and valid structure for each card
  const rawCards = asArray(data?.careerCards);
  let careerCards: CareerCard[] = rawCards.map((card: any) => ({
    title: asString(card?.title, "Recommended Role"),
    demand: ["High", "Medium", "Emerging"].includes(card?.demand) ? card.demand : "Medium",
    fitScore: typeof card?.fitScore === 'number' ? card.fitScore : 75,
    salary: asString(card?.salary, "Market Standard"),
    growth: asString(card?.growth, "Growth path available"),
    reasons: asArray(card?.reasons).map(r => asString(r)),
    gaps: asArray(card?.gaps).map(g => asString(g))
  })).slice(0, 4); // Enforce max 4 cards

  // Fallback: If AI returns no cards, provide a placeholder so UI doesn't look broken
  if (careerCards.length === 0) {
    careerCards = [{
      title: "General Analysis",
      demand: "Medium",
      fitScore: 0,
      salary: "Varies",
      growth: "Please retake assessment with more details.",
      reasons: ["Insufficient data to recommend specific roles."],
      gaps: ["General Aptitude"]
    }];
  }

  // 3. Sanitize Roadmap
  // Helper to sanitize a specific roadmap level
  const sanitizeLevel = (level: any, defaultFocus: string): RoadmapLevel => ({
    focus: asString(level?.focus, defaultFocus),
    activities: asArray(level?.activities).map((act: any) => ({
      task: asString(act?.task, "Explore this topic"),
      resources: asString(act?.resources, "Online Search / Books"),
      time: asString(act?.time, "Flexible")
    }))
  });

  // Ensure all 3 levels exist
  const roadmap = {
    beginner: sanitizeLevel(data?.roadmap?.beginner, "Foundational Knowledge"),
    intermediate: sanitizeLevel(data?.roadmap?.intermediate, "Practical Application"),
    advanced: sanitizeLevel(data?.roadmap?.advanced, "Expert Mastery")
  };

  // 4. Sanitize Guidance
  const guidance = {
    bestRole: asString(data?.guidance?.bestRole, careerCards[0]?.title || "Best Fit Role"),
    reason: asString(data?.guidance?.reason, "Based on your overall profile analysis."),
    actions: asArray(data?.guidance?.actions).map(a => asString(a)).filter(a => a.length > 0)
  };

  // Ensure at least 3 actions
  if (guidance.actions.length === 0) {
    guidance.actions = ["Review your profile strengths", "Research the recommended roles", "Prepare a learning plan"];
  }

  return { talentProfile, careerCards, roadmap, guidance };
};

export const generateCareerAnalysis = async (userContext: UserContext): Promise<CareerAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Format Phase 1 Answers
  const formattedPhase1 = userContext.answers
    .map((a, i) => `Q${i + 1} (1-5): ${a.score}/5`)
    .join("\n");

  // Format Phase 2 Answers
  let formattedPhase2 = "";
  if (userContext.stage) {
    const questions = STAGE_SPECIFIC_QUESTIONS[userContext.stage];
    formattedPhase2 = questions.map(q => {
      const ans = userContext.stageSpecificAnswers[q.id] || "Skipped";
      return `Q: ${q.text}\nA: ${ans}`;
    }).join("\n\n");
  }

  const prompt = `
    USER PROFILE DATA:
    
    CURRENT STAGE: ${userContext.stage}
    
    === PHASE 1: TALENT DIGGER SCORES (Likert 1-5) ===
    ${formattedPhase1}
    
    === PHASE 2: DECISION CONTEXT (Specific to Stage) ===
    ${formattedPhase2}
    
    Provide the output in strict JSON format as defined in the system instruction.
    Ensure 'careerCards' is an array of objects.
    Ensure 'roadmap' has 'beginner', 'intermediate', and 'advanced' objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        responseMimeType: "application/json"
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    // 1. Clean the string (remove markdown fences if any)
    const cleanedText = cleanJsonString(text);

    try {
      // 2. Parse JSON
      const parsedData = JSON.parse(cleanedText);

      // 3. Validate & Sanitize (Safe Defaulting)
      const sanitizedData = sanitizeAnalysisData(parsedData);

      return sanitizedData;

    } catch (parseError) {
      console.error("JSON Parse/Validation Error:", parseError);
      console.error("Raw Text:", text);
      throw new Error("Failed to parse analysis results. The AI response was malformed.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Pass the actual error message or a more specific one
    throw new Error(error.message || "Failed to generate analysis. Please try again later.");
  }
};
