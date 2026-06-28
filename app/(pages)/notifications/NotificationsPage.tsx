"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  markAsRead,
  markAllAsRead,
  type AppNotification,
} from "@/actions/client/notification.action";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

export default function NotificationsClient({
  notifications: initial,
}: {
  notifications: AppNotification[];
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initial);

  async function handleClick(n: AppNotification) {
    if (!n.read && n.id !== "active-session") {
      markAsRead(n.id).catch(() => {});
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
      );
    }
    if (n.href) router.push(n.href);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-1 flex-col min-h-0 mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-card-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={async () => {
              await markAllAsRead();
              setNotifications((prev) =>
                prev.map((x) => ({ ...x, read: true })),
              );
            }}
            className="text-sm text-[#56205E] font-medium hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            No notifications
          </h2>
          <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="flex flex-col min-h-0 gap-2 overflow-y-auto">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`block w-full text-left bg-card rounded-xl border border-border p-4 hover:border-border transition-colors ${
                !n.read ? "border-l-4 border-l-[#56205E]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${n.read ? "text-muted-foreground" : "text-card-foreground font-semibold"}`}
                  >
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground whitespace-nowrap">
                  {timeAgo(n.createdAt)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
