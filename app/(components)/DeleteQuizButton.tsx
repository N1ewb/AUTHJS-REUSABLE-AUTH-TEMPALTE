"use client";

import { deleteQuiz } from "@/actions/client/quiz.action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

function DeleteQuizButton({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;
        startTransition(async () => {
          await deleteQuiz(quizId);
          router.push("/instructor/quizzes");
        });
      }}
      className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

export default DeleteQuizButton;
