"use client";

import { StudentAttempt } from "@/lib/types";
import { CheckCircle, Home, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function StudentResults({ attempt }: { attempt: StudentAttempt }) {
  const router = useRouter();
  const percentage =
    attempt.score != null &&
    attempt.totalPoints != null &&
    attempt.totalPoints > 0
      ? Math.round((attempt.score / attempt.totalPoints) * 100)
      : null;
  const passed = percentage != null && percentage >= 60;

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#56205E]/10 flex items-center justify-center">
          {passed ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-500" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {passed ? "Great job!" : "Keep practicing"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{attempt.quizTitle}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">
              {attempt.score ?? 0}
              <span className="text-lg text-gray-400 font-normal">
                /{attempt.totalPoints ?? 0}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {attempt.totalQuestions} question
              {attempt.totalQuestions !== 1 ? "s" : ""}
            </p>
          </div>

          {percentage != null && (
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  passed
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {percentage}%
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/student/dashboard")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#56205E]/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default StudentResults;
