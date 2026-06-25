import React from "react";

const testimonials = [
  {
    quote:
      "YLQ made my classes so much more engaging. Students actually look forward to quizzes now.",
    name: "Maria Santos",
    role: "High School Teacher",
  },
  {
    quote:
      "I used YLQ to review for my exams. The live leaderboard pushed me to study harder and the results helped me track my weak spots.",
    name: "Jose Cruz",
    role: "College Student",
  },
  {
    quote:
      "Setting up a quiz takes less than 5 minutes. It's the simplest tool I've used for classroom engagement.",
    name: "Ana Reyes",
    role: "University Instructor",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24 px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-[#56205E] uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Loved by students and instructors alike
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col p-8 rounded-2xl border border-gray-100 shadow-sm bg-white"
            >
              <svg
                className="w-8 h-8 text-[#56205E]/20 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                {t.quote}
              </p>
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
