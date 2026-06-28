"use client";

import {
  FileText,
  Play,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type { InstructorDashboardData } from "@/actions/client/dashboard.action";

export default function InstructorDashboard({
  data,
}: {
  data: InstructorDashboardData;
}) {
  const stats = [
    {
      label: "Total Quizzes",
      value: String(data.stats.totalQuizzes),
      icon: FileText,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Active Quizzes",
      value: String(data.stats.activeQuizzes),
      icon: Play,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Total Participants",
      value: String(data.stats.totalParticipants),
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Avg Score",
      value:
        data.stats.averageScore != null
          ? `${Math.round(data.stats.averageScore)}%`
          : "—",
      icon: TrendingUp,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div className="flex flex-col min-h-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col min-h-0 bg-card rounded-xl border mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-card-foreground">
            Recent Quizzes
          </h2>
          <Link
            href="/instructor/quizzes"
            className="text-sm text-[#56205E] font-medium hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y flex flex-col min-h-0 overflow-y-auto">
          {data.recentQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">
                  {quiz.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {quiz.questionCount} questions
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="text-center">
                  <p className="font-medium">{quiz.participantCount}</p>
                  <p className="text-xs text-muted-foreground">Participants</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">
                    {quiz.averageScore != null
                      ? `${Math.round(quiz.averageScore)}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    quiz.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : quiz.status === "Closed"
                        ? "bg-muted text-muted-foreground"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {quiz.status}
                </span>
              </div>
            </div>
          ))}
          {data.recentQuizzes.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No quizzes yet. Create your first quiz!
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        <Link
          href="/instructor/quizzes/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#4A1A52] transition"
        >
          <Plus className="w-4 h-4 " />
          Create New Quiz
        </Link>
      </div>
    </div>
  );
}
