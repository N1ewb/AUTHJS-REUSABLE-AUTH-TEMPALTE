export type Role = "instructor" | "student" | "admin";

export type QuizData = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  code: string | null;
  isPublished: boolean;
  activeSessionId: string | null;
  timeLimit: number | null;
  passingScore: number | null;
  maxAttempts: number;
  shuffleQuestions: boolean;
  createdAt: string;
  tags: unknown;
  _count: { questions: number };
  questions: {
    id: string;
    text: string;
    type: string;
    points: number;
    order: number;
    options: unknown;
    answer: string | null;
  }[];
};

export type SessionData = {
  id: string;
  code: string;
  isActive: boolean;
  currentQuestion: number | null;
  startedAt: Date;
  endedAt: Date | null;
  quizId: string;
  quiz: {
    id: string;
    title: string;
    questions: {
      id: string;
      text: string;
      type: string;
      points: number;
      order: number;
      options: unknown;
      answer: string | null;
    }[];
  };
  participants: {
    id: string;
    userId: string;
    name: string;
    email: string;
    joinedAt: string;
    score: number | null;
  }[];
};
