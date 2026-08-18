export type UserType = 'anak' | 'dewasa' | 'orang_tua' | 'guru' | 'peneliti';
export type Gender = 'Laki-laki' | 'Perempuan';
export type MealType = 'sarapan' | 'makan_siang' | 'makan_malam' | 'camilan';

export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  gender: Gender;
  userType: UserType;
  schoolName: string;
  gradeClass: string;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodName: string;
  portionDesc: string;
  sugarGram: number; // Gula (gram)
  saltGram: number;  // Garam (gram)
  fatGram: number;   // Lemak (gram)
  calories?: number;
  aiNote?: string;
  createdAt: string;
}

export interface GGLStatus {
  sugarGram: number;
  sugarLimit: number;
  sugarStatus: 'aman' | 'waspada' | 'bahaya';
  sugarPercent: number;

  saltGram: number;
  saltLimit: number;
  saltStatus: 'aman' | 'waspada' | 'bahaya';
  saltPercent: number;

  fatGram: number;
  fatLimit: number;
  fatStatus: 'aman' | 'waspada' | 'bahaya';
  fatPercent: number;

  overallStatus: 'aman' | 'waspada' | 'bahaya';
}

export interface AIRecommendationResult {
  sugarAdvice: string;
  saltAdvice: string;
  fatAdvice: string;
  healthyAlternatives: string[];
  overallSummary: string;
  encouragement: string;
}

export interface PresetFood {
  name: string;
  category: string;
  defaultPortion: string;
  sugarGram: number;
  saltGram: number;
  fatGram: number;
  icon: string;
}

export interface EducationalItem {
  id: string;
  title: string;
  category: 'gula' | 'garam' | 'lemak' | 'kemenkes' | 'video';
  summary: string;
  content: string;
  videoUrl?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ResearchLog {
  id: string;
  userId: string;
  userType: UserType;
  schoolName: string;
  gradeClass: string;
  action: string;
  tamCategory: 'Perceived Usefulness' | 'Perceived Ease of Use' | 'Attitude Toward Using' | 'System Usage';
  timestamp: string;
}

export const APP_LOGOS = {
  sekanak: 'https://i.imgur.com/KcQRTiO.png',
  unsri: 'https://i.imgur.com/OuoFtOD.png',
} as const;
