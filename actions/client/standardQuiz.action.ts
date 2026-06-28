"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { notifyQuizAttempts } from "@/actions/client/notification.action";
import type { QuizQuestion, QuizQuestionOption, QuestionType } from "@/lib/types";

export async function getQuizByCode(code: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findFirst({
    where: { code, isPublished: true, type: "PREMADE" },
    include: {
      instructor: { select: { id: true, name: true } },
      _count: { select: { questions: true } },
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          text: true,
          type: true,
          points: true,
          order: true,
          options: true,
          answer: true,
        },
      },
    },
  });

  if (!quiz) return null;

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    code: quiz.code,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    maxAttempts: quiz.maxAttempts,
    shuffleQuestions: quiz.shuffleQuestions,
    instructor: quiz.instructor,
    _count: quiz._count,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type as QuestionType,
      points: q.points,
      order: q.order,
      options: q.options as unknown as QuizQuestionOption[] | null,
      answer: q.answer,
    })),
  };
}

export async function startStandardAttempt(quizId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.quizAttempt.findFirst({
    where: { userId: session.user.id, quizId, submittedAt: null, sessionId: null },
    select: { id: true, startedAt: true },
  });

  if (existing) return { attemptId: existing.id, startedAt: existing.startedAt.toISOString() };

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { maxAttempts: true },
  });

  if (!quiz) throw new Error("Quiz not found");

  const completedAttempts = await prisma.quizAttempt.count({
    where: { userId: session.user.id, quizId, submittedAt: { not: null } },
  });

  if (completedAttempts >= quiz.maxAttempts) {
    const latest = await prisma.quizAttempt.findFirst({
      where: { userId: session.user.id, quizId, submittedAt: { not: null } },
      orderBy: { submittedAt: "desc" },
      select: { score: true, totalPoints: true },
    });

    throw new Error(
      JSON.stringify({
        maxedOut: true,
        maxAttempts: quiz.maxAttempts,
        latestScore: latest?.score ?? 0,
        latestTotal: latest?.totalPoints ?? 0,
      }),
    );
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId,
    },
    select: { id: true, startedAt: true },
  });

  return { attemptId: attempt.id, startedAt: attempt.startedAt.toISOString() };
}

export async function submitStandardAnswer(
  attemptId: string,
  questionId: string,
  response: { label: string; text: string },
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: attemptId, userId: session.user.id },
    select: { id: true },
  });

  if (!attempt) throw new Error("Attempt not found");

  await prisma.answer.upsert({
    where: {
      attemptId_questionId: { attemptId, questionId },
    },
    update: { response },
    create: {
      attemptId,
      questionId,
      response,
    },
  });
}

export async function finishStandardAttempt(attemptId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: attemptId, userId: session.user.id },
    include: {
      answers: true,
      quiz: {
        select: {
          questions: {
            select: { id: true, type: true, points: true, options: true, answer: true },
          },
        },
      },
    },
  });

  if (!attempt) throw new Error("Attempt not found");

  const questionMap = new Map(attempt.quiz.questions.map((q) => [q.id, q]));
  let score = 0;
  let totalPoints = 0;

  for (const question of attempt.quiz.questions) {
    totalPoints += question.points;
  }

  for (const answer of attempt.answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    const response = answer.response as { label: string; text: string } | null;
    if (!response) continue;

    let isCorrect = false;

    if (question.type === "MCQ" && Array.isArray(question.options)) {
      const correctOption = (
        question.options as { label: string; text: string; isCorrect: boolean }[]
      ).find((o) => o.isCorrect);
      isCorrect = correctOption?.label === response.label;
    } else if (question.type === "TRUE_FALSE" || question.type === "IDENTIFICATION") {
      isCorrect = question.answer?.toLowerCase() === response.text.toLowerCase();
    }

    await prisma.answer.update({
      where: { id: answer.id },
      data: { isCorrect, pointsAwarded: isCorrect ? question.points : 0 },
    });

    if (isCorrect) {
      score += question.points;
    }
  }

  await prisma.quizAttempt.update({
    where: { id: attemptId },
    data: { score, totalPoints, submittedAt: new Date() },
  });

  await notifyQuizAttempts(attempt.quizId).catch((e) => console.error("notifyQuizAttempts failed", e));

  return { score, totalPoints };
}

export async function getStudentQuizAttemptInfo(quizId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { maxAttempts: true },
  });

  if (!quiz) throw new Error("Quiz not found");

  const completedCount = await prisma.quizAttempt.count({
    where: { userId: session.user.id, quizId, submittedAt: { not: null } },
  });

  const latest = await prisma.quizAttempt.findFirst({
    where: { userId: session.user.id, quizId, submittedAt: { not: null } },
    orderBy: { submittedAt: "desc" },
    select: { score: true, totalPoints: true },
  });

  return {
    maxAttempts: quiz.maxAttempts,
    completedCount,
    remaining: Math.max(0, quiz.maxAttempts - completedCount),
    latestScore: latest?.score ?? null,
    latestTotal: latest?.totalPoints ?? null,
  };
}

export async function getStudentQuizAttempts(quizId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.user.id, quizId, submittedAt: { not: null } },
    orderBy: { submittedAt: "desc" },
    include: {
      answers: {
        select: {
          id: true,
          questionId: true,
          response: true,
          isCorrect: true,
          pointsAwarded: true,
        },
      },
    },
  });

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          text: true,
          type: true,
          points: true,
          order: true,
          options: true,
          answer: true,
        },
      },
    },
  });

  if (!quiz) throw new Error("Quiz not found");

  const questions = quiz.questions.map((q) => {
    const rawOptions = q.options;
    const parsedOptions = typeof rawOptions === "string" ? JSON.parse(rawOptions) : rawOptions;
    return {
      id: q.id,
      text: q.text,
      type: q.type as QuestionType,
      points: q.points,
      order: q.order,
      options: parsedOptions as QuizQuestionOption[] | null,
      answer: q.answer,
    };
  });

  return {
    questions,
    attempts: attempts.map((a) => ({
      id: a.id,
      score: a.score,
      totalPoints: a.totalPoints,
      startedAt: a.startedAt.toISOString(),
      submittedAt: a.submittedAt!.toISOString(),
      answers: a.answers.map((ans) => {
        const raw = ans.response;
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return {
          questionId: ans.questionId,
          response: parsed as { label: string; text: string } | null,
          isCorrect: ans.isCorrect,
          pointsAwarded: ans.pointsAwarded,
        };
      }),
    })),
  };
}

export async function getStandardAttemptResults(attemptId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: attemptId, userId: session.user.id },
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

export async function getStudentAttemptDetail(attemptId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: attemptId, userId: session.user.id },
    include: {
      answers: {
        select: {
          id: true,
          questionId: true,
          response: true,
          isCorrect: true,
          pointsAwarded: true,
        },
      },
      quiz: {
        select: {
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              text: true,
              type: true,
              points: true,
              order: true,
              options: true,
              answer: true,
            },
          },
        },
      },
    },
  });

  if (!attempt) throw new Error("Attempt not found");

  const questions = attempt.quiz.questions.map((q) => {
    const rawOptions = q.options;
    const parsedOptions =
      typeof rawOptions === "string" ? JSON.parse(rawOptions) : rawOptions;
    return {
      id: q.id,
      text: q.text,
      type: q.type as QuestionType,
      points: q.points,
      order: q.order,
      options: parsedOptions as QuizQuestionOption[] | null,
      answer: q.answer,
    };
  });

  return {
    attempt: {
      id: attempt.id,
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      startedAt: attempt.startedAt.toISOString(),
      submittedAt: attempt.submittedAt!.toISOString(),
      answers: attempt.answers.map((ans) => {
        const raw = ans.response;
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return {
          questionId: ans.questionId,
          response: parsed as { label: string; text: string } | null,
          isCorrect: ans.isCorrect,
          pointsAwarded: ans.pointsAwarded,
        };
      }),
    },
    questions,
  };
}
