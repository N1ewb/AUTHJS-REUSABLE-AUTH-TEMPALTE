"use client";

import { Attempt, typeLabels } from "@/lib/types";
import { Clock } from "lucide-react";
import { useState } from "react";
import { AttemptsList } from "@/app/(components)/AttemptsList";
import { AttemptReviewModal } from "@/app/(components)/StudentAttemptResultModal";
import { getStudentAttemptDetail } from "@/actions/client/standardQuiz.action";
import type {
  AttemptData,
  QuestionData,
} from "@/app/(pages)/student/quizzes/standard/[id]/StudentStandardQuizIntro";

function HistoryPage({ history }: { history: Attempt[] }) {
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptData | null>(
    null,
  );
  const [reviewQuestions, setReviewQuestions] = useState<QuestionData[]>([]);
  const [, setLoading] = useState(false);
  const items = history.map((a) => ({
    id: a.id,
    score: a.score,
    totalPoints: a.totalPoints,
    submittedAt: a.submittedAt ?? a.startedAt,
    quiz: {
      title: a.quiz.title,
      type: typeLabels[a.quiz.type] || a.quiz.type,
      questionsCount: a.quiz._count.questions,
    },
  }));

  async function handleSelect(attemptId: string) {
    setLoading(true);
    try {
      const data = await getStudentAttemptDetail(attemptId);
      setSelectedAttempt(data.attempt);
      setReviewQuestions(data.questions);
    } catch {
      setSelectedAttempt(null);
      setReviewQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-0 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-card-foreground">Quiz History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {history.length} attempt{history.length !== 1 ? "s" : ""}
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#56205E]/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-[#56205E]" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            No quiz history
          </h2>
          <p className="text-sm text-muted-foreground">
            Join a live quiz from the dashboard to get started.
          </p>
        </div>
      ) : (
        <AttemptsList attempts={items} onSelect={(a) => handleSelect(a.id)} />
      )}

      {selectedAttempt && (
        <AttemptReviewModal
          attempt={selectedAttempt}
          questions={reviewQuestions}
          open={!!selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
}

export default HistoryPage;
