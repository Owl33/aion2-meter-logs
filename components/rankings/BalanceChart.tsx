"use client";

/**
 * components/rankings/BalanceChart.tsx
 */

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import FilterChip from "@/components/shared/FilterChip";
import BoxPlotChart, { type BoxPlotItem } from "@/components/charts/BoxPlotChart";

// ─── 타입 ────────────────────────────────────────────────────
interface StatEntry {
  jobName: string;
  min: number;
  avg: number;
  max: number;
  q1?: number;
  q3?: number;
  outliers?: number[];
}

interface BossStats {
  dateRange: { from: string; to: string };
  data: StatEntry[];
}

interface BalanceChartProps {
  statsByBoss: Record<string, BossStats>;
  bosses: { index: number; name: string }[];
  fixedBossIndex?: number;
}

// ─── 직업 색상 ───────────────────────────────────────────────
const JOB_COLORS: Record<string, string> = {
  검사:   "#E84D4D",
  정령사: "#5B9BD5",
  사수:   "#34C89A",
  성직자: "#F5A623",
  마법사: "#A855F7",
  격투가: "#F97316",
};

const PERIOD_OPTIONS = [
  { label: "1개월", value: "month" },
  { label: "전체",  value: "all"   },
] as const;
type Period = "month" | "all";

export default function BalanceChart({
  statsByBoss,
  bosses,
  fixedBossIndex,
}: BalanceChartProps) {
  const [bossFilter, setBossFilter] = useState<string>(
    fixedBossIndex ? String(fixedBossIndex) : "all"
  );
  const [period, setPeriod] = useState<Period>("month");

  const currentStats = statsByBoss[bossFilter];

  // StatEntry[] → BoxPlotItem[] 변환
  const chartItems = useMemo<BoxPlotItem[]>(() => {
    if (!currentStats?.data.length) return [];
    return currentStats.data.map((d) => ({
      label:    d.jobName,
      color:    JOB_COLORS[d.jobName] ?? "#7C6FE0",
      min:      d.min,
      q1:       d.q1,
      median:   d.avg,
      q3:       d.q3,
      max:      d.max,
      outliers: d.outliers,
    }));
  }, [currentStats]);

  const bossFilterOptions = useMemo(() => {
    const opts: { label: string; value: string }[] = [];
    if (!fixedBossIndex) opts.push({ label: "전체", value: "all" });
    bosses.forEach((b) =>
      opts.push({ label: `${b.index}네임드`, value: String(b.index) })
    );
    return opts;
  }, [bosses, fixedBossIndex]);

  // 직업 수에 따라 차트 높이 동적 조정
  const chartHeight = Math.max(240, chartItems.length * 64 + 60);

  return (
    <div className="flex flex-col gap-3">
      {/* 필터 행 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {!fixedBossIndex && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground mr-1">네임드</span>
            {bossFilterOptions.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={bossFilter === opt.value}
                onClick={() => setBossFilter(opt.value)}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[11px] text-muted-foreground mr-1">기간</span>
          {PERIOD_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={period === opt.value}
              onClick={() => setPeriod(opt.value)}
            />
          ))}
        </div>
      </div>

      <Card className="border-border/50 shadow-none p-5">
        {currentStats && (
          <p className="text-[11px] text-muted-foreground mb-3">
            {period === "month"
              ? `${currentStats.dateRange.from} ~ ${currentStats.dateRange.to}`
              : "전체 기간"}{" "}
            · 박스: Q1~Q3 · 수염: min~max · 세로선: 평균
          </p>
        )}

        {!chartItems.length ? (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            데이터가 없습니다.
          </div>
        ) : (
          <BoxPlotChart items={chartItems} height={chartHeight} />
        )}
      </Card>
    </div>
  );
}
