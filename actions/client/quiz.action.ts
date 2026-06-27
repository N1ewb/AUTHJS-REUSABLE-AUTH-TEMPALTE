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
    },
  });

  if (!liveSession || liveSession.quiz.instructorId !== session.user.id)
    throw new Error("Not found");

  return liveSession;
}
