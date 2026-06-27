export type Role = "instructor" | "student" | "admin";

export type QuizType = "LIVE" | "PREMADE" | "PUZZLE" | "PROGRAMMING";

export type QuestionType = "MCQ" | "IDENTIFICATION" | "TRUE_FALSE" | "CODING";

export type QuizData = {
  id: string;
  title: string;
  description: string | null;
  type: QuizType;
  code: string | null;
  isPublished: boolean;
  activeSessionId: string | null;
  timeLimit: number | null;
  passingScore: number | null;
  maxAttempts: number;
  shuffleQuestions: boolean;
  createdAt: string;
  tags: unknown;
  _count: { questions: number; sessions: number };
  averageScore: number | null;
  questions: QuizQuestion[];
};

export type QuizQuestionOption = {
  label: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  order: number;
  options: QuizQuestionOption[] | null;
  answer: string | null;
};

export type SessionData = {
  id: string;
  code: string;
  isActive: boolean;
  cancelled: boolean;
  currentQuestion: number | null;
  startedAt: Date;
  endedAt: Date | null;
  quizId: string;
  quiz: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
  participants: Participant[];
};

export type Participant = {
  id: string;
  userId: string;
  name: string;
  email: string;
  joinedAt: string;
  score: number | null;
};

export type Session = {
  id: string;
  code: string;
  isActive: boolean;
  cancelled: boolean;
  currentQuestion: number | null;
  startedAt: Date;
  endedAt: Date | null;
  quizId: string;
  quiz: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
  participants: Participant[];
};

export type StudentActiveSession = {
  sessionId: string;
  code: string;
  currentQuestion: number;
  quizId: string;
};

export type StudentAttempt = {
  id: string;
  score: number | null;
  totalPoints: number | null;
  startedAt: string;
  submittedAt: string | null;
  quizTitle: string;
  totalQuestions: number;
};

export type Submission = {
  userId: string;
  name: string;
  submitted: boolean;
  answer: string | null;
};

export const typeLabels: Record<string, string> = {
  PREMADE: "Pre-made",
  LIVE: "Live",
  PUZZLE: "Puzzle",
  PROGRAMMING: "Programming",
};

export type Attempt = {
  id: string;
  score: number | null;
  totalPoints: number | null;
  startedAt: Date;
  submittedAt: Date | null;
  quiz: {
    id: string;
    title: string;
    type: string;
    code: string | null;
    _count: { questions: number };
  };
};
