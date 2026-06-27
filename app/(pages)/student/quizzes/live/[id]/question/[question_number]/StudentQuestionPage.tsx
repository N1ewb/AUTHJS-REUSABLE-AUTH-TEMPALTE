"use client";

import { getSessionStatus } from "@/actions/client/quiz.action";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function StudentQuestionPage({
  sessionId,
  question,
  questionNumber,
}: {
  sessionId: string;
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
}) {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const status = await getSessionStatus(sessionId);
        if (!status) return;

        if (!status.isActive) {
          if (status.cancelled) {
            router.push(`/student/quizzes/live/${sessionId}`);
          } else {
            router.push(`/student/quizzes/live/${sessionId}/results`);
          }
          return;
        }

        if (status.currentQuestion && status.currentQuestion !== questionNumber) {
          router.push(
            `/student/quizzes/live/${sessionId}/question/${status.currentQuestion}`
          );
        }
      } catch {
        // ignore polling errors
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId, questionNumber, router]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Question {questionNumber}</p>
          <p className="text-sm text-gray-400">{question.points} pt{question.points !== 1 ? "s" : ""}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-lg font-medium text-gray-900">{question.text}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentQuestionPage;
