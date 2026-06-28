"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Users,
  XCircle,
  CheckCircle,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import type { InstructorSessionHistoryItem } from "@/actions/client/quiz.action";

function AttemptsHistory({
  sessions,
}: {
  sessions: InstructorSessionHistoryItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredSessions = useMemo(() => {
    let result = [...sessions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.quizTitle.toLowerCase().includes(q));
    }

    if (statusFilter === "completed") {
      result = result.filter((s) => !s.cancelled);
    } else if (statusFilter === "cancelled") {
      result = result.filter((s) => s.cancelled);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.startedAt).getTime();
      const dateB = new Date(b.startedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [sessions, searchQuery, statusFilter, sortOrder]);

  if (sessions.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-card-foreground mb-2">
          No sessions yet
        </h2>
        <p className="text-sm text-muted-foreground">
          Conduct a live quiz to see its history here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">
          Attempts History
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredSessions.length} of {sessions.length} session
          {sessions.length !== 1 ? "s" : ""} conducted
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by quiz title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E]"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E]"
          >
            <option value="all">All Sessions</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
            className="flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No sessions match your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex flex-col min-h-0 overflow-auto scroll-smooth">
          {filteredSessions.map((s) => (
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
                    <p className="font-medium text-card-foreground truncate">
                      {s.quizTitle}
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
                    s.cancelled
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {s.cancelled ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {s.cancelled ? "Cancelled" : "Completed"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttemptsHistory;
