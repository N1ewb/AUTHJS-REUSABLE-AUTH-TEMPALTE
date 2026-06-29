export function QuestionProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number[];
}) {
  return (
    <div className="flex justify-center items-center py-5">
      <div className="flex gap-1.5">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const isCurrent = num === currentQuestion;
          const isAnswered = answeredQuestions.includes(num);
          return (
            <div
              key={num}
              className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                isCurrent
                  ? "bg-[#56205E] text-white ring-2 ring-[#56205E]/30"
                  : isAnswered
                    ? "bg-muted text-muted-foreground"
                    : num < currentQuestion
                      ? "bg-amber-100 text-amber-700"
                      : "bg-transparent text-muted-foreground border border-border"
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
