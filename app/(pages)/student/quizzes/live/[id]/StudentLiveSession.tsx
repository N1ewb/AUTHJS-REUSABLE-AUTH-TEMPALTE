"use client";

import { joinLiveSession } from "@/actions/client/quiz.action";
import { usePollSession } from "@/hooks/useRealtimeSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Users, XCircle } from "lucide-react";

function StudentLiveSession({ code }: { code: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [session, setSession] = useState<{
    id: string;
    code: string;
    participantCount: number;
    quiz: { title: string; _count: { questions: number } };
  } | null>(null);

  const { participants, status } = usePollSession(session?.id ?? "");

  useEffect(() => {
    async function join() {
      try {
        const data = await joinLiveSession(code);
        setSession(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to join session");
      }
    }
    join();
  }, [code]);

  useEffect(() => {
    if (!session) return;

    if (!status.isActive) {
      if (status.cancelled) {
        setCancelled(true);
      } else {
        router.replace(`/student/quizzes/live/${session.id}/results`);
      }
    } else if (status.currentQuestion) {
      router.push(
        `/student/quizzes/live/${session.id}/question/${status.currentQuestion}`
      );
    }
  }, [status.currentQuestion, status.isActive, status.cancelled, session, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-16">
        <div className="max-w-sm w-full text-center space-y-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="text-sm text-[#56205E] hover:underline"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-16">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Session Cancelled
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {session?.quiz.title ?? "Quiz"} has been cancelled by the instructor.
            </p>
          </div>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#56205E]/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-16">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#56205E]/10 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#56205E] animate-spin" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Joining session...
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Please wait while we connect you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-16">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#56205E]/10 flex items-center justify-center">
          <Users className="w-7 h-7 text-[#56205E]" />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {session.quiz.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {session.quiz._count.questions} questions
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-sm text-gray-500">
            Waiting for the instructor to start the quiz...
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          {participants.length || session.participantCount} participant
          {(participants.length || session.participantCount) !== 1
            ? "s"
            : ""}{" "}
          joined
        </div>
      </div>
    </div>
  );
}

export default StudentLiveSession;
