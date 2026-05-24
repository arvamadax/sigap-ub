export interface Option {
  score: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface AssessmentModule {
  id: string;
  title: string;
  subtitle: string;
  questionsCount: number;
  iconType: 'depression' | 'anxiety' | 'screening';
  questions: Question[];
}

export interface HistoryItem {
  id: string;
  assessmentName: string;
  date: string;
  status: 'Selesai' | 'Perhatian' | 'Aman';
  score?: number;
  interpretation?: string;
}

export type ViewType = 'landing' | 'dashboard' | 'assessment';

export type AssessmentType = 'gad7' | 'phq9' | 'srq20';

export interface UserStats {
  assessedCount: number;
  lowRiskCount: number;
  moderateCount: number;
  highRiskCount: number;
}
