"use client"

// app/rankings/components/boss/BossSegment.tsx

import { cn } from "@/lib/utils"
import type { Boss } from "../../types"
import { Button } from "@/components/ui/button"
interface BossSegmentOption {
  value: string
  label: string
  sub: string
}

interface BossSegmentProps {
  bosses: Boss[]
  active: string
  onChange: (value: string) => void
}

export default function BossSegment({
  bosses,
  active,
  onChange,
}: BossSegmentProps) {
  const options: BossSegmentOption[] = [
    { value: "all", label: "전체", sub: "종합" },
    ...bosses.map((b) => ({
      value: String(b.index),
      label: `${b.index}네임드`,
      sub: b.name,
    })),
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex min-w-[90px] flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-all",
            active === opt.value
              ? "border-primary/50 bg-primary/8 shadow-sm"
              : "border-border/50 hover:border-border/80 hover:bg-muted/30"
          )}
        >
          <span
            className={cn(
              "text-xs font-bold tracking-tight",
              active === opt.value ? "text-primary" : "text-muted-foreground"
            )}
          >
            {opt.label}
          </span>
          <span className="mt-0.5 max-w-[120px] truncate text-[11px] text-muted-foreground">
            {opt.sub}
          </span>
        </button>
      ))}
    </div>
  )
}
