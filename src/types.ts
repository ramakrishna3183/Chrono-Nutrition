export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  healthRating: string;
  confidence: number;
  description: string;
  portionNotes?: string;
  timestamp: string; // e.g. "12:45 PM"
  mealType: MealType;
  imageUrl?: string;
  verified: boolean;
  scanCode?: string;
  date: string; // YYYY-MM-DD
}

export interface WaterEntry {
  id: string;
  amountMl: number;
  timestamp: string;
  label: string;
  date: string;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "THU", "TODAY", "FRI"
  shortDay: string; // "M", "T", "W", "T", "F", "S", "S"
  displayDate: string; // "Thu, Oct 24"
  cycleDay: number;
  targetCalories: number;
  targetWaterMl: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: MealEntry[];
  waterEntries: WaterEntry[];
}

export interface UserCalibration {
  targetCalories: number;
  targetWaterMl: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export type NavTab = 'gauge' | 'water' | 'camera' | 'logs';
