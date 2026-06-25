"use client";
import React, { useState } from "react";

const faqs = [
  {
    q: "Is YLQ free to use?",
    a: "Yes, YLQ is completely free for both students and instructors. There are no hidden fees or premium plans required.",
  },
  {
    q: "Do students need an account to join a quiz?",
    a: "No. Students can join a live quiz using a room code — no sign-up required. An account is only needed if you want to track your history.",
  },
  {
    q: "Can I create my own quizzes?",
    a: "Absolutely. Instructors can create custom quizzes with multiple choice, true/false, and timed questions in just a few minutes.",
  },
  {
    q: "Can I see how my students performed?",
    a: "Yes. Instructors have access to detailed results and can export performance data for grading and analysis.",
  },
  {
    q: "What devices does YLQ support?",
    a: "YLQ works on any device with a modern web browser — desktop, tablet, and mobile.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="bg-gray-50 py-24 px-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-[#56205E] uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left text-gray-900 font-medium hover:bg-gray-50 transition"
              >
                {faq.q}
                <svg
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
