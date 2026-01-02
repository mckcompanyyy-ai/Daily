
export enum TaskCategory {
  WORK = 'İş',
  PERSONAL = 'Kişisel',
  FITNESS = 'Spor',
  LEARNING = 'Öğrenme',
  REST = 'Dinlenme'
}

export interface Task {
  id: string;
  title: string;
  startTime: string; // HH:mm format
  durationMinutes: number;
  category: TaskCategory;
  completed: boolean;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  period: 'weekly' | 'monthly';
  target: number;
  current: number;
  completed: boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  birthDate: string;
  profilePicture?: string; // base64
  backgroundImage?: string; // base64
  onboarded: boolean;
}

export interface UserStats {
  name: string;
  usageStreak: number;
  totalCompletedTasks: number;
}
