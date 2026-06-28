"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'light';
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}

export default function ThemeProvider({
  children,
  serverTheme,
}: {
  children: React.ReactNode;
  serverTheme?: string;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    const sessionTheme = (session?.user as { theme?: string } | undefined)
      ?.theme;
    const theme = sessionTheme || serverTheme || "light";
    applyTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* noop */
    }
  }, [session, serverTheme]);

  return <>{children}</>;
}

function applyTheme(t: string) {
  if (t === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
