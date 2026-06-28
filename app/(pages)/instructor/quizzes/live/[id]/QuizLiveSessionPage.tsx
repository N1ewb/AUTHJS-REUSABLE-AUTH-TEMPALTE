"use client";

import { SessionData } from "@/lib/types";
import Image from "next/image";
import DefaultBG from "../../../../../../assets/quizpage-default.png";
import CopyInviteCode from "@/app/(components)/CopyInviteCode";
import {
  cancelLiveSession,
  startQuizSession,
} from "@/actions/client/quiz.action";
import { usePollSession } from "@/hooks/useRealtimeSession";
import { Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function QuizLiveSessionPage({ session }: { session: SessionData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { participants } = usePollSession(session.id, session.participants);
  const tags: string[] = Array.isArray(session.quiz.tags)
    ? session.quiz.tags
    : [];
  return (
    <div className="flex flex-col items-start justify-start flex-1 min-h-0 w-full">
      <div className=" w-full text-start space-y-8 flex flex-col min-h-0">
        <div className="border border-border p-5 rounded-lg flex ">
          <div className="flex flex-col flex-grow justify-between">
            <div className="flex flex-col ">
              <p className="text-sm text-muted-foreground mt-1">Live Session</p>
              <h1 className="text-2xl font-bold text-card-foreground">
                {session.quiz.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {session.quiz.description}
              </p>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#56205E]/10 text-[#56205E] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3 max-w-max">
              <button
                disabled={isPending || participants.length === 0}
                onClick={() =>
                  startTransition(async () => {
                    await startQuizSession(session.id);
                    router.push(
                      `/instructor/quizzes/live/${session.id}/question/1`,
                    );
                  })
                }
                className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-2xl bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {isPending ? "Starting..." : "Start Quiz"}
              </button>
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await cancelLiveSession(session.id);
                    router.push(`/instructor/quizzes/${session.quizId}`);
                  })
                }
                className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                {isPending ? "Cancelling..." : "Cancel"}
              </button>
            </div>
            <div className="flex flex-col max-w-max">
              <p className="text-sm text-muted-foreground mt-1 ">Session Code</p>
              <CopyInviteCode quizId={session.quiz.id} code={session.code} />
            </div>
          </div>
          <div className="w-[30%]">
            <Image src={DefaultBG} alt={"DefaultBG"} className="rounded-2xl" />
          </div>
        </div>

        <div className="flex flex-col bg-card rounded-2xl border border-border p-8 space-y-6 w-full min-h-0">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Waiting for Participants
            </span>
          </div>

          <div className="flex flex-col border-t border-border pt-6 space-y-3 min-h-0">
            <p className="text-sm text-muted-foreground font-medium">
              Participants ({participants.length})
            </p>
            {participants.length > 0 ? (
              <div className="flex flex-col gap-2 min-h-0 overflow-y-auto">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#56205E]/10 flex items-center justify-center text-xs font-semibold text-[#56205E]">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.email}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.joinedAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 border-2 border-dashed border-border rounded-xl">
                <p className="text-sm text-muted-foreground">No participants yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizLiveSessionPage;
