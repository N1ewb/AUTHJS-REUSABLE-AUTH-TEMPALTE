"use client";

import { addQuestion } from "@/actions/client/quiz.action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FileText, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ParsedQuestion = {
  text: string;
  type: string;
  points: number;
  options?: { label: string; text: string; isCorrect: boolean }[];
  answer?: string | null;
};

function parseBulkInput(input: string): ParsedQuestion[] {
  const blocks = input.trim().split(/\n\s*(?=\d+\.)/);
  const questions: ParsedQuestion[] = [];

  for (const block of blocks) {
    if (!block.trim()) continue;

    const lines = block.trim().split("\n");
    const questionLine = lines[0];
    const text = questionLine.replace(/^\d+\.\s*/, "").trim();
    if (!text) continue;

    const optionLines: string[] = [];
    let answerLine = "";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^[A-Z]\.\s/.test(line)) {
        optionLines.push(line);
      } else if (/^Answer:\s*/i.test(line)) {
        answerLine = line.replace(/^Answer:\s*/i, "").trim();
      }
    }

    if (optionLines.length >= 2) {
      const options = optionLines.map((line) => {
        const match = line.match(/^([A-Z])\.\s+(.*)/);
        if (!match) return null;
        const label = match[1];
        const optText = match[2].trim();
        return {
          label,
          text: optText,
          isCorrect:
            answerLine && answerLine !== "*"
              ? label === answerLine.toUpperCase()
              : false,
        };
      }).filter((o): o is NonNullable<typeof o> => o !== null);

      questions.push({
        text,
        type: "MCQ",
        points: 1,
        options,
      });
    } else {
      questions.push({
        text,
        type: "IDENTIFICATION",
        points: 1,
        answer: answerLine && answerLine !== "*" ? answerLine : null,
      });
    }
  }

  return questions;
}

export default function BulkPasteDialog({
  quizId,
  onParsed,
}: {
  quizId?: string;
  onParsed?: (questions: ParsedQuestion[]) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const [preview, setPreview] = useState(false);

  function handlePaste(value: string) {
    setRaw(value);
    const result = parseBulkInput(value);
    setParsed(result);
    setPreview(result.length > 0);
  }

  function handleAdd() {
    if (parsed.length === 0) return;
    if (onParsed) {
      onParsed(parsed);
      setRaw("");
      setParsed([]);
      setPreview(false);
      setOpen(false);
      return;
    }
    startTransition(async () => {
      for (const q of parsed) {
        if (quizId) await addQuestion(quizId, q);
      }
      router.refresh();
      setRaw("");
      setParsed([]);
      setPreview(false);
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setRaw("");
          setParsed([]);
          setPreview(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors">
          <FileText className="w-4 h-4" />
          Bulk Paste
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Paste Questions</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto">
          <p className="text-xs text-muted-foreground">
            Paste questions in the format below. MCQ format with A/B/C/D options
            is detected automatically. Use{" "}
            <code className="text-[#56205E] bg-muted px-1 rounded">
              Answer: *
            </code>{" "}
            if you will set the correct answer later.
          </p>

          <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground font-mono leading-relaxed">
            1. What does UCD stand for?{"\n"}
            {"   "}A. Universal Computer Design{"\n"}
            {"   "}B. User-Centered Design{"\n"}
            {"   "}C. User Control Development{"\n"}
            {"   "}D. Unified Customer Design{"\n"}
            {"   "}Answer: B
          </div>

          <textarea
            value={raw}
            onChange={(e) => handlePaste(e.target.value)}
            placeholder="Paste your questions here..."
            rows={10}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#56205E] resize-none font-mono"
          />

          {preview && (
            <div className="space-y-2 border border-border rounded-lg p-3">
              <p className="text-xs font-medium text-card-foreground">
                Preview ({parsed.length} question
                {parsed.length !== 1 ? "s" : ""} detected)
              </p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {parsed.map((q, i) => (
                  <div
                    key={i}
                    className="text-xs border-b border-border pb-2 last:border-0"
                  >
                    <p className="font-medium text-card-foreground">
                      {i + 1}. {q.text}
                    </p>
                    <p className="text-muted-foreground">
                      Type: {q.type}
                      {q.options &&
                        (q.options.filter((o) => o.isCorrect).length > 0
                          ? ` \u2014 Answer: ${q.options.find((o) => o.isCorrect)?.label}`
                          : " \u2014 No answer set")}
                    </p>
                    {q.options && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {q.options.map((o) => (
                          <span
                            key={o.label}
                            className={`px-1.5 py-0.5 rounded ${
                              o.isCorrect
                                ? "bg-green-100 text-green-700"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {o.label}. {o.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t mt-3">
          <button
            onClick={() => {
              setOpen(false);
              setRaw("");
              setParsed([]);
              setPreview(false);
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isPending || parsed.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            Add{" "}
            {parsed.length > 0
              ? `${parsed.length} Question${parsed.length !== 1 ? "s" : ""}`
              : "Questions"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
