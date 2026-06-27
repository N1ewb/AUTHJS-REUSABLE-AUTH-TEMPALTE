"use client";

import { startStandardAttempt } from "@/actions/client/standardQuiz.action";
import { Loader2, Clock, Target, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type QuizData = {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  timeLimit: number | null;
  passingScore: number | null;
  maxAttempts: number;
  shuffleQuestions: boolean;
  instructor: { id: string; name: string };
  _count: { questions: number };
};

function StudentStandardQuizIntro({ quiz }: { quiz: QuizData }) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    setStarting(true);
    setError("");
    try {
      const { attemptId, startedAt } = await startStandardAttempt(quiz.id);
      const params = new URLSearchParams({ attemptId, startedAt });
      if (quiz.timeLimit) params.set("timeLimit", String(quiz.timeLimit));
      router.push(
        `/student/quizzes/standard/${quiz.code}/question/1?${params.toString()}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start quiz");
      setStarting(false);
    }
  }

  return (
    <div className="flex items-center justify-center flex-1 min-h-0 p-6">
      <div className="max-w-lg w-full space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>

          {quiz.description && (
            <p className="text-sm text-gray-600">{quiz.description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">By {quiz.instructor.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span>{quiz._count.questions} questions</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{quiz.timeLimit} min</span>
              </div>
            )}
            {quiz.passingScore && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4 text-gray-400" />
                <span>Pass: {quiz.passingScore}%</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={starting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {starting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting...
            </>
          ) : (
            "Start Quiz"
          )}
        </button>
      </div>
    </div>
  );
}

export default StudentStandardQuizIntro;
