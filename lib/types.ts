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
  startedAt: Date;
  endedAt: Date | null;
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
};
