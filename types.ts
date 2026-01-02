
export enum ToolType {
  GPA = 'gpa',
  BMI = 'bmi',
  PDF = 'pdf',
  TIMER = 'timer',
  AI_PROMPT = 'ai-prompt',
  CALCULATOR = 'calculator'
}

export enum PageType {
  TERMS = 'terms',
  PRIVACY = 'privacy',
  ABOUT = 'about'
}

export type Language = 'ar' | 'en';

export interface Tool {
  id: ToolType;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  category: Record<Language, string>;
}

export interface GPARow {
  id: string;
  grade: string;
  credits: number;
}
