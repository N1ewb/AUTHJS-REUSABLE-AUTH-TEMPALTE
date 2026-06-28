"use client";

import { addQuestion } from "@/actions/client/quiz.action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Plus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const typeLabels: Record<string, string> = {
  MCQ: "Multiple Choice",
  IDENTIFICATION: "Identification",
  TRUE_FALSE: "True/False",
  CODING: "Coding",
};

const questionTypes = ["MCQ", "IDENTIFICATION", "TRUE_FALSE", "CODING"];

type Option = { label: string; text: string; isCorrect: boolean };

function AddQuestionForm({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const [text, setText] = useState("");
  const [type, setType] = useState("MCQ");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState<Option[]>([
    { label: "A", text: "", isCorrect: false },
    { label: "B", text: "", isCorrect: false },
  ]);
  const [answer, setAnswer] = useState("");

  function reset() {
    setText("");
    setType("MCQ");
    setPoints(1);
    setOptions([
      { label: "A", text: "", isCorrect: false },
      { label: "B", text: "", isCorrect: false },
    ]);
    setAnswer("");
  }

  function handleSave() {
    startTransition(async () => {
      await addQuestion(quizId, {
        text,
        type,
        points,
        ...(type === "MCQ" ? { options } : {}),
        ...(type !== "MCQ" ? { answer: answer || null } : {}),
      });
      router.refresh();
      reset();
      setOpen(false);
    });
  }

  function toggleCorrect(label: string) {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.label === label,
      })),
    );
  }

  function updateOptionText(label: string, text: string) {
    setOptions((prev) =>
      prev.map((opt) => (opt.label === label ? { ...opt, text } : opt)),
    );
  }

  function addOption() {
    const nextLabel = String.fromCharCode(65 + options.length);
    setOptions((prev) => [
      ...prev,
      { label: nextLabel, text: "", isCorrect: false },
    ]);
  }

  function removeOption(label: string) {
    setOptions((prev) => {
      const filtered = prev.filter((o) => o.label !== label);
      return filtered.map((o, i) => ({
        ...o,
        label: String.fromCharCode(65 + i),
      }));
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[#56205E] hover:text-[#56205E]/80 transition-colors">
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Question text"
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
                    {opt.isCorrect && (
                      <Check className="w-3 h-3 text-green-600" />
                    )}
                  </button>
                  <span className="text-xs font-bold w-4 text-muted-foreground">
                    {opt.label}.
                  </span>
                  <input
                    value={opt.text}
                    onChange={(e) =>
                      updateOptionText(opt.label, e.target.value)
                    }
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
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors "
            >
              {isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddQuestionForm;
