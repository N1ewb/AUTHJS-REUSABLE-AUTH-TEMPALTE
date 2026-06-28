"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

export async function getNotifications(): Promise<AppNotification[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const role = session.user.role?.toLowerCase();

  const dbNotifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  }) as unknown as {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    read: boolean;
    href: string | null;
  }[];

  const results: AppNotification[] = dbNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    createdAt: n.createdAt.toISOString(),
    read: n.read,
    href: n.href ?? undefined,
  }));

  if (role === "student") {
    const activeSession = await prisma.liveSession.findFirst({
      where: {
        attempts: { some: { userId, submittedAt: null } },
        isActive: true,
      },
      select: { id: true, code: true, quiz: { select: { title: true } } },
    });

    if (activeSession) {
      results.unshift({
        id: "active-session",
        title: "Rejoin active session",
        body: `You have an active session: ${activeSession.quiz.title} (${activeSession.code})`,
        createdAt: new Date().toISOString(),
        read: false,
        href: `/student/quizzes/live/${activeSession.id}/question/1`,
      });
    }
  }

  return results;
}

export async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  let count = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });

  if (session.user.role?.toLowerCase() === "student") {
    const hasActiveSession = await prisma.liveSession.findFirst({
      where: {
        attempts: { some: { userId: session.user.id, submittedAt: null } },
        isActive: true,
      },
      select: { id: true },
    });
    if (hasActiveSession) count += 1;
  }

  return count;
}

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  href?: string,
) {
  await prisma.notification.create({
    data: { userId, title, body, href },
  });
}

export async function markAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { read: true },
  });
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
}

export async function notifyQuizPublished(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { title: true, code: true, instructorId: true },
  });
  if (!quiz) return;

  const connections = await prisma.studentInstructor.findMany({
    where: { instructorId: quiz.instructorId },
    select: { studentId: true },
  }) as unknown as { studentId: string }[];

  if (connections.length === 0) return;

  const title = "New quiz published";
  const body = `Your instructor published a new quiz: ${quiz.title}`;
  const href = quiz.code
    ? `/student/quizzes/standard/${quiz.code}`
    : undefined;

  await prisma.notification.createMany({
    data: connections.map((c) => ({
      userId: c.studentId,
      title,
      body,
      href,
    })),
  });
}

export async function notifyStudentConnected(instructorId: string, studentName: string) {
  await createNotification(
    instructorId,
    "New student connected",
    `${studentName} has connected using your invite code.`,
    "/instructor/students",
  );
}

export async function notifyQuizAttempts(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { title: true, instructorId: true },
  });
  if (!quiz) return;

  const attemptCount = await prisma.quizAttempt.count({
    where: { quizId, submittedAt: { not: null } },
  });

  const existing = await prisma.notification.findFirst({
    where: {
      userId: quiz.instructorId,
      title: { startsWith: "New attempts" },
      body: { contains: quiz.title },
      read: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    await prisma.notification.update({
      where: { id: existing.id },
      data: { body: `"${quiz.title}" received ${attemptCount} attempt${attemptCount !== 1 ? "s" : ""} so far.` },
    });
  } else {
    await createNotification(
      quiz.instructorId,
      "New quiz attempts",
      `"${quiz.title}" received ${attemptCount} attempt${attemptCount !== 1 ? "s" : ""}.`,
      `/instructor/quizzes/${quizId}`,
    );
  }
}
