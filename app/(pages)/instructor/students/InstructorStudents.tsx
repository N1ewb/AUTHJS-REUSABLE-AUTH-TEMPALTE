"use client";

import {
  getInstructorInviteCode,
  getInstructorStudents,
  type ConnectedStudent,
} from "@/actions/client/instructorStudent.action";
import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Check,
  KeyRound,
  Users,
  Mail,
  Calendar,
  Search,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from "lucide-react";

function InstructorStudents() {
  const [inviteCode, setInviteCode] = useState("");
  const [students, setStudents] = useState<ConnectedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc"
  >("newest");

  useEffect(() => {
    Promise.all([getInstructorInviteCode(), getInstructorStudents()])
      .then(([code, students]) => {
        setInviteCode(code);
        setStudents(students);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function copyCode() {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();
    let result = students;
    if (query) {
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.email?.toLowerCase().includes(query),
      );
    }
    return result.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "name-desc":
          return (b.name ?? "").localeCompare(a.name ?? "");
        case "oldest":
          return (
            new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
          );
        default:
          return (
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
          );
      }
    });
  }, [students, search, sort]);

  return (
    <div className="flex flex-1 min-h-0 p-6 mx-auto w-full">
      <div className="flex flex-col min-h-0 flex-1 min-w-0 mx-auto gap-5">
        <div className="flex items-center justify-between ">
          <h1 className="text-xl font-semibold text-card-foreground ">
            Students
          </h1>
          <div className="flex items-center gap-3 ">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-input bg-transparent p-0.5">
              {[
                { key: "newest", label: "Newest", icon: ArrowDownWideNarrow },
                { key: "oldest", label: "Oldest", icon: ArrowUpWideNarrow },
                { key: "name-asc", label: "A-Z", icon: ArrowUpDown },
                { key: "name-desc", label: "Z-A", icon: ArrowUpDown },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSort(key as typeof sort)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    sort === key
                      ? "bg-[#56205E] text-white"
                      : "text-muted-foreground hover:text-card-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-44 bg-muted rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded-lg" />
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-32 bg-muted rounded" />
                      <div className="h-3 w-48 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#56205E]/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#56205E]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Invite Code
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Share this code with students to connect
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {inviteCode && (
                  <span className="text-lg font-mono font-bold tracking-[0.2em] text-[#56205E]">
                    {inviteCode}
                  </span>
                )}
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex flex-col min-h-0 ">
              <p className="text-sm text-muted-foreground mb-3">
                {filteredStudents.length} of {students.length} student
                {students.length !== 1 ? "s" : ""}
              </p>

              {filteredStudents.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <h2 className="text-sm font-medium text-card-foreground mb-1">
                    {search
                      ? "No students match your search"
                      : "No connected students yet"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {search
                      ? "Try a different name or email."
                      : "Students who enter your invite code will appear here."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col min-h-0 bg-card rounded-xl border border-border">
                  <div className="divide-y flex flex-col min-h-0 overflow-y-auto">
                    {filteredStudents.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 px-5 py-3.5"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#56205E]/10 flex items-center justify-center text-sm font-medium text-[#56205E] shrink-0">
                          {s.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {s.name}
                          </p>
                          {s.email && (
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {s.email}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(s.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InstructorStudents;
