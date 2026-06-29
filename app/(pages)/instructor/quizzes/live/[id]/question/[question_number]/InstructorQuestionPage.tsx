"use client";

import {
  advanceQuestion,
  endLiveSession,
  getQuestionSubmissions,
} from "@/actions/client/quiz.action";
import { QuizQuestion, Submission } from "@/lib/types";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

function InstructorQuestionPage({
  sessionId,
  quizId,
  question,
  questionNumber,
  totalQuestions,
}: {
  sessionId: string;
  quizId: string;
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetch() {
      const data = await getQuestionSubmissions(sessionId, question.id);
      setSubmissions(data);
    }
    fetch();
    intervalRef.current = setInterval(fetch, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId, question.id]);

  function goToQuestion(n: number) {
    startTransition(async () => {
      await advanceQuestion(sessionId, n);
      router.push(`/instructor/quizzes/live/${sessionId}/question/${n}`);
    });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>
          <h2 className="text-lg font-semibold text-card-foreground mt-1">
            {question.text}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {questionNumber > 1 && (
            <button
              disabled={isPending}
              onClick={() => goToQuestion(questionNumber - 1)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
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

      {question.type === "MCQ" && question.options && (
        <div className="space-y-3 mb-6">
          {question.options.map((option) => (
            <div
              key={option.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
            >
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                {option.label}
              </span>
              <span className="text-sm text-card-foreground">
                {option.text}
              </span>
              {option.isCorrect && (
                <span className="ml-auto text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Correct
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="border-t pt-4 flex flex-col min-h-0">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Student Submissions
        </p>
        <div className="flex flex-col min-h-0 gap-2  overflow-auto">
          {submissions.map((s) => (
            <div
              key={s.userId}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  s.submitted ? "bg-green-500" : "bg-red-400"
                }`}
              />
              <span className="text-sm text-muted-foreground">{s.name}</span>
              {s.submitted && s.answer && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Answered: {s.answer}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructorQuestionPage;
