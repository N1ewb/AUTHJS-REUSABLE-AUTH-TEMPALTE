"use client";

import { Users, XCircle, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";

type SessionItem = {
  id: string;
  code: string;
  isActive: boolean;
  cancelled: boolean;
  startedAt: string;
  endedAt: string | null;
  participantCount: number;
};

function QuizAttemptsList({ sessions }: { sessions: SessionItem[] }) {
  return (
    <div className="flex flex-col min-h-0 p-6 mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-card-foreground">
          Attempt History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-sm font-medium text-card-foreground mb-1">
            No attempts yet
          </h2>
          <p className="text-sm text-muted-foreground">
            Conduct a live session to see attempts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Link
              key={s.id}
              href={`/instructor/quizzes/attempts/${s.id}`}
              className="block bg-card rounded-xl border p-4 hover:border-[#56205E]/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#56205E]/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#56205E]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-card-foreground">
                      Session {s.code}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {new Date(s.startedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {s.participantCount}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                    s.isActive
                      ? "bg-green-100 text-green-700"
                      : s.cancelled
                        ? "bg-red-50 text-red-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.isActive ? (
                    "Active"
                  ) : s.cancelled ? (
                    <>
                      <XCircle className="w-3 h-3" /> Cancelled
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3" /> Completed
                    </>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizAttemptsList;
