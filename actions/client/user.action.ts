"use server";

import { LoginFormData } from "@/components/forms/LoginForm";
import { SignupData } from "@/components/forms/RegisterForm";

import api from "@/lib/api";
import { signIn, signOut } from "@/lib/auth";

export async function login(data: LoginFormData) {
  try {
    await signIn("credentials", { redirect: false, ...data });
    return { success: true, message: "Logged In" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Incorrect Email or Password" };
  }
}

export async function signUp(values: SignupData) {
  try {
    const res = await api.post("/signup", values);
    console.log("RES: ", res.status);
    if (res.status === 201) {
      return res;
    }
  } catch (error) {
    console.log("Error in signing up", error);
  }
}

export async function logout() {
  try {
    await signOut({ redirect: true });
  } catch (error) {
    console.error("Error in signing out:", error);
  }
}
