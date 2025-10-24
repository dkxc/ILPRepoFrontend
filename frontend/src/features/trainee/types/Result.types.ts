// types/Result.ts

export type Phase =
  | "Tech Fundamentals"
  | "Frontend Development"
  | "Backend Development";

export interface Feedback {
  conceptualClarity: string;
  codingSkills: string;
  analyticalSkills: string;
  qualityOfWork: string;
}

export interface PhaseData {
  phaseName: Phase;
  score: number;
  feedback: Feedback;
  strengths: string[];
  improvements: string[];
}

export interface ResultFeedback {
  overallScore: number;
  phases: PhaseData[];
  boScore?: number;
  boFeedback?: Feedback;
  
}

export interface AllResultsData {
  overallScore: number;
  phases: {
    [key in Phase]: {
      score: number;
      feedback: Feedback;
      strengths: string[];
      improvements: string[];
    };
  };
}
