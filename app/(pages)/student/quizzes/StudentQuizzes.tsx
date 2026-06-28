"use client";

import { getStudentPublishedQuizzes } from "@/actions/client/quiz.action";
import { QuizData } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Search, ArrowUpDown } from "lucide-react";
import QuizCard from "@/app/(components)/QuizCard";
import QuizCardSkeleton from "@/app/(components)/QuizCardSkeleton";

type InstructorGroup = {
  instructor: { id: string; name: string };
  quizzes: QuizData[];
};

function StudentQuizzes() {
  const [groups, setGroups] = useState<InstructorGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    getStudentPublishedQuizzes()
      .then(setGroups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    groups.forEach((g) =>
      g.quizzes.forEach((q) => {
        if (Array.isArray(q.tags))
          (q.tags as string[]).forEach((t) => tags.add(t));
      }),
    );
    return Array.from(tags).sort();
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        let results = [...group.quizzes];

        if (
          instructorFilter !== "all" &&
          group.instructor.id !== instructorFilter
        ) {
          return { ...group, quizzes: [] };
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          results = results.filter(
            (quiz) =>
              quiz.title.toLowerCase().includes(q) ||
              (quiz.description ?? "").toLowerCase().includes(q),
          );
        }

        if (tagFilter !== "all") {
          results = results.filter(
            (quiz) =>
              Array.isArray(quiz.tags) &&
              (quiz.tags as string[]).includes(tagFilter),
          );
        }

        results.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

        return { ...group, quizzes: results };
      })
      .filter((g) => g.quizzes.length > 0);
  }, [groups, searchQuery, tagFilter, instructorFilter, sortOrder]);

  const allFlattened = useMemo(
    () => groups.flatMap((g) => g.quizzes),
    [groups],
  );

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              <div className="w-32 h-5 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex gap-4 overflow-x-auto">
              <QuizCardSkeleton />
              <QuizCardSkeleton />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#56205E]/10 flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-[#56205E]" />
        </div>
        <h2 className="text-lg font-semibold text-card-foreground mb-2">
          No quizzes available
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Connect with an instructor to see their published quizzes here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-6 min-h-0">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E] text-black "
          >
            <option value="all">All Instructors</option>
            {groups.map((g) => (
              <option key={g.instructor.id} value={g.instructor.id}>
                {g.instructor.name}
              </option>
            ))}
          </select>
          {allTags.length > 0 && (
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E] text-black "
            >
              <option value="all">All Tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
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

      {allFlattened.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {filteredGroups.reduce((s, g) => s + g.quizzes.length, 0)} of{" "}
          {allFlattened.length} quiz
          {allFlattened.length !== 1 ? "zes" : ""}
        </p>
      )}

      {filteredGroups.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No quizzes match your filters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col min-h-0 overflow-y-auto ">
          {filteredGroups.map((group) => (
            <section key={group.instructor.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 ">
                <div className="w-8 h-8 rounded-full bg-[#56205E]/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#56205E]" />
                </div>
                <h2 className="text-base font-semibold text-card-foreground">
                  {group.instructor.name}
                </h2>
                <span className="text-xs text-muted-foreground">
                  ({group.quizzes.length} quiz
                  {group.quizzes.length !== 1 ? "zes" : ""})
                </span>
              </div>

              <div className="flex justify-stretch flex-wrap gap-5 pb-10">
                {group.quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    href={`/student/quizzes/standard/${quiz.code}`}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentQuizzes;
