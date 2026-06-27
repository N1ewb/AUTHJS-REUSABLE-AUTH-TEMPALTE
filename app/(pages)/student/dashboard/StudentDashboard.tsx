"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Radio } from "lucide-react";

function StudentDashboard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleJoin() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a code");
      return;
    }
    router.push(`/student/quizzes/live/${trimmed}`);
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-16">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#56205E]/10 flex items-center justify-center">
          <Radio className="w-7 h-7 text-[#56205E]" />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Join a Live Quiz
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter the session code shared by your instructor
          </p>
        </div>

        <div className="space-y-3">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="Enter code"
            className="w-full text-center text-2xl font-mono tracking-[0.3em] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#56205E]/30 focus:border-[#56205E] uppercase"
            maxLength={6}
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          <button
            onClick={handleJoin}
            disabled={!code.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
          >
            Join
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
