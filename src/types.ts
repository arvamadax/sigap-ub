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

export type ViewType = 'landing' | 'dashboard' | 'assessment' | 'konselor';

export type AssessmentType = 'gad7' | 'phq9' | 'srq20';

export type RisikoLevel = 'ringan' | 'sedang' | 'berat' | 'kritis';

export interface UserStats {
  assessedCount: number;
  lowRiskCount: number;
  moderateCount: number;
  highRiskCount: number;
}

export interface MahasiswaTriage {
  id: number;
  nama: string;
  nim: string;
  fakultas: string;
  semester: number;
  phq9: number | null;
  gad7: number | null;
  srq20: number | null;
}

export interface NotifikasiItem {
  id: string;
  teks: string;
  waktu: Date;
  tipe: 'kritis' | 'perhatian' | 'info';
}
