import React from "react";
import { FileText, Play, Users, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Quizzes", value: "12", icon: FileText, color: "text-blue-600 bg-blue-100" },
  { label: "Active Quizzes", value: "4", icon: Play, color: "text-green-600 bg-green-100" },
  { label: "Total Participants", value: "248", icon: Users, color: "text-purple-600 bg-purple-100" },
  { label: "Avg Score", value: "76%", icon: TrendingUp, color: "text-orange-600 bg-orange-100" },
];

const recentQuizzes = [
  { title: "Math Quiz - Week 10", questions: 15, participants: 32, avgScore: "82%", status: "Active" },
  { title: "Science Midterm Review", questions: 20, participants: 28, avgScore: "74%", status: "Active" },
  { title: "History Chapter 5", questions: 10, participants: 25, avgScore: "68%", status: "Closed" },
  { title: "English Grammar Basics", questions: 12, participants: 30, avgScore: "79%", status: "Draft" },
];

export default function InstructorDashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Quizzes</h2>
          <Link
            href="/instructor/quizzes"
            className="text-sm text-[#56205E] font-medium hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y">
          {recentQuizzes.map((quiz) => (
            <div key={quiz.title} className="flex items-center justify-between px-6 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{quiz.questions} questions</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="text-center">
                  <p className="font-medium">{quiz.participants}</p>
                  <p className="text-xs text-gray-400">Participants</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">{quiz.avgScore}</p>
                  <p className="text-xs text-gray-400">Avg Score</p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    quiz.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : quiz.status === "Closed"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {quiz.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
