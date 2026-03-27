"use client"

// app/rankings/components/content/BalanceChart.tsx

import { useMemo, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import FilterChip from "@/components/shared/FilterChip"
import BoxPlotChart, {
  type BoxPlotItem,
} from "@/components/charts/BoxPlotChart"
import type { Boss, BossStats, Period } from "../../types"

const JOB_COLORS: Record<string, string> = {
  검성: "#E84D4D",
  정령성: "#5B9BD5",
  궁수: "#34C89A",
  치유성: "#F5A623",
  마도성: "#A855F7",
  수호성: "#F97316",
}

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "1개월", value: "month" },
  { label: "전체", value: "all" },
]

interface BalanceChartProps {
  statsByBoss: Record<string, BossStats>
  bosses: Boss[]
  fixedBossIndex?: number
}

export default function BalanceChart({
  statsByBoss,
  bosses,
  fixedBossIndex,
}: BalanceChartProps) {
  // fixedBossIndex prop이 바뀌면 내부 state도 동기화 (버그 수정)
  const [bossFilter, setBossFilter] = useState<string>(
    fixedBossIndex != null ? String(fixedBossIndex) : "all"
  )
  const [period, setPeriod] = useState<Period>("month")

  useEffect(() => {
    setBossFilter(fixedBossIndex != null ? String(fixedBossIndex) : "all")
  }, [fixedBossIndex])

  const currentStats = statsByBoss[bossFilter]

  const chartItems = useMemo<BoxPlotItem[]>(() => {
    if (!currentStats?.data.length) return []
    return currentStats.data.map((d) => ({
      label: d.jobName,
      color: JOB_COLORS[d.jobName] ?? "#7C6FE0",
      min: d.min,
      q1: d.q1,
      median: d.avg,
      q3: d.q3,
      max: d.max,
      outliers: d.outliers,
    }))
  }, [currentStats])

  const bossFilterOptions = useMemo(() => {
    const opts: { label: string; value: string }[] = []
    if (fixedBossIndex == null) opts.push({ label: "전체", value: "all" })
    bosses.forEach((b) =>
      opts.push({ label: `${b.index}네임드`, value: String(b.index) })
    )
    return opts
  }, [bosses, fixedBossIndex])

  const chartHeight = Math.max(240, chartItems.length * 64 + 60)

  return (
    <div className="flex flex-col gap-3">
      {/* 필터 행 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {fixedBossIndex == null && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] text-muted-foreground">
              네임드
            </span>
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
        <div className="ml-auto flex items-center gap-1.5">
          <span className="mr-1 text-[11px] text-muted-foreground">기간</span>
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

      <Card className="border-border/50 p-5 shadow-none">
        {currentStats && (
          <p className="mb-3 text-[11px] text-muted-foreground">
            {period === "month"
              ? `${currentStats.dateRange.from} ~ ${currentStats.dateRange.to}`
              : "전체 기간"}{" "}
            · 박스: Q1~Q3 · 수염: min~max · 세로선: 평균
          </p>
        )}

        {!chartItems.length ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            데이터가 없습니다.
          </div>
        ) : (
          <BoxPlotChart items={chartItems} height={chartHeight} />
        )}
      </Card>
    </div>
  )
}
