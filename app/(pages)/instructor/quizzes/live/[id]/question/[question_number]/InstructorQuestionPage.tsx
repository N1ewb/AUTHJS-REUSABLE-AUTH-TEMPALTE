"use client";

import { advanceQuestion, endLiveSession } from "@/actions/client/quiz.action";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function InstructorQuestionPage({
  sessionId,
  quizId,
  question,
  questionNumber,
  totalQuestions,
}: {
  sessionId: string;
  quizId: string;
  question: {
    id: string;
    text: string;
    type: string;
    points: number;
    order: number;
    options: unknown;
    answer: string | null;
  };
  questionNumber: number;
  totalQuestions: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function goToQuestion(n: number) {
    startTransition(async () => {
      await advanceQuestion(sessionId, n);
      router.push(
        `/instructor/quizzes/live/${sessionId}/question/${n}`
      );
    });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </p>
          <h2 className="text-lg font-semibold text-gray-900 mt-1">
            {question.text}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {questionNumber > 1 && (
            <button
              disabled={isPending}
              onClick={() => goToQuestion(questionNumber - 1)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          )}
          {questionNumber < totalQuestions ? (
            <button
              disabled={isPending}
              onClick={() => goToQuestion(questionNumber + 1)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Loading..." : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await endLiveSession(sessionId);
                  router.push(`/instructor/quizzes/${quizId}`);
                })
              }
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              {isPending ? "Ending..." : "End Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorQuestionPage;
