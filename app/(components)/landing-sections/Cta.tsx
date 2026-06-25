import Link from "next/link";
import React from "react";

export default function Cta() {
  return (
    <section className="bg-gradient-to-br from-[#56205E] to-[#3A1542] py-24 px-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to make learning come alive?
        </h2>
        <p className="text-purple-200 mb-10 max-w-lg mx-auto">
          Join YLQ today and start creating or joining live quizzes in seconds.
          It&apos;s free to get started.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/studentregistration"
            className="bg-white text-[#56205E] font-semibold rounded-full px-8 py-3 hover:bg-purple-100 transition shadow-lg"
          >
            Get Started as a Student
          </Link>
          <Link
            href="/instructorregistration"
            className="border-2 border-white text-white font-semibold rounded-full px-8 py-3 hover:bg-white hover:text-[#56205E] transition"
          >
            Teach on YLQ
          </Link>
        </div>
      </div>
    </section>
  );
}
