"use client";

import {
  submitStandardAnswer,
  finishStandardAttempt,
} from "@/actions/client/standardQuiz.action";
import type { QuizQuestion } from "@/lib/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Send,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

function StandardQuestionPage({
  quizCode,
  question,
  questionNumber,
  totalQuestions,
}: {
  quizCode: string;
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId") ?? "";
  const startedAt = searchParams.get("startedAt") ?? "";
  const timeLimitParam = searchParams.get("timeLimit");
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const expiredRef = useRef(false);

  const timeLimit = timeLimitParam ? parseInt(timeLimitParam) : null;

  useEffect(() => {
    if (!timeLimit || !startedAt) return;

    const endTime = new Date(startedAt).getTime() + timeLimit * 60 * 1000;

    function tick() {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        finishStandardAttempt(attemptId).then(() => {
          const params = new URLSearchParams({ attemptId, timedOut: "1" });
          router.replace(
            `/student/quizzes/standard/${quizCode}/results?${params.toString()}`,
          );
        });
        return;
      }

      setTimeLeft(remaining);
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timeLimit, startedAt, attemptId, quizCode, router]);

  function buildNavParams() {
    const p = new URLSearchParams({ attemptId, startedAt });
    if (timeLimit) p.set("timeLimit", String(timeLimit));
    return p.toString();
  }

  function handleSelect(label: string, text: string) {
    if (isPending) return;
    setSelected(label);
    startTransition(async () => {
      await submitStandardAnswer(attemptId, question.id, { label, text });
    });
  }

  function handleIdentificationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || !selected) return;
    startTransition(async () => {
      await submitStandardAnswer(attemptId, question.id, { label: "", text: selected });
    });
  }

  async function handleNext() {
    if (questionNumber < totalQuestions) {
      router.push(
        `/student/quizzes/standard/${quizCode}/question/${questionNumber + 1}?${buildNavParams()}`,
      );
    }
  }

  async function handleFinish() {
    if (expiredRef.current) return;
    expiredRef.current = true;
    startTransition(async () => {
      await finishStandardAttempt(attemptId);
      router.push(`/student/quizzes/standard/${quizCode}/results?attemptId=${attemptId}`);
    });
  }

  function handlePrev() {
    if (questionNumber > 1) {
      router.push(
        `/student/quizzes/standard/${quizCode}/question/${questionNumber - 1}?${buildNavParams()}`,
      );
    }
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const timerUrgent = timeLeft !== null && timeLeft <= 60;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Timer bar */}
      {timeLimit && timeLeft !== null && (
        <div
          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border-b transition-colors ${
            timerUrgent
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-muted border-border text-muted-foreground"
          }`}
        >
          <Clock className={`w-4 h-4 ${timerUrgent ? "animate-pulse" : ""}`} />
          {timerUrgent ? "Time running out! " : "Time left: "}
          {formatTime(timeLeft)}
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </p>
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
                  disabled={isPending || expiredRef.current}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors disabled:opacity-50 ${
                    selected === option.label
                      ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                      : "border-border hover:border-border hover:bg-muted"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                      selected === option.label
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-sm text-card-foreground">{option.text}</span>
                  {isPending && selected === option.label && (
                    <Loader2 className="w-4 h-4 animate-spin ml-auto shrink-0 text-emerald-600" />
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
                  disabled={isPending || expiredRef.current}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border text-sm font-medium transition-colors disabled:opacity-50 ${
                    selected === value
                      ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                      : "border-border hover:border-border hover:bg-muted"
                  }`}
                >
                  {value}
                  {isPending && selected === value && (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
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
                disabled={isPending || expiredRef.current}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isPending || !selected || expiredRef.current}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                <Send className="w-4 h-4" />
                Submit Answer
              </button>
            </form>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={questionNumber <= 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {questionNumber < totalQuestions ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isPending || expiredRef.current}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandardQuestionPage;
