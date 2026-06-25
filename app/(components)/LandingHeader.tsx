"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function LandingHeader() {
  const pathname = usePathname();

  const filledStyle =
    "border bg-white text-[#56205E] font-semibold rounded-full px-6 py-2 border-[#56205E] hover:bg-[#56205E] hover:text-white hover:border-white transition";
  const outlineStyle =
    "border border-white rounded-full px-6 py-2 font-semibold hover:bg-white hover:text-[#56205E] transition";

  const isStudentPage = pathname === "/studentregistration";
  const isInstructorPage = pathname === "/instructorregistration";

  const btn = (page: "student" | "instructor") => {
    const isActive =
      (page === "student" && isStudentPage) ||
      (page === "instructor" && isInstructorPage);
    return isActive ? filledStyle : outlineStyle;
  };

  return (
    <header className="fixed w-full flex items-center justify-between px-12 py-4 bg-[#56205E] text-white shadow-md z-50">
      <Link href="/" className="text-xl font-bold tracking-wide">
        YLQ
      </Link>
      <nav className="flex items-center gap-8">
        <Link href="/login" className="hover:underline underline-offset-4">
          Login
        </Link>
        <Link
          href="/studentregistration"
          className={btn("student")}
        >
          Register as Student
        </Link>
        <Link
          href="/instructorregistration"
          className={btn("instructor")}
        >
          Register as Instructor
        </Link>
      </nav>
    </header>
  );
}
