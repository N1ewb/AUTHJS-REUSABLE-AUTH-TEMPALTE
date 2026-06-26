"use server";

import { LoginFormData } from "@/components/forms/LoginForm";
import { SignupData } from "@/components/forms/StudentRegistrationForm";

import prisma from "@/lib/db";
import { hash } from "bcrypt";
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
        role: roleMap[values.role] ?? Role.STUDENT,
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

export async function logout() {
  try {
    await signOut({ redirect: true });
  } catch (error) {}
}
