"use client"

// app/rankings/components/sidebar/DungeonSidebar.tsx

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Dungeon } from "../../types"

// 기간 필터는 현재 UI만 있고 데이터 연동이 없으므로
// 추후 연동 시 onPeriodChange prop 추가 예정
const PERIOD_OPTIONS = ["전체", "주간", "월간"] as const

interface DungeonSidebarProps {
  dungeons: Dungeon[]
  activeDungeonId: string
  onDungeonChange: (id: string) => void
}

export default function DungeonSidebar({
  dungeons,
  activeDungeonId,
  onDungeonChange,
}: DungeonSidebarProps) {
  return (
    <aside className="flex w-48 shrink-0 flex-col gap-1 border-r border-border/50 bg-background py-4">
      <p className="mb-1 px-3.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        던전
      </p>

      {dungeons.map((d) => (
        <div
          key={d.id}
          className={cn(
            "cursor-pointer border-l-2 px-3.5 py-2 text-sm leading-tight transition-colors",
            activeDungeonId === d.id
              ? "border-primary bg-primary/5 font-semibold text-foreground"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          onClick={() => onDungeonChange(d.id)}
        >
          {d.name}
        </div>
      ))}

      <Separator className=" my-2 w-auto" />

      <p className="mb-1 px-3.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        기간
      </p>
      {PERIOD_OPTIONS.map((p) => (
        <div
          key={p}
          className="cursor-pointer py-1 pr-3.5 pl-6 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {p}
        </div>
      ))}
    </aside>
  )
}
