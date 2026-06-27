"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function getQuizById(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id, instructorId: session.user.id },
    include: {
      _count: { select: { questions: true } },
      questions: { orderBy: { order: "asc" } },
      sessions: { where: { isActive: true }, select: { id: true }, take: 1 },
    },
  });

  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    type: quiz.type as string,
    code: quiz.code,
    isPublished: quiz.isPublished,
    activeSessionId: quiz.sessions[0]?.id ?? null,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    maxAttempts: quiz.maxAttempts,
    shuffleQuestions: quiz.shuffleQuestions,
    tags: quiz.tags as unknown,
    createdAt: quiz.createdAt.toISOString(),
    updatedAt: quiz.updatedAt.toISOString(),
    instructorId: quiz.instructorId,
    lectureId: quiz.lectureId,
    _count: quiz._count,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type as string,
      points: q.points,
      order: q.order,
      options: q.options as unknown,
      answer: q.answer,
      codeTemplate: q.codeTemplate,
      createdAt: q.createdAt.toISOString(),
      updatedAt: q.updatedAt.toISOString(),
    })),
  };
}

export async function getStudentQuizHistory() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.quizAttempt.findMany({
    where: { userId: session.user.id },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          type: true,
          code: true,
          _count: { select: { questions: true } },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });
}

export async function getQuizzes() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.quiz.findMany({
    where: { instructorId: session.user.id },
    include: { _count: { select: { questions: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createQuiz(data: {
  title: string;
  description?: string;
  type?: string;
  timeLimit?: number;
  passingScore?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  selectedTags?: string[];
  questions: {
    text: string;
    type?: string;
    points?: number;
    options?: { label: string; text: string; isCorrect: boolean }[];
    answer?: string;
    codeTemplate?: string;
  }[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { title, description, type, timeLimit, passingScore, maxAttempts, shuffleQuestions, selectedTags, questions } = data;

  if (!title || !questions?.length) {
    throw new Error("Title and questions are required");
  }

  const quiz = await prisma.$transaction(async (tx) => {
    return tx.quiz.create({
      data: {
        title,
        description: description || null,
        type: (type as any) || "PREMADE",
        timeLimit: timeLimit || null,
        passingScore: passingScore || null,
        maxAttempts: maxAttempts || 1,
        shuffleQuestions: shuffleQuestions || false,
        isPublished: true,
        code: generateCode(),
        tags: selectedTags || [],
        instructor: { connect: { id: session.user.id } },
        questions: {
          create: questions.map((q, i) => ({
            text: q.text,
            type: (q.type as any) || "MCQ",
            points: q.points || 1,
            order: i + 1,
            ...(q.options?.length ? { options: q.options } : {}),
            ...(q.answer ? { answer: q.answer } : {}),
            ...(q.codeTemplate ? { codeTemplate: q.codeTemplate } : {}),
          })),
        },
      },
      include: { questions: true },
    });
  });

  return quiz;
}

export async function addQuestion(
  quizId: string,
  data: {
    text: string;
    type: string;
    points: number;
    options?: { label: string; text: string; isCorrect: boolean }[];
    answer?: string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, instructorId: session.user.id },
    select: { _count: { select: { questions: true } } },
  });

  if (!quiz) throw new Error("Quiz not found");

  await prisma.question.create({
    data: {
      text: data.text,
      type: (data.type as any) || "MCQ",
      points: data.points || 1,
      order: quiz._count.questions + 1,
      options: data.options ?? undefined,
      answer: data.answer ?? undefined,
      quiz: { connect: { id: quizId } },
    },
  });
}

export async function updateQuestion(
  id: string,
  data: {
    text: string;
    type: string;
    points: number;
    options?: { label: string; text: string; isCorrect: boolean }[];
    answer?: string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const question = await prisma.question.findUnique({
    where: { id },
    include: { quiz: { select: { instructorId: true } } },
  });

  if (!question || question.quiz.instructorId !== session.user.id)
    throw new Error("Unauthorized");

  await prisma.question.update({
    where: { id },
    data: {
      text: data.text,
      type: data.type as any,
      points: data.points,
      ...(data.options ? { options: data.options } : {}),
      ...(data.answer !== undefined ? { answer: data.answer } : {}),
    },
  });
}

export async function deleteQuiz(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id, instructorId: session.user.id },
    select: { id: true },
  });

  if (!quiz) throw new Error("Quiz not found");

  await prisma.quiz.delete({ where: { id } });
}

export async function generateQuizCode(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id, instructorId: session.user.id },
    select: { id: true },
  });

  if (!quiz) throw new Error("Quiz not found");

  let code = generateCode();
  let exists = await prisma.quiz.findUnique({ where: { code } });
  while (exists) {
    code = generateCode();
    exists = await prisma.quiz.findUnique({ where: { code } });
  }

  await prisma.quiz.update({
    where: { id },
    data: { code },
  });

  return code;
}

export async function toggleQuizPublish(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id, instructorId: session.user.id },
    select: { isPublished: true },
  });

  if (!quiz) throw new Error("Quiz not found");

  const updated = await prisma.quiz.update({
    where: { id },
    data: { isPublished: !quiz.isPublished },
    select: { isPublished: true },
  });

  return updated.isPublished;
}

export async function startLiveSession(quizId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, instructorId: session.user.id },
    select: { id: true, isPublished: true, type: true },
  });

  if (!quiz) throw new Error("Quiz not found");
  if (!quiz.isPublished) throw new Error("Quiz must be published");
  if (quiz.type !== "LIVE") throw new Error("Quiz is not a live quiz");

  let code = generateCode();
  let exists = await prisma.liveSession.findUnique({ where: { code } });
  while (exists) {
    code = generateCode();
    exists = await prisma.liveSession.findUnique({ where: { code } });
  }

  const liveSession = await prisma.liveSession.create({
    data: {
      code,
      quiz: { connect: { id: quizId } },
    },
    select: { id: true, code: true },
  });

  return liveSession;
}

export async function joinLiveSession(code: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const liveSession = await prisma.liveSession.findUnique({
    where: { code },
    include: {
      _count: { select: { attempts: true } },
      quiz: {
        select: {
          id: true,
          title: true,
          _count: { select: { questions: true } },
        },
      },
    },
  });

  if (!liveSession || !liveSession.isActive)
    throw new Error("Session not found or no longer active");

  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_quizId: { userId: session.user.id, quizId: liveSession.quizId },
    },
  });

  if (existingAttempt) {
    await prisma.quizAttempt.update({
      where: { id: existingAttempt.id },
      data: { sessionId: liveSession.id },
    });
  } else {
    await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId: liveSession.quizId,
        sessionId: liveSession.id,
      },
    });
  }

  return {
    id: liveSession.id,
    code: liveSession.code,
    isActive: liveSession.isActive,
    startedAt: liveSession.startedAt.toISOString(),
    endedAt: liveSession.endedAt?.toISOString() ?? null,
    participantCount: liveSession._count.attempts,
    quiz: {
      id: liveSession.quiz.id,
      title: liveSession.quiz.title,
      _count: liveSession.quiz._count,
    },
  };
}

export async function getLiveSession(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          instructorId: true,
          questions: {
            select: { id: true, text: true, type: true, points: true, order: true, options: true, answer: true },
            orderBy: { order: "asc" },
          },
        },
      },
      attempts: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { startedAt: "asc" },
      },
    },
  });

  if (!liveSession || liveSession.quiz.instructorId !== session.user.id)
    throw new Error("Not found");

  return {
    id: liveSession.id,
    code: liveSession.code,
    isActive: liveSession.isActive,
    cancelled: liveSession.cancelled,
    currentQuestion: liveSession.currentQuestion,
    startedAt: liveSession.startedAt,
    endedAt: liveSession.endedAt,
    quizId: liveSession.quizId,
    quiz: liveSession.quiz,
    participants: liveSession.attempts.map((a) => ({
      id: a.id,
      userId: a.user.id,
      name: a.user.name,
      email: a.user.email ?? "",
      joinedAt: a.startedAt.toISOString(),
      score: a.score,
    })),
  };
}

export async function cancelLiveSession(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
    include: { quiz: { select: { instructorId: true } } },
  });

  if (!liveSession || liveSession.quiz.instructorId !== session.user.id)
    throw new Error("Not found");
  if (!liveSession.isActive) throw new Error("Session already ended");

  await prisma.liveSession.update({
    where: { id },
    data: { isActive: false, cancelled: true, endedAt: new Date() },
  });
}

export async function endLiveSession(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
    include: { quiz: { select: { instructorId: true } } },
  });

  if (!liveSession || liveSession.quiz.instructorId !== session.user.id)
    throw new Error("Not found");
  if (!liveSession.isActive) throw new Error("Session already ended");

  await prisma.liveSession.update({
    where: { id },
    data: { isActive: false, endedAt: new Date() },
  });
}

export async function getLiveQuestion(sessionId: string, questionNumber: number) {
  const liveSession = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    select: { currentQuestion: true },
  });

  if (!liveSession) throw new Error("Session not found");

  const question = await prisma.question.findFirst({
    where: { quiz: { sessions: { some: { id: sessionId } } }, order: questionNumber },
    select: {
      id: true,
      text: true,
      type: true,
      points: true,
      order: true,
      options: true,
      answer: true,
    },
  });

  if (!question) throw new Error("Question not found");

  return {
    id: question.id,
    text: question.text,
    type: question.type as string,
    points: question.points,
    order: question.order,
    options: question.options as unknown,
    answer: question.answer,
  };
}

export async function startQuizSession(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
    include: {
      quiz: { select: { instructorId: true, _count: { select: { questions: true } } } },
    },
  });

  if (!liveSession || liveSession.quiz.instructorId !== session.user.id)
    throw new Error("Not found");
  if (!liveSession.isActive) throw new Error("Session already ended");
  if (liveSession.quiz._count.questions === 0)
    throw new Error("Quiz has no questions");

  await prisma.liveSession.update({
    where: { id },
    data: { currentQuestion: 1 },
  });
}

export async function advanceQuestion(id: string, questionNumber: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
    include: {
      quiz: { select: { instructorId: true, _count: { select: { questions: true } } } },
    },
  });

  if (!liveSession || liveSession.quiz.instructorId !== session.user.id)
    throw new Error("Not found");
  if (!liveSession.isActive) throw new Error("Session already ended");
  if (questionNumber < 1 || questionNumber > liveSession.quiz._count.questions)
    throw new Error("Invalid question number");

  await prisma.liveSession.update({
    where: { id },
    data: { currentQuestion: questionNumber },
  });
}

export async function getSessionStatus(id: string) {
  const s = await prisma.liveSession.findUnique({
    where: { id },
    select: { isActive: true, cancelled: true, currentQuestion: true, startedAt: true, endedAt: true },
  });
  return s as typeof s & { cancelled: boolean };
}

export async function getSessionParticipants(sessionId: string) {
  const attempts = await prisma.quizAttempt.findMany({
    where: { sessionId },
    select: {
      id: true,
      score: true,
      startedAt: true,
      userId: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { startedAt: "asc" },
  });

  return attempts.map((a) => ({
    id: a.id,
    userId: a.user.id,
    name: a.user.name,
    email: a.user.email ?? "",
    joinedAt: a.startedAt.toISOString(),
    score: a.score,
  }));
}

export async function getStudentAttempt(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.quizAttempt.findFirst({
    where: { sessionId, userId: session.user.id },
    select: {
      id: true,
      score: true,
      totalPoints: true,
      startedAt: true,
      submittedAt: true,
      quiz: {
        select: {
          title: true,
          _count: { select: { questions: true } },
        },
      },
    },
  });

  if (!attempt) throw new Error("Attempt not found");

  return {
    id: attempt.id,
    score: attempt.score,
    totalPoints: attempt.totalPoints,
    startedAt: attempt.startedAt.toISOString(),
    submittedAt: attempt.submittedAt?.toISOString() ?? null,
    quizTitle: attempt.quiz.title,
    totalQuestions: attempt.quiz._count.questions,
  };
}

export type InstructorSessionHistoryItem = {
  id: string;
  code: string;
  isActive: boolean;
  cancelled: boolean;
  startedAt: string;
  endedAt: string | null;
  quizTitle: string;
  quizId: string;
  participantCount: number;
};

export async function getInstructorSessionHistory() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const liveSessions = await prisma.liveSession.findMany({
    where: {
      quiz: { instructorId: session.user.id },
      isActive: false,
    },
    include: {
      quiz: { select: { id: true, title: true } },
      _count: { select: { attempts: true } },
    },
    orderBy: { endedAt: "desc" },
    take: 50,
  });

  return liveSessions.map((s) => ({
    id: s.id,
    code: s.code,
    isActive: s.isActive,
    cancelled: s.cancelled,
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt?.toISOString() ?? null,
    quizTitle: s.quiz.title,
    quizId: s.quiz.id,
    participantCount: s._count.attempts,
  }));
}
