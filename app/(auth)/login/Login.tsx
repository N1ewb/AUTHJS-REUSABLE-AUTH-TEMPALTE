"use client";
import { LoginForm } from "@/components/forms/LoginForm";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex pt-16">
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-gray-500 mt-6">
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
        <div className="max-w-md text-center">
          <div className="w-64 h-64 mx-auto mb-8 rounded-2xl border-2 border-dashed border-purple-300/50 flex items-center justify-center bg-white/5">
            <span className="text-purple-300/60 text-sm">Insert image</span>
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
