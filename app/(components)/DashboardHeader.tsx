"use client";
import Link from "next/link";
import React from "react";
import UserDropdown from "./UserDropdown";

export default function DashboardHeader() {
  return (
    <header className="fixed w-full flex items-center justify-between px-8 py-4 border-b bg-card z-50">
      <Link href="/dashboard" className="font-bold text-lg">
        RAGEBAITER BECOME RAGEBAITED
      </Link>
      <div className="flex items-center gap-6">
        <UserDropdown />
      </div>
    </header>
  );
}
