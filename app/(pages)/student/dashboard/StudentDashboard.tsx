"use client";

import { getStudentActiveSession } from "@/actions/client/quiz.action";
import {
  getConnectedInstructors,
  linkStudentToInstructor,
  type ConnectedInstructor,
} from "@/actions/client/instructorStudent.action";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Radio,
  ArrowLeftToLine,
  Loader2,
  GraduationCap,
  KeyRound,
  Check,
  ChevronRight,
  BookOpen,
} from "lucide-react";

function StudentDashboard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [quizError, setQuizError] = useState("");
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
  const [instructors, setInstructors] = useState<ConnectedInstructor[]>([]);

  useEffect(() => {
    Promise.all([getStudentActiveSession(), getConnectedInstructors()])
      .then(([session, instructors]) => {
        setActiveSession(session);
        setInstructors(instructors);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleJoin() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a code");
      return;
    }
    router.push(`/student/quizzes/live/${trimmed}`);
  }

  function handleTakeQuiz() {
    const trimmed = quizCode.trim().toUpperCase();
    if (!trimmed) {
      setQuizError("Please enter a quiz code");
      return;
    }
    router.push(`/student/quizzes/standard/${trimmed}`);
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
    <div className="flex flex-1 min-h-0 p-6 mx-auto w-full ">
      <div className="flex flex-col flex-1 gap-6 min-h-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join live quizzes and browse your instructors&apos; quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — join + connect */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active session banner */}
            {activeSession && (
              <div className="p-5 rounded-xl border-2 border-[#56205E]/20 bg-gradient-to-r from-[#56205E]/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#56205E]/10 flex items-center justify-center">
                    <ArrowLeftToLine className="w-6 h-6 text-[#56205E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Active Session
                    </p>
                    <p className="text-xs text-gray-500">
                      You have an ongoing quiz &mdash; code:{" "}
                      {activeSession.code}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      router.push(
                        `/student/quizzes/live/${activeSession.sessionId}/question/${activeSession.currentQuestion}`,
                      )
                    }
                    className="shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors font-medium"
                  >
                    Rejoin
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Join live quiz */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#56205E]/10 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-[#56205E]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Join a Live Quiz
                  </h2>
                  <p className="text-xs text-gray-500">
                    Enter the session code from your instructor
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="Session code"
                  className="flex-1 text-center text-lg font-mono tracking-[0.25em] border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#56205E]/30 focus:border-[#56205E] uppercase"
                  maxLength={6}
                />
                <button
                  onClick={handleJoin}
                  disabled={!code.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#56205E]/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  Join
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
            </div>

            {/* Take quiz via code */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Take a Quiz
                  </h2>
                  <p className="text-xs text-gray-500">
                    Enter a quiz code from your instructor
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={quizCode}
                  onChange={(e) => {
                    setQuizCode(e.target.value);
                    setQuizError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleTakeQuiz()}
                  placeholder="Quiz code"
                  className="flex-1 text-center text-lg font-mono tracking-[0.25em] border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 uppercase"
                  maxLength={6}
                />
                <button
                  onClick={handleTakeQuiz}
                  disabled={!quizCode.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 shrink-0"
                >
                  Start
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {quizError && (
                <p className="text-xs text-red-500 mt-1.5">{quizError}</p>
              )}
            </div>
          </div>

          {/* Right column — connected instructors */}
          <div className="flex flex-col gap-5 min-h-0">
            {/* Connect with instructor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#56205E]/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#56205E]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Connect with Instructor
                  </h2>
                  <p className="text-xs text-gray-500">
                    Enter their invite code to see their quizzes
                  </p>
                </div>
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
                  placeholder="Invite code"
                  className="flex-1 text-center text-lg font-mono tracking-[0.15em] border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#56205E]/30 focus:border-[#56205E] uppercase"
                  maxLength={8}
                />
                <button
                  onClick={handleLinkInstructor}
                  disabled={invitePending || !inviteCode.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#56205E] text-white rounded-lg text-sm font-medium hover:bg-[#56205E]/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  {invitePending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
              {inviteError && (
                <p className="text-xs text-red-500 mt-1.5">{inviteError}</p>
              )}
              {inviteSuccess && (
                <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Connected successfully!
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Your Instructors
              </h2>
            </div>

            {instructors.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <GraduationCap className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-500">
                  Connect with an instructor to see their quizzes.
                </p>
              </div>
            ) : (
              <div className="flex flex-col min-h-0 overflow-auto gap-2">
                {instructors.map((inst) => (
                  <div
                    key={inst.instructorId}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-[#56205E]/10 flex items-center justify-center text-sm font-medium text-[#56205E]">
                        {inst.instructorName?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {inst.instructorName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
