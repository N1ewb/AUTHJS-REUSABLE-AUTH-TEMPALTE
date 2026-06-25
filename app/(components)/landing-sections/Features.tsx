import React from "react";

const steps = [
  {
    number: "01",
    title: "Create a Quiz",
    description:
      "Instructors build custom quizzes with multiple choice, true/false, and timed questions in just a few clicks.",
  },
  {
    number: "02",
    title: "Share with Students",
    description:
      "Share a unique room code or link. Students join instantly from any device — no account required to play.",
  },
  {
    number: "03",
    title: "Play & Track Results",
    description:
      "Quizzes go live in real time. Students answer, scores update instantly, and results are saved for review.",
  },
];

const roles = [
  {
    title: "For Students",
    items: [
      "Join quizzes with a simple code",
      "See live leaderboard rankings",
      "Track your progress over time",
      "Compete with friends and classmates",
    ],
  },
  {
    title: "For Instructors",
    items: [
      "Create quizzes in minutes",
      "Monitor student performance",
      "Export results for grading",
      "Host live or self-paced sessions",
    ],
  },
];

export default function Features() {
  return (
    <>
      {/* How It Works */}
      <section className="bg-white py-24 px-12" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#56205E] uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              From creation to completion in three steps
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Whether you&apos;re teaching a class or studying for an exam, YLQ
              makes the process seamless.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#56205E]/10 text-[#56205E] flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students / For Instructors */}
      <section className="bg-gray-50 py-24 px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for everyone
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Whether you&apos;re here to learn or to teach, YLQ has the tools
              you need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {roles.map((role, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[#56205E] mb-6">
                  {role.title}
                </h3>
                <ul className="space-y-4">
                  {role.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
