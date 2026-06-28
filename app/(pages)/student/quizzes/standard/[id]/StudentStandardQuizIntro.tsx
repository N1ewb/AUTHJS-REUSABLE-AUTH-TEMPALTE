"use client";

import {
  startStandardAttempt,
  getStudentQuizAttemptInfo,
  getStudentQuizAttempts,
} from "@/actions/client/standardQuiz.action";
import {
  Loader2,
  Clock,
  Target,
  MessageCircleQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DefaultBG from "../../../../../../assets/quizpage-default.png";
import Image from "next/image";
import { AttemptReviewModal } from "@/app/(components)/StudentAttemptResultModal";
import { AttemptsList } from "@/app/(components)/AttemptsList";

type QuizData = {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  timeLimit: number | null;
  passingScore: number | null;
  maxAttempts: number;
  tags?: unknown;
  shuffleQuestions: boolean;
  instructor: { id: string; name: string };
  _count: { questions: number };
};

export type AttemptData = {
  id: string;
  score: number | null;
  totalPoints: number | null;
  startedAt: string;
  submittedAt: string;
  answers: {
    questionId: string;
    response: { label: string; text: string } | null;
    isCorrect: boolean | null;
    pointsAwarded: number;
  }[];
};

export type QuestionData = {
  id: string;
  text: string;
  type: string;
  points: number;
  order: number;
  options: { label: string; text: string; isCorrect: boolean }[] | null;
  answer: string | null;
};

function StudentStandardQuizIntro({ quiz }: { quiz: QuizData }) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [attemptInfo, setAttemptInfo] = useState<{
    maxAttempts: number;
    completedCount: number;
    remaining: number;
    latestScore: number | null;
    latestTotal: number | null;
  } | null>(null);
  const [attempts, setAttempts] = useState<AttemptData[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptData | null>(
    null,
  );

  useEffect(() => {
    getStudentQuizAttemptInfo(quiz.id)
      .then(setAttemptInfo)
      .catch(() => {});
    getStudentQuizAttempts(quiz.id)
      .then((data) => {
        setAttempts(data.attempts);
        setQuestions(data.questions);
      })
      .catch(() => {});
  }, [quiz.id]);

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
      const msg = e instanceof Error ? e.message : "Failed to start quiz";
      try {
        const parsed = JSON.parse(msg);
        if (parsed.maxedOut) {
          setAttemptInfo({
            maxAttempts: parsed.maxAttempts,
            completedCount: parsed.maxAttempts,
            remaining: 0,
            latestScore: parsed.latestScore,
            latestTotal: parsed.latestTotal,
          });
        }
      } catch {
        setError(msg);
      }
      setStarting(false);
    }
  }

  const maxedOut = attemptInfo && attemptInfo.remaining === 0;
  const tags: string[] = Array.isArray(quiz.tags) ? quiz.tags : [];
  return (
    <div className="flex flex-col items-start flex-1 min-h-0 gap-5">
      <div className="w-full flex flex-col min-h-0 gap-5">
        <div className="flex justify-between bg-card rounded-xl border border-border p-6 ">
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{quiz.title}</h1>

              {quiz.description && (
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-muted-foreground">
                  By {quiz.instructor.name}
                </span>
              </div>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#56205E]/10 text-[#56205E] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageCircleQuestion className="p-1 text-muted-foreground" />
                <span>{quiz._count.questions} questions</span>
              </div>
              <p className="text-lg">·</p>
              {quiz.timeLimit && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{quiz.timeLimit} min</span>
                </div>
              )}
              <p className="text-lg">·</p>
              {quiz.passingScore && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span>Pass: {quiz.passingScore}%</span>
                </div>
              )}
              <p className="text-lg">·</p>
            </div>
            <div className="flex gap-5">
              <p className="flex flex-col text-[#56205E] text-sm">
                Score{" "}
                <span className="text-2xl font-semibold">
                  {attemptInfo && attemptInfo.latestScore != null
                    ? Math.round(attemptInfo.latestScore)
                    : "—"}
                </span>
              </p>
              <div className="line w-[1px] h-full bg-gray-400"></div>
              {attemptInfo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p className="flex flex-col text-[#56205E] text-sm">
                    Attempts{" "}
                    <span className="text-2xl font-semibold">
                      {attemptInfo.completedCount}
                    </span>
                  </p>
                </div>
              )}
              <div className="line w-[1px] h-full bg-gray-400"></div>
              <button
                onClick={handleStart}
                disabled={starting || !!maxedOut}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#56205E] text-white rounded-xl text-sm font-semibold hover:bg-[#B343C4] transition-colors disabled:opacity-50"
              >
                {starting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting...
                  </>
                ) : maxedOut ? (
                  "No Attempts Remaining"
                ) : (
                  "Start Quiz"
                )}
              </button>
            </div>
          </div>
          <div className="w-[30%]">
            <Image src={DefaultBG} alt={"DefaultBG"} className="rounded-2xl" />
          </div>
        </div>

        {maxedOut && attemptInfo.latestTotal != null && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-4 text-sm">
            <p className="font-medium text-amber-800 mb-1">
              You&apos;ve used all {attemptInfo.maxAttempts} attempts
            </p>
            <p className="text-amber-700">
              Latest score: {attemptInfo.latestScore}/{attemptInfo.latestTotal}{" "}
              (
              {attemptInfo.latestTotal > 0
                ? Math.round(
                    (attemptInfo.latestScore! / attemptInfo.latestTotal) * 100,
                  )
                : 0}
              %)
            </p>
          </div>
        )}

        {error && !maxedOut && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <AttemptsList
        attempts={attempts}
        onSelect={(a) => setSelectedAttempt(a)}
        header="Your Attempts"
      />

      {selectedAttempt && (
        <AttemptReviewModal
          attempt={selectedAttempt}
          questions={questions}
          open={!!selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
}

export default StudentStandardQuizIntro;
