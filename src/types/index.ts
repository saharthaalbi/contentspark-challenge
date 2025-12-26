export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  totalPoints: number;
  tasksCompleted: number;
  streak: number;
  isAI?: boolean;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'caption' | 'post' | 'idea' | 'headline';
  difficulty: 'easy' | 'medium' | 'hard';
  maxPoints: number;
  expiresAt: Date;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string;
  user: User;
  content: string;
  points: number;
  percentage: number;
  feedback: string;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  submissionId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  dailyPoints: number;
  dailyPercentage: number;
  tasksCompleted: number;
}
