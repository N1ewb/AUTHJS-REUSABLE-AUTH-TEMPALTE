import Link from "next/link";
import { FileText } from "lucide-react";
import QuizDefaultBg from "../../assets/quiz-default-bg.png";
import Image from "next/image";
import { QuizData } from "@/lib/types";

const typeLabels: Record<string, string> = {
  PREMADE: "Pre-made",
  LIVE: "Live",
  PUZZLE: "Puzzle",
  PROGRAMMING: "Programming",
};

function QuizCard({ quiz }: { quiz: QuizData }) {
  const tags = Array.isArray(quiz.tags) ? quiz.tags : [];

  return (
    <Link href={`/instructor/quizzes/${quiz.id}`}>
      <div className="bg-white rounded-xl border p-1 hover:border-[#56205E]/40 hover:shadow-sm transition-all cursor-pointer h-full flex flex-col">
        <Image src={QuizDefaultBg} alt={"Default BG"} className="rounded-lg" />

        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#56205E]/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#56205E]" />
              </div>
              <h3 className="font-semibold text-gray-900 truncate">
                {quiz.title}
              </h3>
            </div>
            <span
              className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                quiz.isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {quiz.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          {quiz.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {quiz.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {quiz._count.questions} questions
            </span>
            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
              {typeLabels[quiz.type] || quiz.type}
            </span>
            {quiz.isPublished && quiz.code && (
              <span className="font-mono text-[#56205E] font-semibold">
                {quiz.code}
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-[#56205E]/5 text-[#56205E]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default QuizCard;
