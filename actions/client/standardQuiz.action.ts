"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
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

  return { score, totalPoints };
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
