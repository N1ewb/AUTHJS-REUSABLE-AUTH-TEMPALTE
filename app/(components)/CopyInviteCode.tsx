"use client";

import { generateQuizCode } from "@/actions/client/quiz.action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Link, Plus } from "lucide-react";

function CopyInviteCode({
  quizId,
  code,
}: {
  quizId: string;
  code: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  if (!code) {
    return (
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await generateQuizCode(quizId);
            router.refresh();
          })
        }
        className="flex items-center gap-1.5 text-xs font-medium text-[#56205E] hover:text-[#56205E]/80 transition-colors disabled:opacity-50"
      >
        <Plus className="w-3.5 h-3.5" />
        {isPending ? "Generating..." : "Generate Invite Code"}
      </button>
    );
  }

  function handleCopy() {
    navigator.clipboard.writeText(code!);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-xs font-mono font-semibold text-[#56205E] bg-[#56205E]/5 hover:bg-[#56205E]/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <Link className="w-3.5 h-3.5" />
      )}
      <span>Invite Code:</span>
      <span className="tracking-wider">{code}</span>
      {copied && <span className="text-green-600 font-sans">Copied!</span>}
    </button>
  );
}

export default CopyInviteCode;
