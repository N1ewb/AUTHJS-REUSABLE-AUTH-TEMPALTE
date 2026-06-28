"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type HelpTopic = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string[];
};

export default function HelpTopicCard({ topic }: { topic: HelpTopic }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-start gap-4 p-5 w-full text-left hover:bg-muted transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-[#56205E]/10 flex items-center justify-center shrink-0">
          <topic.icon className="w-5 h-5 text-[#56205E]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-card-foreground">
            {topic.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-border">
          <div className="pt-3 space-y-2">
            {topic.content.map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
