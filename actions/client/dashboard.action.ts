"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

type QuizWithSessionAndCount = {
  id: string;
  title: string;
  isPublished: boolean;
  sessions: { id: string }[];
  _count: { questions: number; sessions: number; attempts: number };
};

export type InstructorDashboardData = {
  stats: {
    totalQuizzes: number;
    activeQuizzes: number;
    totalParticipants: number;
    averageScore: number | null;
  };
  recentQuizzes: {
    id: string;
    title: string;
    questionCount: number;
    participantCount: number;
    averageScore: number | null;
    status: "Active" | "Closed" | "Draft";
  }[];
};

export async function getInstructorDashboard(): Promise<InstructorDashboardData> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const instructorId = session.user.id;

  const [totalQuizzes, activeQuizzes, totalParticipants, avgScoreAgg, quizzes] =
    await Promise.all([
      prisma.quiz.count({ where: { instructorId } }),
      prisma.quiz.count({
        where: {
          instructorId,
          sessions: { some: { isActive: true } },
        },
      }),
      prisma.quizAttempt.count({
        where: {
          quiz: { instructorId },
          sessionId: { not: null },
        },
      }),
      prisma.quizAttempt.aggregate({
        where: {
          quiz: { instructorId },
          score: { not: null },
        },
        _avg: { score: true },
      }),
      prisma.quiz.findMany({
        where: { instructorId },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          _count: {
            select: { questions: true, sessions: true, attempts: true },
          },
          sessions: {
            where: { isActive: true },
            select: { id: true },
            take: 1,
          },
        },
      }),
    ]);

  const quizIds = quizzes.map((q: QuizWithSessionAndCount) => q.id);
  const scoreAggs = await prisma.quizAttempt.groupBy({
    by: ["quizId"],
    where: { quizId: { in: quizIds }, score: { not: null } },
    _avg: { score: true },
  });
  const scoreMap = new Map(scoreAggs.map((s) => [s.quizId, s._avg.score]));

  return {
    stats: {
      totalQuizzes,
      activeQuizzes,
      totalParticipants,
      averageScore: avgScoreAgg._avg.score ?? null,
    },
    recentQuizzes: quizzes.map((q: QuizWithSessionAndCount) => {
      const hasActiveSession = q.sessions.length > 0;
      const status = !q.isPublished
        ? "Draft"
        : hasActiveSession
          ? "Active"
          : "Closed";
      return {
        id: q.id,
        title: q.title,
        questionCount: q._count.questions,
        participantCount: q._count.attempts,
        averageScore: scoreMap.get(q.id) ?? null,
        status,
      };
    }),
  };
}
