"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function LandingHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const filledStyle =
    "bg-[#56205E] text-white font-medium rounded-full px-6 py-2 border border-[#56205E] hover:bg-white hover:text-[#56205E] transition";
  const outlineStyle =
    "border border-[#56205E] text-[#56205E] rounded-full px-6 py-2 font-medium hover:bg-[#56205E] hover:text-white transition";

  const isStudentPage = pathname === "/studentregistration";
  const isInstructorPage = pathname === "/instructorregistration";

  const btn = (page: "student" | "instructor") => {
    const isActive =
      (page === "student" && isStudentPage) ||
      (page === "instructor" && isInstructorPage);
    return isActive ? filledStyle : outlineStyle;
  };

  const close = () => setMenuOpen(false);

  return (
    <header className="fixed w-full flex items-center justify-between px-4 sm:px-12 py-4 bg-white text-[#56205E] shadow-md z-50">
      <Link href="/" className="text-xl font-bold tracking-wide">
        YLQ
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/login" className={filledStyle}>
          Login
        </Link>
        <Link href="/studentregistration" className={btn("student")}>
          Register as Student
        </Link>
        <Link href="/instructorregistration" className={btn("instructor")}>
          Register as Instructor
        </Link>
      </nav>

      {/* Hamburger */}
      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t shadow-lg flex flex-col items-center gap-4 py-6 md:hidden">
          <Link href="/login" onClick={close} className={filledStyle}>
            Login
          </Link>
          <Link href="/studentregistration" onClick={close} className={btn("student")}>
            Register as Student
          </Link>
          <Link href="/instructorregistration" onClick={close} className={btn("instructor")}>
            Register as Instructor
          </Link>
        </div>
      )}
    </header>
  );
}
