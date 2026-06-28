"use client";

import { SignOutButton } from "@/components/forms/SignoutForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import React from "react";

export default function UserDropdown() {
  const { data: session } = useSession();
  const name = session?.user?.name ? session?.user?.name : session?.user?.email;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          <span className="text-sm font-medium">{name}</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#56205E] text-white">
            <User className="w-4 h-4" />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/settings"}>Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
