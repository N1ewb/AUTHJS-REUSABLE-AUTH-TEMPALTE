"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { notifyStudentConnected } from "@/actions/client/notification.action";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function getInstructorInviteCode(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { inviteCode: true },
  });

  if (user?.inviteCode) return user.inviteCode;

  let code = generateInviteCode();
  while (await prisma.user.findUnique({ where: { inviteCode: code } })) {
    code = generateInviteCode();
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { inviteCode: code },
  });

  const verify = await prisma.user.findFirst({ where: { inviteCode: code }, select: { id: true } });
  if (!verify) {
    throw new Error("Invite code save failed - code not findable after save");
  }

  return code;
}

export type ConnectedInstructor = {
  instructorId: string;
  instructorName: string;
  quizzes: {
    id: string;
    title: string;
    description: string | null;
    questionCount: number;
  }[];
};

export async function linkStudentToInstructor(inviteCode: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const instructor = await prisma.user.findFirst({
    where: { inviteCode },
    select: { id: true, name: true, role: true },
  });

  if (!instructor || instructor.role !== "INSTRUCTOR") {
    throw new Error(`Invalid invite code: "${inviteCode}"`);
  }

  const existing = await prisma.studentInstructor.findFirst({
    where: {
      studentId: session.user.id,
      instructorId: instructor.id,
    },
  });

  if (existing) {
    throw new Error("You are already connected with this instructor");
  }

  await prisma.studentInstructor.create({
    data: {
      studentId: session.user.id,
      instructorId: instructor.id,
    },
  });

  await notifyStudentConnected(instructor.id, session.user.name ?? "A student").catch((e) => console.error("notifyStudentConnected failed", e));
}

export async function getConnectedInstructors(): Promise<ConnectedInstructor[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const connections = await prisma.studentInstructor.findMany({
    where: { studentId: session.user.id },
    select: {
      instructor: {
        select: {
          id: true,
          name: true,
          quizzes: {
            where: { isPublished: true, type: "PREMADE" },
            select: {
              id: true,
              title: true,
              description: true,
              _count: { select: { questions: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  return connections.map((c) => ({
    instructorId: c.instructor.id,
    instructorName: c.instructor.name,
    quizzes: c.instructor.quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      questionCount: q._count.questions,
    })),
  }));
}

export type ConnectedStudent = {
  id: string;
  name: string;
  email: string | null;
  joinedAt: string;
};

export async function getInstructorStudents(): Promise<ConnectedStudent[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const connections = await prisma.studentInstructor.findMany({
    where: { instructorId: session.user.id },
    select: {
      createdAt: true,
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return connections.map((c) => ({
    id: c.student.id,
    name: c.student.name,
    email: c.student.email,
    joinedAt: c.createdAt.toISOString(),
  }));
}
