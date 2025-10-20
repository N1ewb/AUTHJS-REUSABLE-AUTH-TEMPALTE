import Link from "next/link";
import React from "react";

export default function LandingHeader() {
  return (
    <div className="fixed w-full flex flex-1 justify-between px-20 py-5 border-b-[1px] border-[#6d6c6c]">
      <div className="logo flex-1 flex items-center justify-start">
        LIVE QUIZ BRUH
      </div>
      <div className="nav-links flex-1 flex items-center justify-end gap-10">
        <Link href="/login">Login</Link>
        <Link
          href="/register"
          className="bg-[#101010] rounded-2xl px-8 py-2 text-white"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
