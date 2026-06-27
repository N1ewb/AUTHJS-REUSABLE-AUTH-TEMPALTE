"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import QuizCard from "@/app/(components)/QuizCard";
import { QuizData } from "@/lib/types";

const typeLabels: Record<string, string> = {
  PREMADE: "Pre-made",
  LIVE: "Live",
  PUZZLE: "Puzzle",
  PROGRAMMING: "Programming",
};

function QuizzesList({ quizzes }: { quizzes: QuizData[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [tagFilter, setTagFilter] = useState("all");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    quizzes.forEach((q) => {
      if (Array.isArray(q.tags)) {
        (q.tags as string[]).forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [quizzes]);

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    quizzes.forEach((q) => types.add(q.type));
    return Array.from(types).sort();
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    let result = [...quizzes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(q) ||
          (quiz.description ?? "").toLowerCase().includes(q),
      );
    }

    if (statusFilter === "published") {
      result = result.filter((q) => q.isPublished);
    } else if (statusFilter === "draft") {
      result = result.filter((q) => !q.isPublished);
    }

    if (typeFilter !== "all") {
      result = result.filter((q) => q.type === typeFilter);
    }

    if (tagFilter !== "all") {
      result = result.filter(
        (q) =>
          Array.isArray(q.tags) && (q.tags as string[]).includes(tagFilter),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [quizzes, searchQuery, statusFilter, typeFilter, sortOrder, tagFilter]);

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#56205E]/10 flex items-center justify-center">
          <Plus className="w-8 h-8 text-[#56205E]" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          No quizzes yet
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Create your first quiz to get started
        </p>
        <Link
          href="/instructor/quizzes/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#4A1A52] transition"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredQuizzes.length} of {quizzes.length} quiz
            {quizzes.length !== 1 ? "zes" : ""}
          </p>
        </div>
        <Link
          href="/instructor/quizzes/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#4A1A52] transition"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap">
        <div className="relative flex flex-grow flex-1 min-w-[200px] max-w-xs ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E]"
          />
        </div>
        <div className="flex flex-row basis-1/3 justify-between items-start">
          {" "}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {allTypes.length > 0 && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E]"
            >
              <option value="all">All Types</option>
              {allTypes.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t] || t}
                </option>
              ))}
            </select>
          )}
          {allTags.length > 0 && (
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#56205E]/20 focus:border-[#56205E]"
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
            className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-sm text-gray-500">
            No quizzes match your filters.
          </p>
        </div>
      ) : (
        <div
          className="flex overflow-x-auto min-w-0 gap-4 scroll-smooth"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizzesList;
