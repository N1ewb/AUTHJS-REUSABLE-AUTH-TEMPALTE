import { MessageCircleQuestion, MessageSquareText, Radio } from "lucide-react";
import Image from "next/image";
import React from "react";
import DefaultBG from "../../../../../assets/quizpage-default.png";
import AddQuestionForm from "@/app/(components)/AddQuestionForm";
import DeleteQuizButton from "@/app/(components)/DeleteQuizButton";
import PublishToggle from "@/app/(components)/PublishToggle";
import QuizPageQuestions from "@/app/(components)/QuizPageQuestions";
import StartLiveSessionButton from "@/app/(components)/StartLiveSessionButton";
import { QuizData } from "@/lib/types";

function QuizPage({ quiz }: { quiz: QuizData }) {
  const isLive = quiz.type === "LIVE";
  const tags: string[] = Array.isArray(quiz.tags) ? quiz.tags : [];

  return (
    <div className="flex flex-col flex-grow min-h-0">
      <div className="flex justify-between rounded-2xl border border-gray-200 w-full p-6 ">
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex gap-2 items-center">
            <p className="flex items-center gap-1 text-[12px]">
              <Radio className="bg-gray-300 text-gray-700 p-1 rounded-full" />
              <span>{isLive ? "Live" : "Standard"}</span>
            </p>
            <PublishToggle quizId={quiz.id} isPublished={quiz.isPublished} />
            <DeleteQuizButton quizId={quiz.id} />
            {isLive && quiz.isPublished && (
              <StartLiveSessionButton
                quizId={quiz.id}
                activeSessionId={quiz.activeSessionId}
              />
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-[12px]">{quiz.description}</p>
            {tags.length > 0 && (
              <div className="flex">
                <p className="text-gray-600 bg-gray-200 text-[10px] text-center rounded-full px-3">
                  {tags.join(", ")}
                </p>
              </div>
            )}
          </div>

          <div className="flex text-[12px] items-center gap-3 text-gray-600">
            <p className="flex items-center gap-2">
              <MessageSquareText
                className="p-1 rounded-md bg-[#56205E]"
                color="white"
              />
              <span>{quiz.type}</span>
            </p>
            <p className="text-lg">·</p>
            <p className="flex gap-2 items-center">
              <MessageCircleQuestion className="p-1 text-gray-500" />
              <span>{quiz._count.questions} Questions</span>
            </p>
            <p className="text-lg">·</p>
            <p className="flex gap-2 items-center">
              <span>
                {new Date(quiz.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
          <div className="text-[#56205E] flex gap-5 text-sm">
            <p className="flex flex-col">
              AVG Score{" "}
              <span className="text-2xl font-semibold">
                {quiz.averageScore != null
                  ? Math.round(quiz.averageScore)
                  : "—"}
              </span>
            </p>

            <div className="line w-[1px] h-full bg-gray-400"></div>
            <p className="flex flex-col">
              Sessions{" "}
              <span className="text-2xl font-semibold">
                {quiz._count.sessions}
              </span>
            </p>
            <div className="line w-[1px] h-full bg-gray-400"></div>
            <p className="flex flex-col">
              Attempt History {"/Make this modal/ text: View"}
            </p>
          </div>
        </div>
        <div className="w-[30%]">
          <Image src={DefaultBG} alt={"DefaultBG"} className="rounded-2xl" />
        </div>
      </div>

      <div className="mt-8 overflow-y-auto flex flex-col flex-grow min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Questions ({quiz._count.questions})
          </h2>
          <AddQuestionForm quizId={quiz.id} />
        </div>

        {quiz.questions.length > 0 ? (
          <div className="space-y-3">
            {quiz.questions.map((q) => (
              <QuizPageQuestions key={q.id} question={q} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            No questions yet. Click &quot;Add Question&quot; to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
