export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  SUPERVISOR = 'supervisor'
}

export enum CompetencyLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum AssessmentStep {
  STEP_1 = 1,
  STEP_2 = 2,
  STEP_3 = 3
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface Question {
  _id: string;
  competency: string;
  level: CompetencyLevel;
  questionText: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  timeLimit: number;
}

export interface Answer {
  questionId: string;
  answer: 'a' | 'b' | 'c' | 'd' | '';
  timeSpent: number;
}

export interface Assessment {
  _id: string;
  userId: string;
  currentStep: AssessmentStep;
  step1: StepData;
  step2: StepData;
  step3: StepData;
  finalLevel: CompetencyLevel | null;
  certificateUrl?: string;
  isCompleted: boolean;
  totalTimeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface StepData {
  questions: string[];
  answers: Answer[];
  score: number;
  percentage: number;
  startedAt?: string;
  completedAt?: string;
}

export interface Certificate {
  _id: string;
  userId: string;
  assessmentId: string;
  certificateNumber: string;
  level: CompetencyLevel;
  issuedDate: string;
  validUntil?: string;
  pdfUrl?: string;
  verificationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}