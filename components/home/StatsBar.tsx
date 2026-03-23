/**
 * components/home/StatsBar.tsx
 * 전체 통계 4개 카드
 */

import StatCard from "@/components/shared/StatCard";
import { fmtDps, fmtNumber } from "@/lib/formatters";

interface Stats {
  totalReports: number;
  totalReportsToday: number;
  totalCharacters: number;
  totalDungeons: number;
  totalBosses: number;
  topDps: number;
  topDpsDungeon: string;
}

export default function StatsBar({ stats }: { stats: Stats }) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        전체 통계
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="총 리포트"
          value={fmtNumber(stats.totalReports)}
          sub={`+${stats.totalReportsToday} 오늘`}
        />
        <StatCard
          label="등록 캐릭터"
          value={fmtNumber(stats.totalCharacters)}
          sub="활성 플레이어"
        />
        <StatCard
          label="분석된 보스"
          value={stats.totalBosses}
          sub={`${stats.totalDungeons}개 던전`}
        />
        <StatCard
          label="최고 DPS"
          value={fmtDps(stats.topDps)}
          sub={stats.topDpsDungeon}
        />
      </div>
    </section>
  );
}
