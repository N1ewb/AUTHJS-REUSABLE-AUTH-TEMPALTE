"use client";

import {
  getStudentActiveSession,
  getInstructorQuizzes,
  linkStudentToInstructor,
  type InstructorQuiz,
} from "@/actions/client/quiz.action";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentInstructorCard from "@/app/(components)/studentInstructorCard";
import {
  ArrowRight,
  Radio,
  ArrowLeftToLine,
  Loader2,
  GraduationCap,
  KeyRound,
  Check,
} from "lucide-react";

function StudentDashboard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [invitePending, setInvitePending] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    sessionId: string;
    code: string;
    currentQuestion: number;
    quizId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<InstructorQuiz[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [sessionData, instructorData] = await Promise.all([
          getStudentActiveSession(),
          getInstructorQuizzes(),
        ]);
        setActiveSession(sessionData);
        setInstructors(instructorData);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleJoin() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a code");
      return;
    }
    router.push(`/student/quizzes/live/${trimmed}`);
  }

  async function handleLinkInstructor() {
    const trimmed = inviteCode.trim().toUpperCase();
    if (!trimmed) {
      setInviteError("Please enter an invite code");
      return;
    }
    setInvitePending(true);
    setInviteError("");
    setInviteSuccess(false);
    try {
      await linkStudentToInstructor(trimmed);
      setInviteSuccess(true);
      setInviteCode("");
    } catch (e) {
      setInviteError(e instanceof Error ? e.message : "Invalid invite code");
    } finally {
      setInvitePending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-0">
        <Loader2 className="w-6 h-6 animate-spin text-[#56205E]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 gap-8 p-5 mx-auto w-full">
      <div className="flex   space-y-6  flex-1">
        {activeSession && (
          <div className="p-4 rounded-xl border border-[#56205E]/20 bg-[#56205E]/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#56205E]/10 flex items-center justify-center">
                <ArrowLeftToLine className="w-5 h-5 text-[#56205E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Active Session
                </p>
                <p className="text-xs text-gray-500">
                  Code: {activeSession.code}
                </p>
              </div>
              <button
                onClick={() =>
                  router.push(
                    `/student/quizzes/live/${activeSession.sessionId}/question/${activeSession.currentQuestion}`,
                  )
                }
                className="shrink-0 text-sm px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors"
              >
                Rejoin
              </button>
            </div>
          </div>
        )}

        <div className="text-center space-y-6">
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
            {error && <p className="text-xs text-red-500">{error}</p>}
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

      <div className="flex flex-col overflow-y-auto border border-gray-200 rounded-2xl p-4">
        <div className="flex flex-col pb-5">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Connect with Instructor
            </p>
          </div>
          <div className="flex gap-2">
            <input
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value);
                setInviteError("");
                setInviteSuccess(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLinkInstructor()}
              placeholder="Enter invite code"
              className="flex-1 text-center text-lg font-mono tracking-[0.15em] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#56205E]/30 focus:border-[#56205E] uppercase"
              maxLength={8}
            />
            <button
              onClick={handleLinkInstructor}
              disabled={invitePending || !inviteCode.trim()}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#56205E] text-white text-sm font-medium hover:bg-[#56205E]/90 transition-colors disabled:opacity-50"
            >
              {invitePending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Connect"
              )}
            </button>
          </div>
          {inviteError && (
            <p className="text-xs text-red-500 mt-1">{inviteError}</p>
          )}
          {inviteSuccess && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Connected successfully!
            </p>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Instructors
        </h2>

        {instructors.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <GraduationCap className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">
              Join a live quiz to see your instructors here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {instructors.map((inst) => (
              <StudentInstructorCard key={inst.instructorId} inst={inst} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
