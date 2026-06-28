"use client";

import { SessionData } from "@/lib/types";
import {
  FileText,
  Users,
  XCircle,
  CheckCircle,
  Trophy,
} from "lucide-react";

function AttemptDetailPage({ session }: { session: SessionData }) {
  const totalPoints = session.quiz.questions.reduce(
    (sum: number, q) => sum + q.points,
    0,
  );

  const ranked = [...session.participants].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6 mx-auto w-full">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-card-foreground">
            {session.quiz.title}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{new Date(session.startedAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {session.participants.length} participant
              {session.participants.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {session.quiz.questions.length} questions
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {totalPoints} pts
            </span>
          </div>
        </div>

        <span
          className={`shrink-0 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${
            session.cancelled
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {session.cancelled ? (
            <XCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {session.cancelled ? "Cancelled" : "Completed"}
        </span>
      </div>

      <div className="bg-card rounded-xl border  flex flex-col min-h-0 ">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-card-foreground">
            Participants ({session.participants.length})
          </h2>
        </div>

        {session.participants.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No participants joined this session.
            </p>
          </div>
        ) : (
          <div className="divide-y flex flex-col min-h-0 overflow-auto">
            {ranked.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-sm text-muted-foreground font-medium text-center">
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#56205E]/10 flex items-center justify-center text-sm font-medium text-[#56205E]">
                    {p.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {p.name ?? "Anonymous"}
                    </p>
                    {p.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {p.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-card-foreground">
                    {p.score ?? 0}/{totalPoints}
                  </span>
                  {totalPoints > 0 && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        (p.score ?? 0) >= totalPoints * 0.6
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {Math.round(((p.score ?? 0) / totalPoints) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttemptDetailPage;
