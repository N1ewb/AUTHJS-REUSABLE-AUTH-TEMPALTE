"use client";

import QuizzesList from "./QuizzesList";
import AttemptsHistory from "./AttemptsHistory";
import type { InstructorSessionHistoryItem } from "@/actions/client/quiz.action";
import { QuizData } from "@/lib/types";

function QuizzesSection({
  quizzes,
  sessions,
}: {
  quizzes: QuizData[];
  sessions: InstructorSessionHistoryItem[];
}) {
  return (
    <div className="space-y-12 flex flex-col min-h-0 min-w-0">
      <QuizzesList quizzes={quizzes} />
      <div className="border-t pt-10 flex flex-col min-h-0">
        <AttemptsHistory sessions={sessions} />
      </div>
    </div>
  );
}

export default QuizzesSection;
