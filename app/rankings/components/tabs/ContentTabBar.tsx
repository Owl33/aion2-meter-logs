"use client"

// app/rankings/components/tabs/ContentTabBar.tsx

import { cn } from "@/lib/utils"
import type { ContentTab } from "../../types"
import { useEffect, useRef, useState } from "react"

const TABS: { value: ContentTab; label: string }[] = [
  { value: "party", label: "파티 기록" },
  { value: "personal", label: "개인 DPS" },
  { value: "balance", label: "밸런스 차트" },
]

interface ContentTabBarProps {
  active: ContentTab
  onChange: (value: ContentTab) => void
}

export default function ContentTabBar({
  active,
  onChange,
}: ContentTabBarProps) {
  const activeIndex = TABS.findIndex((t) => t.value === active)
  const [rect, setRect] = useState({ left: 0, width: 0 })
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    const el = refs.current[activeIndex]
    if (el) {
      setRect({
        left: el.offsetLeft,
        width: el.offsetWidth,
      })
    }
  }, [activeIndex])
  return (
    <div className="relative flex w-fit rounded-lg bg-muted/50 py-1.5">
      <div
        className="absolute top-1 h-[calc(100%-8px)] rounded-lg bg-background shadow-sm transition-[transform,width] duration-300 ease-out"
        style={{
          transform: `translateX(${rect.left}px)`,
          width: rect.width,
        }}
      />

      {/* 탭 버튼 */}
      {TABS.map((tab, index) => (
        <button
          ref={(el) => {
            refs.current[index] = el
          }}
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative z-10 px-4 py-1.5 text-sm transition-colors duration-200",
            active === tab.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
