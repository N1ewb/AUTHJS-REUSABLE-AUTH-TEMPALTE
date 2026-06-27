"use client";

import {
  getInstructorStudents,
  getInstructorInviteCode,
} from "@/actions/client/quiz.action";
import { useEffect, useState } from "react";
import {
  Users,
  Copy,
  Check,
  Loader2,
  Mail,
  Calendar,
  FileText,
  KeyRound,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string | null;
  joinedAt: string;
  attemptCount: number;
};

function InstructorStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [studentsData, code] = await Promise.all([
          getInstructorStudents(),
          getInstructorInviteCode(),
        ]);
        setStudents(studentsData);
        setInviteCode(code);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function copyCode() {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  return (
    <div className="flex flex-1 min-h-0 p-6  mx-auto w-full">
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? "Loading..."
              : `${students.length} student${students.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#56205E]/10 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-[#56205E]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Invite Code</p>
              <p className="text-xs text-gray-500">
                Students enter this code in their dashboard to connect with you
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {inviteCode && (
              <span className="text-lg font-mono font-bold tracking-[0.2em] text-[#56205E]">
                {inviteCode}
              </span>
            )}
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-[#56205E] text-white hover:bg-[#56205E]/90 transition-colors"
            >
              {copiedCode ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copiedCode ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#56205E]" />
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Users className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <h2 className="text-sm font-medium text-gray-900 mb-1">
              No students yet
            </h2>
            <p className="text-sm text-gray-500">
              Share your invite code so students can connect with you.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border">
            <div className="divide-y">
              {students.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#56205E]/10 flex items-center justify-center text-sm font-medium text-[#56205E] shrink-0">
                    {s.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {s.name}
                    </p>
                    {s.email && (
                      <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {s.email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {s.attemptCount} attempt{s.attemptCount !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(s.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorStudents;
