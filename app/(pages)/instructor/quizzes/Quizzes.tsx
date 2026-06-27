"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import QuizCard from "@/app/(components)/QuizCard";
import { QuizData } from "@/lib/types";

function Quizzes({ quizzes }: { quizzes: QuizData[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} created
          </p>
        </div>
        <Link
          href="/instructor/quizzes/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#4A1A52] transition"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#56205E]/10 flex items-center justify-center">
            <Plus className="w-8 h-8 text-[#56205E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No quizzes yet
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Create your first quiz to get started
          </p>
          <Link
            href="/instructor/quizzes/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#4A1A52] transition"
          >
            <Plus className="w-4 h-4" />
            Create New Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Quizzes;
