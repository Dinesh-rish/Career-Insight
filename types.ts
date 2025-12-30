export enum Stage {
  CLASS_10 = "Class 10 Student",
  CLASS_12 = "Class 12 Student",
  COLLEGE = "College Student",
  PROFESSIONAL = "Working Professional",
  HIDDEN_TALENT = "Hidden Talent Discovery"
}

export interface Question {
  id: number;
  text: string;
  dimension: string; // The talent dimension this measures
}

export interface QuizAnswer {
  questionId: number;
  score: number; // 1-5 Likert scale
}

export type QuestionType = 'choice' | 'text' | 'multi_select';

export interface StageQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  category?: string;
}

export interface UserContext {
  stage: Stage | null;
  answers: QuizAnswer[]; // Phase 1 answers
  stageSpecificAnswers: Record<string, string>; // Phase 2 answers
}

export interface AnalysisState {
  isLoading: boolean;
  result: CareerAnalysis | null;
  error: string | null;
}

// New types for structured output
export interface RoadmapActivity {
  task: string;
  resources: string;
  time: string;
}

export interface RoadmapLevel {
  focus: string;
  activities: RoadmapActivity[];
}

export interface CareerCard {
  title: string;
  demand: 'High' | 'Medium' | 'Emerging';
  fitScore: number;
  salary: string;
  growth: string;
  reasons: string[];
  gaps: string[];
}

export interface CareerAnalysis {
  talentProfile: {
    topStrengths: string[];
    workingNature: string;
  };
  careerCards: CareerCard[];
  roadmap: {
    beginner: RoadmapLevel;
    intermediate: RoadmapLevel;
    advanced: RoadmapLevel;
  };
  guidance: {
    bestRole: string;
    reason: string;
    actions: string[];
  };
}