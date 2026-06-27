"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createQuiz } from "@/actions/client/quiz.action";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  Settings,
  FileText,
  ListChecks,
  Send,
  X,
} from "lucide-react";

type QuestionType = "MCQ" | "IDENTIFICATION" | "TRUE_FALSE" | "CODING";

interface Option {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  order: number;
  options: Option[];
  answer: string;
}

const STEPS = [
  { id: 1, label: "Details", icon: FileText },
  { id: 2, label: "Questions", icon: ListChecks },
  { id: 3, label: "Settings", icon: Settings },
  { id: 4, label: "Publish", icon: Send },
];

const PREDEFINED_TAGS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "Geography",
  "Arts",
  "Music",
];

const QUIZ_TYPES = [
  { value: "PREMADE", label: "Pre-made Quiz" },
  { value: "LIVE", label: "Live Quiz" },
  { value: "PUZZLE", label: "Puzzle" },
  { value: "PROGRAMMING", label: "Programming" },
] as const;

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "MCQ", label: "Multiple Choice" },
  { value: "IDENTIFICATION", label: "Identification" },
  { value: "TRUE_FALSE", label: "True or False" },
  { value: "CODING", label: "Coding" },
];

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

function CreateQuiz() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 - Quiz Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 2 - Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  // Step 3 - Questions
  const [questions, setQuestions] = useState<Question[]>([]);

  // Step 4 - Settings
  const [quizType, setQuizType] = useState<string>("PREMADE");
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [passingScore, setPassingScore] = useState<number>(75);
  const [maxAttempts, setMaxAttempts] = useState<number>(1);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  // --- Paste parser ---
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const parsePaste = () => {
    const lines = pasteText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let questionText = "";
    const options: { label: string; text: string }[] = [];
    let correctLabel = "";

    const letterLabels = ["A", "B", "C", "D", "E", "F"];
    const numberToLabel: Record<string, string> = {
      "1": "A",
      "2": "B",
      "3": "C",
      "4": "D",
      "5": "E",
      "6": "F",
    };
    let bulletIndex = 0;

    for (const line of lines) {
      const answerMatch = line.match(
        /^(?:answer|correct|ans)[:\-]?\s*([A-Ea-e1-4])/i,
      );
      if (answerMatch) {
        const raw = answerMatch[1].toUpperCase();
        correctLabel = numberToLabel[raw] || raw;
        continue;
      }

      const letterMatch = line.match(/^([A-Ea-e1-4])[.)]\s*/);
      if (letterMatch) {
        const raw = letterMatch[1].toUpperCase();
        const label = numberToLabel[raw] || raw;
        options.push({ label, text: line.slice(letterMatch[0].length).trim() });
        continue;
      }

      const bulletMatch = line.match(/^[-*•]\s+/);
      if (bulletMatch && bulletIndex < 6) {
        const label = letterLabels[bulletIndex];
        options.push({ label, text: line.slice(bulletMatch[0].length).trim() });
        bulletIndex++;
        continue;
      }

      const cleaned = line
        .replace(/^_{3,}|^[-]{3,}|^[*]{3,}/, "")
        .replace(/^\d+[.)]\s*/, "")
        .trim();
      if (cleaned) {
        questionText += (questionText ? " " : "") + cleaned;
      }
    }

    if (questionText) setQText(questionText);
    if (options.length >= 2) {
      setQOptions(
        options.map((o) => ({
          label: o.label,
          text: o.text,
          isCorrect: o.label === correctLabel,
        })),
      );
    }
    setQType("MCQ");
    setPasteOpen(false);
    setPasteText("");
    setShowQuestionForm(true);
  };

  // --- New question form ---
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [qText, setQText] = useState("");
  const [qType, setQType] = useState<QuestionType>("MCQ");
  const [qPoints, setQPoints] = useState(1);
  const [qOptions, setQOptions] = useState<Option[]>([
    { label: "A", text: "", isCorrect: false },
    { label: "B", text: "", isCorrect: false },
  ]);
  const [qAnswer, setQAnswer] = useState("");

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return title.trim().length > 0 && selectedTags.length > 0;
      case 2:
        return questions.length > 0;
      case 3:
        return timeLimit > 0 && passingScore > 0 && maxAttempts > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!canProceed()) {
      toast({
        title: "Incomplete",
        description: getStepWarning(),
        variant: "destructive",
      });
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepWarning = () => {
    switch (currentStep) {
      case 1:
        return "Please enter a title and select at least one tag";
      case 2:
        return "Please add at least one question";
      case 3:
        return "Please fill in all settings";
      default:
        return "";
    }
  };

  // --- Tags ---
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
      setCustomTag("");
    }
  };

  // --- Questions ---
  const resetQuestionForm = () => {
    setQText("");
    setQType("MCQ");
    setQPoints(1);
    setQOptions([
      { label: "A", text: "", isCorrect: false },
      { label: "B", text: "", isCorrect: false },
    ]);
    setQAnswer("");
    setEditingQuestionId(null);
    setShowQuestionForm(false);
  };

  const addOption = () => {
    if (qOptions.length < 6) {
      const label = OPTION_LABELS[qOptions.length];
      setQOptions((prev) => [...prev, { label, text: "", isCorrect: false }]);
    }
  };

  const removeOption = (index: number) => {
    if (qOptions.length > 2) {
      setQOptions((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        return updated.map((opt, i) => ({ ...opt, label: OPTION_LABELS[i] }));
      });
    }
  };

  const updateOption = (index: number, text: string) => {
    setQOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, text } : opt)),
    );
  };

  const setCorrectOption = (index: number) => {
    setQOptions((prev) =>
      prev.map((opt, i) => ({ ...opt, isCorrect: i === index })),
    );
  };

  const saveQuestion = () => {
    if (!qText.trim()) {
      toast({
        title: "Required",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    if (qType === "MCQ") {
      const filledOptions = qOptions.filter((o) => o.text.trim());
      if (filledOptions.length < 2) {
        toast({
          title: "Required",
          description: "At least 2 options required",
          variant: "destructive",
        });
        return;
      }
      if (!qOptions.some((o) => o.isCorrect)) {
        toast({
          title: "Required",
          description: "Please mark the correct answer",
          variant: "destructive",
        });
        return;
      }
    }

    if (
      (qType === "IDENTIFICATION" || qType === "TRUE_FALSE") &&
      !qAnswer.trim()
    ) {
      toast({
        title: "Required",
        description: "Please provide the answer",
        variant: "destructive",
      });
      return;
    }

    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId
            ? {
                ...q,
                text: qText,
                type: qType,
                points: qPoints,
                options: qType === "MCQ" ? qOptions : [],
                answer: qType === "MCQ" ? "" : qAnswer,
              }
            : q,
        ),
      );
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: qText,
          type: qType,
          points: qPoints,
          order: prev.length + 1,
          options: qType === "MCQ" ? qOptions : [],
          answer: qType === "MCQ" ? "" : qAnswer,
        },
      ]);
    }

    resetQuestionForm();
  };

  const editQuestion = (q: Question) => {
    setQText(q.text);
    setQType(q.type);
    setQPoints(q.points);
    if (q.type === "MCQ") {
      setQOptions(
        q.options.length >= 2
          ? q.options
          : [
              { label: "A", text: "", isCorrect: false },
              { label: "B", text: "", isCorrect: false },
            ],
      );
    } else {
      setQOptions([
        { label: "A", text: "", isCorrect: false },
        { label: "B", text: "", isCorrect: false },
      ]);
    }
    setQAnswer(q.answer || "");
    setEditingQuestionId(q.id);
    setShowQuestionForm(true);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i + 1 })),
    );
  };

  // --- Publish ---
  const handlePublish = async () => {
    setLoading(true);
    try {
      await createQuiz({
        title,
        description,
        type: quizType,
        timeLimit,
        passingScore,
        maxAttempts,
        shuffleQuestions,
        selectedTags,
        questions: questions.map((q) => ({
          text: q.text,
          type: q.type,
          points: q.points,
          options: q.options,
          answer: q.answer,
        })),
      });

      toast({
        title: "Quiz Created",
        description: "Your quiz has been published successfully",
      });
      router.push("/instructor/quizzes");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canMarkCorrect = (q: Question) => {
    if (q.type !== "MCQ") return false;
    const correctCount = q.options.filter((o) => o.isCorrect).length;
    return correctCount === 1;
  };

  return (
    <div className="flex gap-4 ">
      <div className="flex-1 min-w-0">
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                      currentStep > step.id
                        ? "bg-[#56205E] border-[#56205E] text-white"
                        : currentStep === step.id
                          ? "border-[#56205E] text-[#56205E] bg-white"
                          : "border-gray-300 text-gray-400 bg-white"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium text-center ${
                      currentStep >= step.id
                        ? "text-[#56205E]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 mt-[-1.5rem] ${
                      currentStep > step.id ? "bg-[#56205E]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border p-6 md:p-8">
          {/* Step 1: Details (Title + Tags) */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Quiz Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Give your quiz a name, description, and categorize it with
                  tags
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Introduction to Algebra"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description{" "}
                    <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Brief description of the quiz..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {PREDEFINED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-[#56205E] text-white border-[#56205E]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#56205E] hover:text-[#56205E]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a custom tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCustomTag())
                    }
                    className="max-w-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addCustomTag}
                    disabled={!customTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[#56205E]/10 text-[#56205E]"
                      >
                        {tag}
                        <button
                          onClick={() => toggleTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between  ">
                <div className="">
                  <h2 className=" text-xl font-semibold text-gray-900">
                    Quiz Questions
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Add questions for your quiz ({questions.length} added)
                  </p>
                </div>
                {!showQuestionForm && (
                  <Button
                    onClick={() => setShowQuestionForm(true)}
                    className="bg-[#56205E] hover:bg-[#4A1A52] text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </Button>
                )}
              </div>
              {/* Question Form */}
              {showQuestionForm && (
                <div className="bg-gray-50 rounded-lg border p-5 space-y-4 ">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {editingQuestionId ? "Edit Question" : "New Question"}
                    </h3>
                    <button
                      onClick={resetQuestionForm}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Question Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {QUESTION_TYPES.map((qt) => (
                        <button
                          key={qt.value}
                          onClick={() => {
                            setQType(qt.value);
                            if (qt.value !== "MCQ") {
                              setQOptions([
                                { label: "A", text: "", isCorrect: false },
                                { label: "B", text: "", isCorrect: false },
                              ]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            qType === qt.value
                              ? "bg-[#56205E] text-white border-[#56205E]"
                              : "bg-white text-gray-600 border-gray-300 hover:border-[#56205E]"
                          }`}
                        >
                          {qt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter your question..."
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E] focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Points
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={qPoints}
                        onChange={(e) =>
                          setQPoints(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-20"
                      />
                    </div>
                  </div>

                  {/* MCQ Options */}
                  {qType === "MCQ" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Answer Options <span className="text-red-500">*</span>
                      </label>
                      {qOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <button
                            onClick={() => setCorrectOption(index)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                              option.isCorrect
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-gray-500 border-gray-300 hover:border-[#56205E]"
                            }`}
                            title="Mark as correct answer"
                          >
                            {option.isCorrect ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              option.label
                            )}
                          </button>
                          <Input
                            placeholder={`Option ${option.label}`}
                            value={option.text}
                            onChange={(e) =>
                              updateOption(index, e.target.value)
                            }
                            className="flex-1"
                          />
                          {qOptions.length > 2 && (
                            <button
                              onClick={() => removeOption(index)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {qOptions.length < 6 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addOption}
                          className="text-[#56205E]"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Identification / True-False Answer */}
                  {(qType === "IDENTIFICATION" || qType === "TRUE_FALSE") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Correct Answer <span className="text-red-500">*</span>
                      </label>
                      {qType === "TRUE_FALSE" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setQAnswer("true")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                              qAnswer === "true"
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
                            }`}
                          >
                            True
                          </button>
                          <button
                            onClick={() => setQAnswer("false")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                              qAnswer === "false"
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-white text-gray-600 border-gray-300 hover:border-red-500"
                            }`}
                          >
                            False
                          </button>
                        </div>
                      ) : (
                        <Input
                          placeholder="Enter the correct answer..."
                          value={qAnswer}
                          onChange={(e) => setQAnswer(e.target.value)}
                          className="max-w-md"
                        />
                      )}
                    </div>
                  )}

                  {qType === "CODING" && (
                    <div className="text-sm text-gray-500 italic">
                      Coding question editor coming soon
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={saveQuestion}
                      className="bg-[#56205E] hover:bg-[#4A1A52] text-white"
                    >
                      {editingQuestionId ? "Update Question" : "Add Question"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Question List */}
              {questions.length > 0 && (
                <div className="space-y-3">
                  {questions.map((q, index) => (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 p-4 bg-white border rounded-lg hover:border-[#56205E]/30 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#56205E]/10 text-[#56205E] text-sm font-semibold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {q.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {q.points} pt{q.points > 1 ? "s" : ""}
                          </span>
                          {q.type === "MCQ" && canMarkCorrect(q) && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Answer set
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {q.text}
                        </p>
                        {q.type === "MCQ" && q.options.some((o) => o.text) && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {q.options
                              .filter((o) => o.text)
                              .map((opt) => (
                                <span
                                  key={opt.label}
                                  className={`text-xs px-2 py-0.5 rounded border ${
                                    opt.isCorrect
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-gray-50 text-gray-500 border-gray-200"
                                  }`}
                                >
                                  {opt.label}. {opt.text}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => editQuestion(q)}
                          className="p-1.5 text-gray-400 hover:text-[#56205E] rounded hover:bg-gray-100"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Quiz Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure how the quiz behaves
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quiz Type
                  </label>
                  <select
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#56205E] focus:border-transparent"
                  >
                    {QUIZ_TYPES.map((qt) => (
                      <option key={qt.value} value={qt.value}>
                        {qt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Time Limit (minutes) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={timeLimit}
                    onChange={(e) =>
                      setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Passing Score (%) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={passingScore}
                    onChange={(e) =>
                      setPassingScore(
                        Math.min(
                          100,
                          Math.max(1, parseInt(e.target.value) || 1),
                        ),
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Attempts <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={maxAttempts}
                    onChange={(e) =>
                      setMaxAttempts(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#56205E] focus:ring-[#56205E]"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Shuffle Questions
                    </span>
                    <p className="text-xs text-gray-500">
                      Randomize the order of questions for each attempt
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Publish */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Review & Publish
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Review your quiz details before publishing
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg border divide-y">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Title</span>
                  <span className="text-sm font-medium text-gray-900">
                    {title}
                  </span>
                </div>
                {description && (
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Description</span>
                    <span className="text-sm text-gray-900 max-w-xs text-right line-clamp-2">
                      {description}
                    </span>
                  </div>
                )}
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Tags</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-[#56205E]/10 text-[#56205E]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Questions</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.length} questions
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Points</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.reduce((sum, q) => sum + q.points, 0)} pts
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Quiz Type</span>
                  <span className="text-sm font-medium text-gray-900">
                    {QUIZ_TYPES.find((qt) => qt.value === quizType)?.label}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Time Limit</span>
                  <span className="text-sm font-medium text-gray-900">
                    {timeLimit} minutes
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Passing Score</span>
                  <span className="text-sm font-medium text-gray-900">
                    {passingScore}%
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Max Attempts</span>
                  <span className="text-sm font-medium text-gray-900">
                    {maxAttempts}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Shuffle Questions
                  </span>
                  <span
                    className={`text-sm font-medium ${shuffleQuestions ? "text-green-600" : "text-gray-400"}`}
                  >
                    {shuffleQuestions ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Ready to publish?
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Once published, students can access the quiz using the
                      generated code or link. You can always edit the quiz
                      later.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePublish}
                disabled={loading}
                className="w-full bg-[#56205E] hover:bg-[#4A1A52] text-white py-6 text-lg"
              >
                {loading ? (
                  "Publishing..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Publish Quiz
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < 4 && (
                <Button
                  onClick={nextStep}
                  className="bg-[#56205E] hover:bg-[#4A1A52] text-white flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Paste Panel */}
      <button
        onClick={() => setPasteOpen(!pasteOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#56205E] text-white px-1.5 py-8 rounded-l-md text-xs font-medium writing-mode-vertical hover:bg-[#4A1A52] transition"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        {pasteOpen ? "Close" : "Paste"}
      </button>

      {pasteOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-30 pt-20 flex flex-col">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">
                Quick Paste
              </h3>
              <button
                onClick={() => setPasteOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Supports <span className="font-mono text-[#56205E]">A.</span>{" "}
              <span className="font-mono text-[#56205E]">A)</span>{" "}
              <span className="font-mono text-[#56205E]">1.</span>{" "}
              <span className="font-mono text-[#56205E]">-</span> bullet
              formats. Prefix{" "}
              <span className="font-mono text-[#56205E]">Answer: A</span> to
              mark correct choice.
            </p>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-3">
            <textarea
              placeholder={`Paste question here...\ne.g. What is Java?\nA. A language\nB. A coffee\nC. An island\nD. A framework`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="flex-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E] focus:border-transparent resize-none"
            />
            <Button
              onClick={parsePaste}
              disabled={!pasteText.trim()}
              className="bg-[#56205E] hover:bg-[#4A1A52] text-white w-full"
            >
              Fill Question Form
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuiz;
