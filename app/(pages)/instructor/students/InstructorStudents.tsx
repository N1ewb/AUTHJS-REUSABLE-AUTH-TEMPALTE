"use client";

import {
  getInstructorInviteCode,
  getInstructorStudents,
  type ConnectedStudent,
} from "@/actions/client/instructorStudent.action";
import { useEffect, useState } from "react";
import { Copy, Check, KeyRound, Users, Mail, Calendar } from "lucide-react";

function InstructorStudents() {
  const [inviteCode, setInviteCode] = useState("");
  const [students, setStudents] = useState<ConnectedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([getInstructorInviteCode(), getInstructorStudents()])
      .then(([code, students]) => {
        setInviteCode(code);
        setStudents(students);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function copyCode() {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-1 min-h-0 p-6 mx-auto w-full">
      <div className="flex-1 min-w-0 mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Students</h1>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-44 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded-lg" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-48 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#56205E]/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#56205E]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Invite Code
                  </p>
                  <p className="text-xs text-gray-500">
                    Share this code with students to connect
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
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">
                {students.length} connected student
                {students.length !== 1 ? "s" : ""}
              </p>

              {students.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Users className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <h2 className="text-sm font-medium text-gray-900 mb-1">
                    No connected students yet
                  </h2>
                  <p className="text-sm text-gray-500">
                    Students who enter your invite code will appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="divide-y">
                    {students.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 px-5 py-3.5"
                      >
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
                        <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(s.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InstructorStudents;
