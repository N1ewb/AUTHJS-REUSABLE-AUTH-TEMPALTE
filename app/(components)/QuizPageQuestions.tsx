"use client";

import { updateQuestion } from "@/actions/client/quiz.action";
import { Check, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const typeLabels: Record<string, string> = {
  MCQ: "Multiple Choice",
  IDENTIFICATION: "Identification",
  TRUE_FALSE: "True/False",
  CODING: "Coding",
};

const questionTypes = ["MCQ", "IDENTIFICATION", "TRUE_FALSE", "CODING"];

type Option = { label: string; text: string; isCorrect: boolean };

function ViewMode({
  question,
  onEdit,
}: {
  question: {
    id: string;
    text: string;
    type: string;
    points: number;
    order: number;
    options: unknown;
    answer: string | null;
  };
  onEdit: () => void;
}) {
  const options = question.options as Option[] | null;

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-7 h-7 rounded-lg bg-[#56205E]/10 flex items-center justify-center text-xs font-bold text-[#56205E]">
          {question.order}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-card-foreground leading-relaxed">
            {question.text}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {typeLabels[question.type] || question.type}
            </span>
            <span className="text-xs text-muted-foreground">
              {question.points} pt{question.points !== 1 ? "s" : ""}
            </span>
          </div>

          {question.type === "MCQ" && options && (
            <div className="mt-3 space-y-1">
              {options.map((opt) => (
                <div
                  key={opt.label}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                    opt.isCorrect
                      ? "bg-green-50 text-green-800 font-medium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="text-xs font-bold w-5">{opt.label}.</span>
                  <span>{opt.text}</span>
                  {opt.isCorrect && (
                    <Check className="w-3.5 h-3.5 text-green-600 ml-auto shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}

          {(question.type === "TRUE_FALSE" || question.type === "IDENTIFICATION") && question.answer && (
            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium ${
                  question.type === "TRUE_FALSE" && question.answer === "False"
                    ? "bg-red-50 text-red-800"
                    : "bg-green-50 text-green-800"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Answer: {question.answer}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onEdit}
          className="shrink-0 p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-muted-foreground transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EditMode({
  question,
  onCancel,
}: {
  question: {
    id: string;
    text: string;
    type: string;
    points: number;
    order: number;
    options: unknown;
    answer: string | null;
  };
  onCancel: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const existingOptions = question.options as Option[] | null;

  const [text, setText] = useState(question.text);
  const [type, setType] = useState(question.type);
  const [points, setPoints] = useState(question.points);
  const [options, setOptions] = useState<Option[]>(
    existingOptions ?? [
      { label: "A", text: "", isCorrect: false },
      { label: "B", text: "", isCorrect: false },
    ]
  );
  const [answer, setAnswer] = useState(question.answer ?? "");

  function handleSave() {
    startTransition(async () => {
      await updateQuestion(question.id, {
        text,
        type,
        points,
        ...(type === "MCQ" ? { options } : {}),
        ...(type !== "MCQ" ? { answer: answer || null } : {}),
      });
      router.refresh();
      onCancel();
    });
  }

  function toggleCorrect(label: string) {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.label === label,
      }))
    );
  }

  function updateOptionText(label: string, text: string) {
    setOptions((prev) =>
      prev.map((opt) => (opt.label === label ? { ...opt, text } : opt))
    );
  }

  function addOption() {
    const nextLabel = String.fromCharCode(65 + options.length);
    setOptions((prev) => [...prev, { label: nextLabel, text: "", isCorrect: false }]);
  }

  function removeOption(label: string) {
    setOptions((prev) => {
      const filtered = prev.filter((o) => o.label !== label);
      return filtered.map((o, i) => ({ ...o, label: String.fromCharCode(65 + i) }));
    });
  }

  return (
    <div className="bg-card rounded-xl border border-[#56205E]/30 p-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-7 h-7 rounded-lg bg-[#56205E]/10 flex items-center justify-center text-xs font-bold text-[#56205E]">
          {question.order}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full text-sm font-medium text-card-foreground border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#56205E]"
          />

          <div className="flex items-center gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#56205E]"
            >
              {questionTypes.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t]}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="text-xs border border-border rounded-lg px-2 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-[#56205E]"
            />
            <span className="text-xs text-muted-foreground">pts</span>
          </div>

          {type === "MCQ" && (
            <div className="space-y-1.5">
              {options.map((opt) => (
                <div key={opt.label} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCorrect(opt.label)}
                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      opt.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-border"
                    }`}
                  >
                    {opt.isCorrect && <Check className="w-3 h-3 text-green-600" />}
                  </button>
                  <span className="text-xs font-bold w-4 text-muted-foreground">
                    {opt.label}.
                  </span>
                  <input
                    value={opt.text}
                    onChange={(e) => updateOptionText(opt.label, e.target.value)}
                    placeholder="Option text"
                    className="flex-1 text-sm border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#56205E]"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(opt.label)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-xs text-[#56205E] hover:underline"
              >
                + Add option
              </button>
            </div>
          )}

          {type === "TRUE_FALSE" && (
            <select
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#56205E]"
            >
              <option value="">Select answer</option>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          )}

          {type === "IDENTIFICATION" && (
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Correct answer"
              className="w-full text-sm border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#56205E]"
            />
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={isPending || !text.trim()}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onCancel}
              disabled={isPending}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizPageQuestions({
  question,
}: {
  question: {
    id: string;
    text: string;
    type: string;
    points: number;
    order: number;
    options: unknown;
    answer: string | null;
  };
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <EditMode question={question} onCancel={() => setEditing(false)} />;
  }

  return <ViewMode question={question} onEdit={() => setEditing(true)} />;
}
