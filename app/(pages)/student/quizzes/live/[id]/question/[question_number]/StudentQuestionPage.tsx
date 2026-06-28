"use client";

import { getSessionStatus, submitAnswer } from "@/actions/client/quiz.action";
import { QuizQuestion } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

function StudentQuestionPage({
  sessionId,
  question,
  questionNumber,
}: {
  sessionId: string;
  question: QuizQuestion;
  questionNumber: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);
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

        if (
          status.currentQuestion &&
          status.currentQuestion !== questionNumber
        ) {
          router.push(
            `/student/quizzes/live/${sessionId}/question/${status.currentQuestion}`,
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

  function handleSelect(label: string, text: string) {
    if (isPending) return;
    setSelected(label);
    startTransition(async () => {
      await submitAnswer(sessionId, question.id, { label, text });
    });
  }

  function handleIdentificationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || !selected) return;
    startTransition(async () => {
      await submitAnswer(sessionId, question.id, { label: "", text: selected });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Question {questionNumber}</p>
          <p className="text-sm text-muted-foreground">
            {question.points} pt{question.points !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-lg font-medium text-card-foreground">{question.text}</p>
        </div>

        {question.type === "MCQ" && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleSelect(option.label, option.text)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors disabled:opacity-50 ${
                  selected === option.label
                    ? "border-[#56205E] bg-[#56205E]/5 ring-1 ring-[#56205E]"
                    : "border-border hover:border-border hover:bg-muted"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                    selected === option.label
                      ? "bg-[#56205E] text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-sm text-card-foreground">{option.text}</span>
                {isPending && selected === option.label && (
                  <Loader2 className="w-4 h-4 animate-spin ml-auto shrink-0 text-[#56205E]" />
                )}
              </button>
            ))}
          </div>
        )}

        {question.type === "TRUE_FALSE" && (
          <div className="flex gap-3">
            {["True", "False"].map((value) => (
              <button
                key={value}
                onClick={() => handleSelect(value, value)}
                disabled={isPending}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border text-sm font-medium transition-colors disabled:opacity-50 ${
                  selected === value
                    ? "border-[#56205E] bg-[#56205E]/5 ring-1 ring-[#56205E]"
                    : "border-border hover:border-border hover:bg-muted"
                }`}
              >
                {value}
                {isPending && selected === value && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#56205E]" />
                )}
              </button>
            ))}
          </div>
        )}

        {question.type === "IDENTIFICATION" && (
          <form onSubmit={handleIdentificationSubmit} className="space-y-3">
            <input
              type="text"
              value={selected ?? ""}
              onChange={(e) => setSelected(e.target.value)}
              placeholder="Type your answer..."
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPending || !selected}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#56205E] text-white text-sm font-medium hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Answer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default StudentQuestionPage;
