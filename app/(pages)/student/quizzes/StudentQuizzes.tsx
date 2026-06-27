"use client";

import { Clock, FileText } from "lucide-react";

const typeLabels: Record<string, string> = {
  PREMADE: "Pre-made",
  LIVE: "Live",
  PUZZLE: "Puzzle",
  PROGRAMMING: "Programming",
};

type Attempt = {
  id: string;
  score: number | null;
  totalPoints: number | null;
  startedAt: Date;
  submittedAt: Date | null;
  quiz: {
    id: string;
    title: string;
    type: string;
    code: string | null;
    _count: { questions: number };
  };
};

function StudentQuizzes({ history }: { history: Attempt[] }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Quiz History</h1>
        <p className="text-sm text-gray-500 mt-1">
          {history.length} attempt{history.length !== 1 ? "s" : ""}
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#56205E]/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-[#56205E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No quiz history
          </h2>
          <p className="text-sm text-gray-500">
            Join a live quiz from the dashboard to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((attempt) => (
            <div
              key={attempt.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#56205E]/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#56205E]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {attempt.quiz.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span>{typeLabels[attempt.quiz.type] || attempt.quiz.type}</span>
                  <span>·</span>
                  <span>{attempt.quiz._count.questions} questions</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                {attempt.score !== null ? (
                  <p className="text-sm font-semibold text-gray-900">
                    {attempt.score}/{attempt.totalPoints}
                  </p>
                ) : (
                  <p className="text-xs text-yellow-600 font-medium">Incomplete</p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(attempt.startedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentQuizzes;
