"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  updateProfile,
  changePassword,
  updateSettings,
} from "@/actions/client/user.action";
import { ChevronDown, User, Lock, Bell, Palette } from "lucide-react";

type SettingsData = {
  name: string;
  email: string;
  image: string | null;
  theme: string;
  notificationPrefs: Record<string, boolean> | null;
};

type SectionName = "profile" | "password" | "notifications" | "appearance";

const sections: {
  key: SectionName;
  title: string;
  description: string;
  icon: typeof User;
}[] = [
  { key: "profile", title: "Profile", description: "Update your name and email.", icon: User },
  { key: "password", title: "Password", description: "Change your account password.", icon: Lock },
  { key: "notifications", title: "Notifications", description: "Manage notification preferences.", icon: Bell },
  { key: "appearance", title: "Appearance", description: "Customize the look and feel.", icon: Palette },
];

export default function SettingsClient({
  settings: initial,
}: {
  settings: SettingsData;
}) {
  const { data: session, update } = useSession();
  const [expanded, setExpanded] = useState<SectionName | null>(null);

  return (
    <div className="flex flex-col min-h-0 w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-card-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.key}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() =>
                setExpanded(expanded === s.key ? null : s.key)
              }
              className="flex items-center gap-4 p-5 w-full text-left hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#56205E]/10 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-[#56205E]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-card-foreground">
                  {s.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.description}
                </p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expanded === s.key ? "rotate-180" : ""
                }`}
              />
            </button>

            {expanded === s.key && (
              <div className="border-t border-border px-5 py-4">
                {s.key === "profile" && (
                  <ProfileForm
                    initial={initial}
                    sessionName={session?.user?.name ?? initial.name}
                    onUpdate={update}
                  />
                )}
                {s.key === "password" && <PasswordForm />}
                {s.key === "notifications" && (
                  <NotificationsForm initial={initial.notificationPrefs} />
                )}
                {s.key === "appearance" && (
                  <AppearanceForm initial={initial.theme} onUpdate={update} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileForm({
  initial,
  sessionName,
  onUpdate,
}: {
  initial: SettingsData;
  sessionName: string;
  onUpdate: (data?: Record<string, unknown>) => Promise<unknown>;
}) {
  const [name, setName] = useState(sessionName);
  const [email, setEmail] = useState(initial.email);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const result = await updateProfile({ name, email });

    if (result.success) {
      await onUpdate({ name, email });
      setMessage({ type: "success", text: "Profile updated" });
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Full name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E]/40 focus:border-[#56205E]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E]/40 focus:border-[#56205E]"
        />
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-[#56205E] text-white text-sm font-medium rounded-lg hover:bg-[#45184D] disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSave() {
    if (newPass !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPass.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    const result = await changePassword({
      currentPassword: current,
      newPassword: newPass,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Password updated" });
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Current password
        </label>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E]/40 focus:border-[#56205E]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          New password
        </label>
        <input
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E]/40 focus:border-[#56205E]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Confirm new password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56205E]/40 focus:border-[#56205E]"
        />
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-[#56205E] text-white text-sm font-medium rounded-lg hover:bg-[#45184D] disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Change password"}
      </button>
    </div>
  );
}

function NotificationsForm({
  initial,
}: {
  initial: Record<string, boolean> | null;
}) {
  const prefs = initial ?? {
    quizPublished: true,
    attempts: true,
    studentConnected: true,
  };
  const [settings, setSettings] = useState(prefs);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleToggle(key: string) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);

    setSaving(true);
    setMessage(null);

    const result = await updateSettings({ notificationPrefs: next });

    if (result.success) {
      setMessage({ type: "success", text: "Preferences saved" });
    } else {
      setSettings(settings);
      setMessage({ type: "error", text: result.message });
    }
    setSaving(false);
  }

  const labels: Record<string, string> = {
    quizPublished: "New quiz published",
    attempts: "Quiz attempts",
    studentConnected: "Student connected",
  };

  return (
    <div className="space-y-3">
      {Object.entries(labels).map(([key, label]) => (
        <label
          key={key}
          className="flex items-center justify-between py-2"
        >
          <span className="text-sm text-muted-foreground">{label}</span>
          <button
            onClick={() => handleToggle(key)}
            disabled={saving}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              settings[key] ? "bg-[#56205E]" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${
                settings[key] ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>
      ))}
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

function AppearanceForm({
  initial,
  onUpdate,
}: {
  initial: string;
  onUpdate: (data?: Record<string, unknown>) => Promise<unknown>;
}) {
  const [theme, setTheme] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function applyTheme(t: string) {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", t);
    } catch {
      /* noop */
    }
  }

  async function handleSelect(t: string) {
    setTheme(t);
    applyTheme(t);
    setSaving(true);

    await updateSettings({ theme: t });
    await onUpdate({ theme: t });

    setSaving(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {["light", "dark"].map((t) => (
          <button
            key={t}
            onClick={() => handleSelect(t)}
            disabled={saving}
            className={`flex-1 p-4 rounded-xl border-2 text-center transition-colors ${
              theme === t
                ? "border-[#56205E] bg-[#56205E]/5"
                : "border-border hover:border-border"
            }`}
          >
            <span className="text-sm font-medium text-muted-foreground capitalize">
                  {t}
                </span>
          </button>
        ))}
      </div>
    </div>
  );
}
