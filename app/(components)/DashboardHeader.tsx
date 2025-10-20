"use client";
import Link from "next/link";
import React from "react";
import UserDropdown from "./UserDropdown";

export default function DashboardHeader() {
  return (
    <div className="fixed w-full flex flex-1 justify-between px-20 py-5 border-b-[1px] border-[#6d6c6c]">
      <div className="logo flex-1">LOGO</div>
      <div className="nav-links flex flex-1 justify-between items-center">
        <Link href="/dashboard">Dashboard</Link>
        <UserDropdown />
      </div>
    </div>
  );
}
