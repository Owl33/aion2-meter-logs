/**
 * components/home/DungeonRankingCard.tsx
 *
 * 던전 하나 → 1/2/3네임드 3컬럼 가로 배치
 * 각 컬럼 안에 Top 10 리스트
 */

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fmtDps } from "@/lib/formatters"
import JobBadge from "@/components/shared/JobBadge"

interface RankEntry {
  rank: number
  characterName: string
  jobName: string
  dps: number
  reportId: string
}

interface Boss {
  index: number
  name: string
  top10: RankEntry[]
}

interface DungeonRankingCardProps {
  dungeonId: string
  dungeonName: string
  bosses: Boss[]
}

const RANK_BADGE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  2: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

// ─── 네임드 단일 컬럼 ────────────────────────────────────────
function BossColumn({ dungeonId, boss }: { dungeonId: string; boss: Boss }) {
  const maxDps = boss.top10[0]?.dps ?? 1

  return (
    <div className="flex min-w-0 flex-col">
      {/* 네임드 헤더 */}
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-[11px] font-semibold text-primary">
            {boss.index}네임드
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {boss.name}
          </span>
        </div>
        <a
          href={`/rankings?dungeon=${dungeonId}&boss=${boss.index}`}
          className="ml-1 shrink-0 text-[10px] text-muted-foreground hover:text-primary hover:underline"
        >
          더보기
        </a>
      </div>

      {/* Top 10 리스트 */}
      <div className="divide-y divide-border/30">
        {boss.top10.map((entry) => (
          <a
            key={entry.reportId}
            href={`/reports/${entry.reportId}`}
            className="flex items-center gap-2 px-3 py-2 transition-colors duration-150 hover:bg-muted/30"
          >
            {/* 순위 */}
            <span
              className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                RANK_BADGE[entry.rank] ??
                  "text-[11px] font-medium text-muted-foreground"
              )}
            >
              {entry.rank}
            </span>

            {/* 캐릭터 + 직업 */}
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="truncate text-xs font-semibold">
                {entry.characterName}
              </span>
              <JobBadge job={entry.jobName} />
            </div>

            {/* DPS */}
            <span className="shrink-0 text-right text-xs font-bold tabular-nums">
              {fmtDps(entry.dps)}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── 던전 카드 (3컬럼) ───────────────────────────────────────
export default function DungeonRankingCard({
  dungeonId,
  dungeonName,
  bosses,
}: DungeonRankingCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 shadow-none">
      {/* 던전 헤더 */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/10 px-4 py-3">
        <h3 className="text-sm font-bold">{dungeonName}</h3>
        <a
          href={`/rankings?dungeon=${dungeonId}`}
          className="text-xs text-primary hover:underline"
        >
          전체 랭킹
        </a>
      </div>

      {/* 3컬럼 그리드 */}
      <div className="grid grid-cols-3 divide-x divide-border/50">
        {bosses.map((boss) => (
          <BossColumn key={boss.index} dungeonId={dungeonId} boss={boss} />
        ))}
      </div>
    </Card>
  )
}
