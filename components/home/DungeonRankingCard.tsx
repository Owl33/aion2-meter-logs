/**
 * components/home/DungeonRankingCard.tsx
 *
 * 던전 하나 → 1/2/3네임드 3컬럼 가로 배치
 * 각 컬럼 안에 Top 10 리스트
 */

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fmtDps } from "@/lib/formatters";
import JobBadge from "@/components/shared/JobBadge";

interface RankEntry {
  rank: number;
  characterName: string;
  jobName: string;
  dps: number;
  reportId: string;
}

interface Boss {
  index: number;
  name: string;
  top10: RankEntry[];
}

interface DungeonRankingCardProps {
  dungeonId: string;
  dungeonName: string;
  bosses: Boss[];
}

const RANK_BADGE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  2: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

// ─── 네임드 단일 컬럼 ────────────────────────────────────────
function BossColumn({ dungeonId, boss }: { dungeonId: string; boss: Boss }) {
  const maxDps = boss.top10[0]?.dps ?? 1;

  return (
    <div className="flex flex-col min-w-0">
      {/* 네임드 헤더 */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-semibold text-[#7C6FE0] shrink-0">
            {boss.index}네임드
          </span>
          <span className="text-[11px] text-muted-foreground truncate">{boss.name}</span>
        </div>
        <a
          href={`/rankings?dungeon=${dungeonId}&boss=${boss.index}`}
          className="text-[10px] text-muted-foreground hover:text-[#7C6FE0] hover:underline shrink-0 ml-1"
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
            className="flex items-center gap-2 px-3 py-2 hover:bg-muted/30 transition-colors duration-150"
          >
            {/* 순위 */}
            <span
              className={cn(
                "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0",
                RANK_BADGE[entry.rank] ?? "text-muted-foreground text-[11px] font-medium"
              )}
            >
              {entry.rank}
            </span>

            {/* 캐릭터 + 직업 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-xs font-semibold truncate">{entry.characterName}</span>
              <JobBadge job={entry.jobName} />
            </div>

            {/* DPS */}
            <span className="text-xs font-bold tabular-nums shrink-0 text-right">
              {fmtDps(entry.dps)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── 던전 카드 (3컬럼) ───────────────────────────────────────
export default function DungeonRankingCard({
  dungeonId,
  dungeonName,
  bosses,
}: DungeonRankingCardProps) {
  return (
    <Card className="border-border/50 shadow-none overflow-hidden">
      {/* 던전 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/10">
        <h3 className="text-sm font-bold">{dungeonName}</h3>
        <a
          href={`/rankings?dungeon=${dungeonId}`}
          className="text-xs text-[#7C6FE0] hover:underline"
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
  );
}
