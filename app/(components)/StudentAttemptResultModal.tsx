import { X, Check, XCircle } from "lucide-react";
import {
  AttemptData,
  QuestionData,
} from "../(pages)/student/quizzes/standard/[id]/StudentStandardQuizIntro";

export function AttemptReviewModal({
  attempt,
  questions,
  open,
  onClose,
}: {
  attempt: AttemptData;
  questions: QuestionData[];
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const percentage =
    attempt.score != null &&
    attempt.totalPoints != null &&
    attempt.totalPoints > 0
      ? Math.round((attempt.score / attempt.totalPoints) * 100)
      : null;

  const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Attempt Review
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submitted {new Date(attempt.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${percentage != null && percentage >= 60 ? "text-green-600" : "text-red-600"}`}
            >
              {attempt.score ?? 0}/{attempt.totalPoints ?? 0} ({percentage ?? 0}
              %)
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 space-y-4">
          {questions.map((q, i) => {
            const answer = answerMap.get(q.id);
            const rawResponse = answer?.response ?? null;
            const parsedResponse =
              typeof rawResponse === "string"
                ? JSON.parse(rawResponse)
                : rawResponse;
            const selectedLabel = parsedResponse?.label ?? null;
            const selectedText = parsedResponse?.text ?? null;
            const isCorrect = answer?.isCorrect;

            return (
              <div
                key={q.id}
                className="border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-card-foreground">
                    {i + 1}. {q.text}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {q.points} pt{q.points !== 1 ? "s" : ""}
                  </span>
                </div>
                {q.type === "MCQ" && q.options && (
                  <div className="space-y-1.5">
                    {q.options.map((opt) => {
                      const isSelected = opt.label === selectedLabel;
                      const isCorrectOption = opt.isCorrect;
                      const isWrongSelected = isSelected && !isCorrectOption;
                      return (
                        <div
                          key={opt.label}
                          className={`flex items-center gap-2.5 px-3 py-3 rounded-lg border text-sm ${
                            isWrongSelected
                              ? "border-red-500 bg-red-200"
                              : isCorrectOption
                                ? "border-green-400 bg-green-100"
                                : "border-border bg-card"
                          }`}
                        >
                          {isCorrectOption ? (
                            <Check className="w-5 h-5 text-green-600 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                          ) : (
                            <span className="w-5 h-5 shrink-0" />
                          )}
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isWrongSelected
                                ? "bg-red-300 text-red-900"
                                : isCorrectOption
                                  ? "bg-green-300 text-green-900"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span
                            className={`text-sm ${isWrongSelected ? "text-red-900 font-semibold" : "text-muted-foreground"}`}
                          >
                            {opt.text}
                          </span>
                          <div className="ml-auto flex items-center gap-1.5 shrink-0">
                            {isCorrectOption && (
                              <span className="text-[10px] font-bold text-green-800 bg-green-200 px-1.5 py-0.5 rounded">
                                Correct answer
                              </span>
                            )}
                            {isSelected && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isWrongSelected ? "text-red-900 bg-red-300" : "text-muted-foreground bg-muted"}`}
                              >
                                Your answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === "TRUE_FALSE" && (
                  <div className="flex gap-2">
                    {["True", "False"].map((val) => {
                      const isSelected = selectedLabel === val;
                      const isCorrectVal =
                        q.answer?.toLowerCase() === val.toLowerCase();
                      const isWrongSelected = isSelected && !isCorrectVal;
                      return (
                        <div
                          key={val}
                          className={`flex-1 flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-lg border text-sm font-bold ${
                            isWrongSelected
                              ? "border-red-500 bg-red-200 text-red-900"
                              : isCorrectVal
                                ? "border-green-400 bg-green-100 text-green-900"
                                : "border-border bg-card text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {isCorrectVal ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : null}
                            {val}
                          </div>
                          <div className="flex items-center gap-1">
                            {isCorrectVal && (
                              <span className="text-[10px] font-bold text-green-800 bg-green-200 px-1.5 py-0.5 rounded">
                                Correct answer
                              </span>
                            )}
                            {isSelected && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isWrongSelected ? "text-red-900 bg-red-300" : "text-muted-foreground bg-muted"}`}
                              >
                                Your answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === "IDENTIFICATION" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Your answer:</span>
                      <span
                        className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}
                      >
                        {selectedText ?? "No answer"}
                      </span>
                      {isCorrect ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {!isCorrect && q.answer && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Correct answer:</span>
                        <span className="font-medium text-green-600">
                          {q.answer}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {answer && (
                  <div className="text-xs text-muted-foreground">
                    {isCorrect
                      ? `+${answer.pointsAwarded} pt${answer.pointsAwarded !== 1 ? "s" : ""}`
                      : "0 pts"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
