"use server";

import { LoginFormData } from "@/components/forms/LoginForm";
import { SignupData } from "@/components/forms/RegisterForm";

import prisma from "@/lib/db";
import { hash } from "bcrypt";
import { signIn, signOut } from "@/lib/auth";
import { Prisma } from "@prisma/client";

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
      return { success: false, message: "User with this email already exists!" };
    }

    const hashedPassword = await hash(values.password, 10);

    await prisma.user.create({
      data: {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: hashedPassword,
        role: "user",
      },
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, message: "User with this email already exists!" };
    }
    return { success: false, message: "An error occurred during sign up" };
  }
}

export async function logout() {
  try {
    await signOut({ redirect: true });
  } catch (error) {
  }
}
