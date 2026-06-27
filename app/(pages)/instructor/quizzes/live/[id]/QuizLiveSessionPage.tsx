"use client";

import { useRouter } from "next/navigation";
import { Copy, Check, ArrowLeft, Play, X } from "lucide-react";
import { useState } from "react";
import { SessionData } from "@/lib/types";
import Image from "next/image";
import DefaultBG from "../../../../../../assets/quizpage-default.png";
import CopyInviteCode from "@/app/(components)/CopyInviteCode";

function QuizLiveSessionPage({ session }: { session: SessionData }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col items-start justify-start flex-1 min-h-0 w-full">
      <div className=" w-full text-start space-y-8 flex flex-col">
        <div className="border border-gray-200 p-5 rounded-lg flex ">
          <div className="flex flex-col flex-grow justify-between">
            <div className="flex flex-col ">
              <h1 className="text-2xl font-bold text-gray-900">
                {session.quiz.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Live Session</p>
            </div>
            <div className="flex gap-3 max-w-max">
              <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors">
                <Play className="w-4 h-4" />
                Start Quiz
              </button>
              <button className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
            <div className="flex flex-col max-w-max">
              <p className="text-sm text-gray-500 mt-1 ">Session Code</p>
              <CopyInviteCode quizId={session.quiz.id} code={session.code} />
            </div>
          </div>
          <div className="w-[30%]">
            <Image src={DefaultBG} alt={"DefaultBG"} className="rounded-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6 w-full">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-sm text-gray-500">
              Waiting for participants...
            </span>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-3">
            <p className="text-sm text-gray-500 font-medium">Participants</p>
            <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-400">No participants yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizLiveSessionPage;
