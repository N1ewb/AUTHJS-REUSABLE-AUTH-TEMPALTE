"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getNotifications, type AppNotification } from "@/actions/client/notification.action";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationDropdown({
  icon,
  label,
  collapsed,
}: {
  icon: string;
  label: string;
  collapsed: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      getNotifications().then(setNotifications).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={(e) => {
        const related = e.relatedTarget;
        if (ref.current && !(related instanceof Node && ref.current.contains(related))) {
          setOpen(false);
        }
      }}
    >
      <button
        onClick={() => router.push("/notifications")}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition text-muted-foreground hover:bg-accent w-full ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <span className="relative shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </span>
        {!collapsed && label}
      </button>

      {open && (
        <div
          className={`absolute bottom-full left-0 mb-1 w-80 bg-card rounded-xl border border-border shadow-lg z-50 ${
            collapsed ? "left-12 bottom-auto top-0" : ""
          }`}
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-card-foreground">Notifications</p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet.</div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 hover:bg-muted transition-colors ${!n.read ? "bg-[#56205E]/5" : ""}`}
                >
                  <p className={`text-sm ${n.read ? "text-muted-foreground" : "text-card-foreground font-medium"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              ))
            )}
          </div>
          <Link
            href="/notifications"
            className="block px-4 py-2.5 text-center text-sm text-[#56205E] font-medium hover:bg-muted rounded-b-xl border-t border-border"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
