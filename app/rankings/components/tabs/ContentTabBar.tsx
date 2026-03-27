"use client";

// app/rankings/components/tabs/ContentTabBar.tsx

import { cn } from "@/lib/utils";
import type { ContentTab } from "../../types";

const TABS: { value: ContentTab; label: string }[] = [
  { value: "party",    label: "파티 기록" },
  { value: "personal", label: "개인 DPS" },
  { value: "balance",  label: "밸런스 차트" },
];

interface ContentTabBarProps {
  active: ContentTab;
  onChange: (value: ContentTab) => void;
}

export default function ContentTabBar({ active, onChange }: ContentTabBarProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            active === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
