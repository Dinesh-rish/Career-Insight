import { Question, Stage, StageQuestion } from "./types";

export const SYSTEM_INSTRUCTION = `
# SYSTEM PROMPT: CAREER ASSESSMENT EXPERT

You are Dr. Career Insight, a professional career psychologist. Your role is to **diagnose and recommend objectively** based on evidence.

## INPUT DATA
You will receive:
1. **Talent Digger Scores** (Phase 1): 10 dimensions scored 0-100 based on quiz.
2. **Context Answers** (Phase 2): User's current stage, grades, preferences, and constraints.

## ASSESSMENT LOGIC
1. **Calculate Talent Scores**: Analyze Phase 1 answers to determine strengths (Logic, Numeric, Verbal, Creative, etc.).
2. **Contextualize**: Use Phase 2 answers to filter options (e.g., if Class 10 likes Math -> Science Stream; if Professional hates coding -> Move to Product/Sales).
3. **Select Recommendations**: Pick the top 4 best-fit roles/streams/paths.
4. **Create Roadmap**: Design a roadmap for the **#1 Best Fit Role**.

## OUTPUT FORMAT
**You must return ONLY valid JSON.** No Markdown, no code blocks, just the JSON object.

JSON Structure:
{
  "talentProfile": {
    "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
    "workingNature": "Short description of their cognitive style (e.g., 'Analytical Solver' or 'Creative Builder')"
  },
  "careerCards": [
    {
      "title": "Role Title (or Stream for Class 10)",
      "demand": "High" | "Medium" | "Emerging",
      "fitScore": 85, (integer 0-100)
      "salary": "Entry: $X - $Y | Senior: $Z+", (Adjust currency to locale, usually INR for India context if implied, or USD general)
      "growth": "Description of 3-5 year trajectory",
      "reasons": ["Reason 1 linked to talent", "Reason 2 linked to interest", "Reason 3 linked to style"],
      "gaps": ["Skill 1 (Level)", "Skill 2 (Level)", "Skill 3 (Level)"]
    }
    // ... exactly 4 cards
  ],
  "roadmap": {
    "beginner": {
      "focus": "Foundational Understanding",
      "activities": [
        { "task": "Task description", "resources": "Tools/Links", "time": "Estimated hours/weeks" }
        // ... 2-3 activities
      ]
    },
    "intermediate": {
      "focus": "Application & Practice",
      "activities": [ ... ]
    },
    "advanced": {
      "focus": "Specialization & Portfolio",
      "activities": [ ... ]
    }
  },
  "guidance": {
    "bestRole": "Name of the #1 recommended role",
    "reason": "Short logical justification why this is the priority",
    "actions": ["Immediate Action 1", "Immediate Action 2", "Immediate Action 3"]
  }
}

## RULES
1. **Class 10**: Cards should be Streams (Science PCM, Commerce w/ Math, etc.) OR specific career paths within those streams.
2. **Class 12**: Cards should be Degrees (B.Tech CS, B.Des, B.Com Hons).
3. **College/Pro**: Cards should be Job Roles.
4. **Strict JSON**: Do not include \`\`\`json ... \`\`\`. Just the raw JSON string.
`;

export const QUESTIONS: Question[] = [
  { id: 1, text: "I naturally notice patterns and inconsistencies in data or arguments.", dimension: "Logical & Analytical Thinking" },
  { id: 2, text: "I feel comfortable working with complex numbers, statistics, or mental math.", dimension: "Numerical Ability" },
  { id: 3, text: "I can easily articulate complex ideas into clear words, both written and spoken.", dimension: "Verbal & Communication Ability" },
  { id: 4, text: "I can visualize how objects fit together in 3D space or imagine new designs easily.", dimension: "Visual/Creative Thinking" },
  { id: 5, text: "I prefer building or fixing things with my hands rather than just reading about them.", dimension: "Practical/Hands-on Ability" },
  { id: 6, text: "I often spend hours researching random topics just to understand 'why' something works.", dimension: "Curiosity & Depth of Thinking" },
  { id: 7, text: "I stay calm and make rational decisions even when under high pressure or criticism.", dimension: "Emotional Control" },
  { id: 8, text: "I naturally take charge of groups and enjoy being responsible for outcomes.", dimension: "Leadership & Responsibility" },
  { id: 9, text: "I stick to my routine and finish tasks even when I feel unmotivated or bored.", dimension: "Discipline & Consistency" },
  { id: 10, text: "I feel energized after interacting with large groups of people for extended periods.", dimension: "Social Orientation" },
];

export const STAGE_SPECIFIC_QUESTIONS: Record<Stage, StageQuestion[]> = {
  [Stage.CLASS_10]: [
    // A. Subject Understanding
    { id: "10_1", text: "Which subject do you understand fastest without memorizing?", type: "choice", category: "Subject Understanding", options: ["Mathematics", "Science", "Social Science", "Languages"] },
    { id: "10_2", text: "How do you feel about numerical problem solving?", type: "choice", category: "Subject Understanding", options: ["Enjoy", "Can manage", "Avoid", "Strongly dislike"] },
    { id: "10_3", text: "How comfortable are you with abstract concepts (theories, formulas)?", type: "choice", category: "Subject Understanding", options: ["Very", "Moderate", "Low", "Very low"] },
    { id: "10_4", text: "Practical lab work feels:", type: "choice", category: "Subject Understanding", options: ["Interesting", "Manageable", "Stressful", "Confusing"] },
    // B. Thinking Style
    { id: "10_5", text: "You prefer questions that:", type: "choice", category: "Thinking Style", options: ["Have one correct answer", "Require explanation", "Require analysis of situations", "Allow opinions"] },
    { id: "10_6", text: "You learn best by:", type: "choice", category: "Thinking Style", options: ["Solving problems", "Reading theory", "Watching demonstrations", "Discussion"] },
    { id: "10_7", text: "How long can you focus on a difficult topic?", type: "choice", category: "Thinking Style", options: ["<20 min", "20–40 min", "40–60 min", "60+ min"] },
    // C. Pressure
    { id: "10_8", text: "How do you handle exam pressure?", type: "choice", category: "Pressure & Future", options: ["Calm", "Slight stress", "High stress", "Panic"] },
    { id: "10_9", text: "Are you comfortable studying complex subjects daily?", type: "choice", category: "Pressure & Future", options: ["Yes", "Maybe", "No"] },
    { id: "10_10", text: "Which future sounds more realistic for you?", type: "choice", category: "Pressure & Future", options: ["Technical profession", "Business/finance", "Administration/law", "Creative/social fields"] },
    // D. Reality Check
    { id: "10_11", text: "Your current average academic performance:", type: "choice", category: "Reality Check", options: ["Excellent (>90%)", "Good (75-90%)", "Average (60-75%)", "Below average (<60%)"] },
    { id: "10_12", text: "Support available at home (guidance/resources):", type: "choice", category: "Reality Check", options: ["High", "Moderate", "Low"] },
    { id: "10_13", text: "Willingness to attend coaching if needed:", type: "choice", category: "Reality Check", options: ["Yes", "Maybe", "No"] },
    { id: "10_14", text: "Preference:", type: "choice", category: "Reality Check", options: ["Depth in fewer subjects", "Breadth across subjects"] },
    { id: "10_15", text: "One subject you NEVER want to study deeply:", type: "text", category: "Reality Check" },
  ],
  [Stage.CLASS_12]: [
    // A. Subject Strength
    { id: "12_1", text: "Which subjects did you perform best in Class 11–12?", type: "text", category: "Subject Strength" },
    { id: "12_2", text: "Which subject drained you the most mentally?", type: "text", category: "Subject Strength" },
    { id: "12_3", text: "Comfort level with mathematics:", type: "choice", category: "Subject Strength", options: ["High", "Medium", "Low", "None"] },
    // B. Interest Sustainability
    { id: "12_4", text: "Which activity do you enjoy even when it’s difficult?", type: "choice", category: "Interest Sustainability", options: ["Problem solving", "Reading & research", "Helping people", "Designing/creating"] },
    { id: "12_5", text: "Can you study the same field for 4–6 years?", type: "choice", category: "Interest Sustainability", options: ["Yes", "Maybe", "No"] },
    { id: "12_6", text: "Learning preference:", type: "choice", category: "Interest Sustainability", options: ["Logic-based", "Memory-based", "Practical-based", "Discussion-based"] },
    // C. Career Reality
    { id: "12_7", text: "What matters more long-term?", type: "choice", category: "Career Reality", options: ["Interest", "Salary", "Stability", "Work-life balance"] },
    { id: "12_8", text: "Preferred work type:", type: "choice", category: "Career Reality", options: ["Technical", "Analytical", "Human-centered", "Creative"] },
    { id: "12_9", text: "Pressure tolerance:", type: "choice", category: "Career Reality", options: ["High", "Medium", "Low"] },
    // D. Constraints
    { id: "12_10", text: "Family expectations influence your choice:", type: "choice", category: "Constraints", options: ["High", "Medium", "Low"] },
    { id: "12_11", text: "Willingness for competitive exams:", type: "choice", category: "Constraints", options: ["Yes", "Maybe", "No"] },
    { id: "12_12", text: "Preferred duration of education:", type: "choice", category: "Constraints", options: ["3 yrs", "4 yrs", "5+ yrs"] },
    { id: "12_13", text: "Budget sensitivity:", type: "choice", category: "Constraints", options: ["High", "Medium", "Low"] },
    { id: "12_14", text: "Location preference:", type: "choice", category: "Constraints", options: ["Anywhere", "India only", "Local"] },
    { id: "12_15", text: "Backup plan available?", type: "choice", category: "Constraints", options: ["Yes", "No"] },
    { id: "12_16", text: "One degree you are sure you DON'T want:", type: "text", category: "Constraints" },
  ],
  [Stage.COLLEGE]: [
    // A. Academic & Skills
    { id: "C_1", text: "Degree, branch, and year of study:", type: "text", category: "Academic & Skills" },
    { id: "C_2", text: "Strongest subject so far:", type: "text", category: "Academic & Skills" },
    { id: "C_3", text: "Weakest subject so far:", type: "text", category: "Academic & Skills" },
    { id: "C_4", text: "List skills you are confident in:", type: "text", category: "Academic & Skills" },
    { id: "C_5", text: "List skills you struggle with:", type: "text", category: "Academic & Skills" },
    // B. Practical Exposure
    { id: "C_6", text: "Have you done projects/internships?", type: "choice", category: "Practical Exposure", options: ["Yes", "No"] },
    { id: "C_7", text: "Which task excites you more?", type: "choice", category: "Practical Exposure", options: ["Coding", "Analysis", "Design", "Coordination"] },
    { id: "C_8", text: "Comfort with self-learning:", type: "choice", category: "Practical Exposure", options: ["High", "Medium", "Low"] },
    // C. Work Preference
    { id: "C_9", text: "Prefer working:", type: "choice", category: "Work Preference", options: ["Independently", "In team", "Mixed"] },
    { id: "C_10", text: "Preferred role type:", type: "choice", category: "Work Preference", options: ["Technical", "Analytical", "Client-facing", "Operational"] },
    { id: "C_11", text: "Work environment:", type: "choice", category: "Work Preference", options: ["Startup", "Corporate", "Research", "Public sector"] },
    // D. Career Direction
    { id: "C_12", text: "Interested in higher studies?", type: "choice", category: "Career Direction", options: ["Yes", "No", "Maybe"] },
    { id: "C_13", text: "Salary expectation (first job):", type: "text", category: "Career Direction" },
    { id: "C_14", text: "Willingness to upskill for 6–12 months?", type: "choice", category: "Career Direction", options: ["Yes", "Maybe", "No"] },
    { id: "C_15", text: "Location preference:", type: "text", category: "Career Direction" },
    { id: "C_16", text: "Job stability vs growth:", type: "choice", category: "Career Direction", options: ["Stability", "Growth", "Balance"] },
    { id: "C_17", text: "One role you admire:", type: "text", category: "Career Direction" },
    { id: "C_18", text: "One role you dislike:", type: "text", category: "Career Direction" },
  ],
  [Stage.PROFESSIONAL]: [
    // A. Experience
    { id: "P_1", text: "Current role & years of experience:", type: "text", category: "Experience" },
    { id: "P_2", text: "Key responsibilities:", type: "text", category: "Experience" },
    { id: "P_3", text: "Skills used daily:", type: "text", category: "Experience" },
    { id: "P_4", text: "Skills you want to STOP using:", type: "text", category: "Experience" },
    // B. Satisfaction
    { id: "P_5", text: "Satisfaction with current role:", type: "choice", category: "Satisfaction", options: ["High", "Medium", "Low"] },
    { id: "P_6", text: "Main reason for change:", type: "choice", category: "Satisfaction", options: ["Salary", "Interest", "Growth", "Stress"] },
    { id: "P_7", text: "Burnout level:", type: "choice", category: "Satisfaction", options: ["None", "Mild", "High"] },
    // C. Capability
    { id: "P_8", text: "Time available per week for learning (hours):", type: "text", category: "Capability" },
    { id: "P_9", text: "Budget for upskilling:", type: "text", category: "Capability" },
    { id: "P_10", text: "Preferred learning mode:", type: "text", category: "Capability" },
    // D. Future Direction
    { id: "P_11", text: "Prefer:", type: "choice", category: "Future Direction", options: ["Specialist", "Manager", "Hybrid"] },
    { id: "P_12", text: "Risk tolerance:", type: "choice", category: "Future Direction", options: ["High", "Medium", "Low"] },
    { id: "P_13", text: "Industry preference:", type: "text", category: "Future Direction" },
    { id: "P_14", text: "Work-life balance importance:", type: "choice", category: "Future Direction", options: ["High", "Medium", "Low"] },
    { id: "P_15", text: "Location/remote preference:", type: "text", category: "Future Direction" },
    { id: "P_16", text: "Long-term goal (5 yrs):", type: "text", category: "Future Direction" },
    { id: "P_17", text: "One skill you enjoy mastering:", type: "text", category: "Future Direction" },
    { id: "P_18", text: "One task you avoid:", type: "text", category: "Future Direction" },
  ],
  [Stage.HIDDEN_TALENT]: [
    { id: "HT_1", text: "What do you do in your free time that you lose track of time doing?", type: "text", category: "Exploration" },
    { id: "HT_2", text: "What are hobbies you secretly wish you could pursue professionally?", type: "text", category: "Exploration" },
    { id: "HT_3", text: "What do friends or family often compliment you on (that isn't your job)?", type: "text", category: "Exploration" },
    { id: "HT_4", text: "Describe any 'silly' side projects or topics you research for fun:", type: "text", category: "Exploration" },
  ]
};