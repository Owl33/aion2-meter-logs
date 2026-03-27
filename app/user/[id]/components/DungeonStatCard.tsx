// app/user/[id]/components/DungeonStatCard.tsx

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fmtDps, fmtTimeMmSs } from "@/lib/formatters"
import StatBlock from "@/components/shared/StatBlock"
import GlobalRankBadge from "@/components/shared/GlobalRankBadge"
import type { DungeonStat } from "../types"

interface DungeonStatCardProps {
  stat: DungeonStat
}

export default function DungeonStatCard({ stat }: DungeonStatCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden border-border/50 py-0 shadow-none">
      {/* 헤더 */}
      <div className="border-b border-border/50 bg-muted/20 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-0.5 text-xs text-muted-foreground">던전</p>
            <h3 className="text-sm font-bold">{stat.dungeonName}</h3>
          </div>
          <div className="text-right">
            <p className="mb-0.5 text-[10px] text-muted-foreground">
              글로벌 랭킹
            </p>
            <GlobalRankBadge rank={stat.globalRank} />
          </div>
        </div>
      </div>

      {/* 스탯 그리드 */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <StatBlock label="클리어" value={`${stat.clears}회`} />
        <StatBlock
          label="베스트 DPS"
          value={fmtDps(stat.bestDps)}
          valueClassName="text-primary"
        />
        <StatBlock label="평균 DPS" value={fmtDps(stat.avgDps)} />
        <StatBlock
          label="최단 클리어"
          value={fmtTimeMmSs(stat.bestClearTime)}
        />
      </div>

      {/* 보스별 토글 */}
      <div className="border-t border-border/50">
        <button
          className="flex w-full items-center justify-between px-4 py-2 text-left text-xs text-muted-foreground"
          onClick={() => setExpanded((v) => !v)}
        >
          <span>보스별 상세</span>
        </button>

        <div className="flex flex-col gap-2 px-4 pb-3">
          {stat.bosses.map((boss) => (
            <div
              key={boss.index}
              className="flex items-center justify-between border-b border-border/30 py-1.5 last:border-0"
            >
              <div>
                <span className="text-xs font-medium">{boss.index}네임드</span>
                <span className="ml-1.5 text-[11px] text-muted-foreground">
                  {boss.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-xs text-muted-foreground">
                  {boss.clears}회
                </span>
                <span className="text-xs font-semibold tabular-nums">
                  {fmtDps(boss.bestDps)}
                </span>
                <GlobalRankBadge rank={boss.globalRank} className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
