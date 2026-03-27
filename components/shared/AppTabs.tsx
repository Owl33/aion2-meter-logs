"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface TabItem<T> {
  value: T
  label: string
}

interface TabBarProps<T> {
  tabs: TabItem<T>[]
  active: T
  onChange: (value: T) => void
}

export default function AppTabs<T>({ tabs, active, onChange }: TabBarProps<T>) {
  const activeIndex = tabs.findIndex((t) => t.value === active)

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

      {tabs.map((tab, index) => (
        <button
          key={String(tab.value)}
          ref={(el) => {
            refs.current[index] = el
          }}
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
