"use client";
import { LoginForm } from "@/components/forms/LoginForm";
import Link from "next/link";
import React from "react";
import Purpleblulb from "../../../assets/purpleblulb.jpg";
import Image from "next/image";
export default function Login() {
  return (
    <div className="min-h-screen flex pt-16">
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/studentregistration"
              className="text-[#56205E] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#56205E] to-[#3A1542] items-center justify-center px-12">
        <div className="flex flex-col items-center max-w-md text-center gap-5">
          <div className="hidden md:flex items-center justify-center w-1/3">
            <Image src={Purpleblulb} alt={"Bulb"} className="rounded-2xl " />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Glad to see you again
          </h2>
          <p className="text-purple-200 leading-relaxed">
            Dive back into your quizzes, track your progress, and keep the
            learning going.
          </p>
        </div>
      </div>
    </div>
  );
}
