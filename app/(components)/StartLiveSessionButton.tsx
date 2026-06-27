"use client";

import { startLiveSession } from "@/actions/client/quiz.action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Play, ArrowRightToLine } from "lucide-react";

function StartLiveSessionButton({
  quizId,
  activeSessionId,
}: {
  quizId: string;
  activeSessionId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (activeSessionId) {
    return (
      <button
        onClick={() =>
          router.push(`/instructor/quizzes/live/${activeSessionId}`)
        }
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#56205E] text-[#56205E] hover:bg-[#56205E]/5 transition-colors"
      >
        <ArrowRightToLine className="w-3.5 h-3.5" />
        Rejoin Session
      </button>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const session = await startLiveSession(quizId);
          router.push(`/instructor/quizzes/live/${session.id}`);
        })
      }
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
    >
      <Play className="w-3.5 h-3.5" />
      {isPending ? "Starting..." : "Start Live Session"}
    </button>
  );
}

export default StartLiveSessionButton;
