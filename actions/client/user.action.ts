"use server";

import { LoginFormData } from "@/components/forms/LoginForm";
import { SignupData } from "@/components/forms/StudentRegistrationForm";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { hash, compare } from "bcrypt";
import { signIn, signOut } from "@/lib/auth";
import { Prisma, Role } from "@prisma/client";

export async function login(data: LoginFormData) {
  try {
    await signIn("credentials", { redirect: false, ...data });
    return { success: true, message: "Logged In" };
  } catch (error) {
    return { success: false, message: "Incorrect Email or Password" };
  }
}

export async function signUp(values: SignupData) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: values.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists!",
      };
    }

    const hashedPassword = await hash(values.password, 10);
    const name = `${values.first_name} ${values.last_name}`.trim();

    const roleMap: Record<string, Role> = {
      student: Role.STUDENT,
      instructor: Role.INSTRUCTOR,
      admin: Role.INSTRUCTOR,
    };

    await prisma.user.create({
      data: {
        email: values.email,
        name,
        passwordHash: hashedPassword,
        role: roleMap[values.role?.toLowerCase()] ?? Role.STUDENT,
      },
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "User with this email already exists!",
      };
    }
    const message =
      error instanceof Error ? error.message : "An error occurred during sign up";
    return { success: false, message };
  }
}

export async function updateProfile(data: {
  name: string;
  email: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!existing) throw new Error("User not found");

    const updateData: Record<string, string> = {};
    if (data.name.trim()) updateData.name = data.name.trim();
    if (data.email.trim() && data.email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email.trim() },
      });
      if (emailTaken) {
        return { success: false, message: "Email already in use" };
      }
      updateData.email = data.email.trim();
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true, message: "Profile updated" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, message };
  }
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });
    if (!user || !user.passwordHash) {
      return { success: false, message: "No password set for this account" };
    }

    const valid = await compare(data.currentPassword, user.passwordHash);
    if (!valid) {
      return { success: false, message: "Current password is incorrect" };
    }

    if (data.newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters",
      };
    }

    const hashed = await hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hashed },
    });

    return { success: true, message: "Password updated" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to change password";
    return { success: false, message };
  }
}

export async function updateSettings(data: {
  theme?: string;
  notificationPrefs?: Record<string, boolean>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const updateData: Record<string, unknown> = {};
    if (data.theme) updateData.theme = data.theme;
    if (data.notificationPrefs) updateData.notificationPrefs = data.notificationPrefs;

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true, message: "Settings saved" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save settings";
    return { success: false, message };
  }
}

export async function getSettings() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      theme: true,
      notificationPrefs: true,
    },
  });

  if (!user) throw new Error("User not found");

  return {
    name: user.name,
    email: user.email ?? "",
    image: user.image,
    theme: user.theme,
    notificationPrefs: user.notificationPrefs as Record<string, boolean> | null,
  };
}

export async function logout() {
  try {
    await signOut({ redirect: true });
  } catch (error) {}
}
