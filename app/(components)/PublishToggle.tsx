"use client";

import { toggleQuizPublish } from "@/actions/client/quiz.action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

function PublishToggle({
  quizId,
  isPublished,
}: {
  quizId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleQuizPublish(quizId);
          router.refresh();
        })
      }
      className={cn(
        "flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50",
      )}
    >
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600">
        {isPending ? "Loading" : isPublished ? "Published" : "Draft"}
      </span>

      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors",
          isPublished ? "bg-green-500" : "bg-gray-300",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform",
            isPublished ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}

export default PublishToggle;
