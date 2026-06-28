"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import React from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length < 2) return null;

  const crumbs = segments.slice(1);

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
      {crumbs.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 2).join("/");
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = i === crumbs.length - 1;

        return (
          <React.Fragment key={href}>
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            {isLast ? (
              <span className="text-card-foreground font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-[#56205E] transition">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
