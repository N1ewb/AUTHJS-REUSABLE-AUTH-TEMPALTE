"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getStandardAttemptResults } from "@/actions/client/standardQuiz.action";

type AttemptResult = {
  score: number | null;
  totalPoints: number | null;
  quizTitle: string;
  totalQuestions: number;
};

function StandardQuizResults({
  attemptId,
  timedOut,
}: {
  attemptId: string;
  timedOut: boolean;
}) {
  const router = useRouter();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStandardAttemptResults(attemptId)
      .then(setResult)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-0">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-0 p-6">
        <p className="text-sm text-gray-500">Results not available.</p>
      </div>
    );
  }

  const percentage =
    result.totalPoints && result.totalPoints > 0
      ? Math.round(((result.score ?? 0) / result.totalPoints) * 100)
      : 0;

  return (
    <div className="flex items-center justify-center flex-1 min-h-0 p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        {timedOut && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-orange-700">
            <Clock className="w-4 h-4" />
            Time ran out! Your answers were submitted automatically.
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-4">
          {percentage >= 50 ? (
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
          ) : (
            <XCircle className="w-12 h-12 mx-auto text-red-500" />
          )}

          <h1 className="text-xl font-semibold text-gray-900">{result.quizTitle}</h1>

          <div className="text-4xl font-bold text-gray-900">{percentage}%</div>

          <div className="text-sm text-gray-500">
            {result.score} / {result.totalPoints} points
          </div>

          <div className="text-sm text-gray-500">
            {result.totalQuestions} question{result.totalQuestions !== 1 ? "s" : ""}
          </div>
        </div>

        <button
          onClick={() => router.push("/student/dashboard")}
          className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default StandardQuizResults;
