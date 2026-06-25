"use client";
import Link from "next/link";
import React from "react";
import UserDropdown from "./UserDropdown";

export default function DashboardHeader() {
  return (
<<<<<<< HEAD
    <header className="fixed w-full flex items-center justify-between px-8 py-4 border-b bg-white z-50">
      <Link href="/dashboard" className="font-bold text-lg">
        Live Quiz
      </Link>
      <div className="flex items-center gap-6">
=======
    <div className="fixed w-full flex flex-1 justify-between items-center px-20 py-5 border-b-[1px] border-[#6d6c6c]">
      <div className="logo flex-1">LOGO</div>
      <div className="nav-links flex flex-1 justify-end items-center">
>>>>>>> 464b7667dd7a375046130fb0204bc9fd2a23a4ef
        <UserDropdown />
      </div>
    </header>
  );
}
