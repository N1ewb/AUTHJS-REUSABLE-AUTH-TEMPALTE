"use client";

import { ArrowLeft, FileText, Users, XCircle, CheckCircle, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

function AttemptDetailPage({
  session,
}: {
  session: {
    id: string;
    code: string;
    isActive: boolean;
    cancelled: boolean;
    currentQuestion: number | null;
    startedAt: Date;
    endedAt: Date | null;
    quizId: string;
    quiz: {
      id: string;
      title: string;
      questions: {
        id: string;
        text: string;
        type: string;
        points: number;
        order: number;
        options: unknown;
        answer: string | null;
      }[];
    };
    participants: {
      id: string;
      userId: string;
      name: string;
      email: string;
      joinedAt: string;
      score: number | null;
    }[];
  };
}) {
  const router = useRouter();
  const totalPoints = session.quiz.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6 max-w-4xl mx-auto w-full">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {session.quiz.title}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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

      <div className="bg-white rounded-xl border">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-gray-900">
            Participants ({session.participants.length})
          </h2>
        </div>

        {session.participants.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No participants joined this session.</p>
          </div>
        ) : (
          <div className="divide-y">
            {session.participants.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-sm text-gray-400 font-medium text-center">
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#56205E]/10 flex items-center justify-center text-sm font-medium text-[#56205E]">
                    {p.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {p.name ?? "Anonymous"}
                    </p>
                    {p.email && (
                      <p className="text-xs text-gray-500 truncate">{p.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
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
