"use client";

import { ChevronRight } from "lucide-react";

export type AttemptListItem = {
  id: string;
  score: number | null;
  totalPoints: number | null;
  submittedAt: string | Date;
  quiz?: {
    title: string;
    type: string;
    questionsCount: number;
  };
};

export function AttemptsList<T extends AttemptListItem>({
  attempts,
  onSelect,
  header,
}: {
  attempts: T[];
  onSelect: (attempt: T) => void;
  header?: string;
}) {
  if (attempts.length === 0) return null;

  return (
    <div className="flex flex-col min-h-0 w-full overflow-y-auto">
      {header && (
        <h3 className="text-base font-semibold text-card-foreground mb-3">
          {header}
        </h3>
      )}
      <div className="space-y-2">
        {attempts.map((a) => {
          const pct =
            a.score != null && a.totalPoints != null && a.totalPoints > 0
              ? Math.round((a.score / a.totalPoints) * 100)
              : 0;
          const submittedDate =
            a.submittedAt instanceof Date
              ? a.submittedAt
              : new Date(a.submittedAt);
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:border-border hover:bg-muted transition-colors text-left"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  pct >= 60
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {pct}%
              </div>
              <div className="flex-1 min-w-0">
                {a.quiz && (
                  <p className="text-sm font-semibold text-card-foreground">
                    {a.quiz.title}
                  </p>
                )}
                <p className="text-sm font-medium text-card-foreground">
                  Score: {a.score}/{a.totalPoints}
                </p>
                <p className="text-xs text-muted-foreground">
                  Submitted {submittedDate.toLocaleDateString()} at{" "}
                  {submittedDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
