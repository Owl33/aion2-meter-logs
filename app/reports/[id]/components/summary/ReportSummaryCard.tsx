// app/reports/[id]/components/summary/ReportSummaryCard.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { fmtDps, fmtDmg, fmtSeconds, fmtTimestamp } from "@/lib/formatters"
import type { ReportData } from "../../types"

interface SummaryStat {
  label: string
  value: string
  mono?: boolean
}

interface ReportSummaryCardProps {
  report: ReportData
}

export default function ReportSummaryCard({ report }: ReportSummaryCardProps) {
  const partyDps = Math.round(report.totalPartyDamage / report.elapsedSeconds)

  const stats: SummaryStat[] = [
    { label: "클리어 시간", value: fmtSeconds(report.elapsedSeconds) },
    { label: "총 피해량", value: fmtDmg(report.totalPartyDamage) },
    { label: "파티 DPS", value: fmtDps(partyDps) },
    { label: "참여 인원", value: `${report.players.length}명` },
    { label: "리포트 ID", value: `#${report.id.slice(0, 8)}`, mono: true },
  ]

  return (
    <Card className="border-border/50 shadow-none">
      <CardContent className="flex flex-wrap items-center justify-between gap-6 p-5">
        <div className="flex flex-col gap-1">
          <Badge
            variant="outline"
            className="w-fit rounded-full border-0 bg-primary/15 text-[11px] text-primary"
          >
            {report.dungeon}
          </Badge>
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            {report.targetName}
            <span className="rounded border border-border/50 px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
              {report.bossIndex}네임드
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            {fmtTimestamp(report.timestamp)}
          </p>
        </div>

        <div className="flex flex-wrap items-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="px-5 text-right">
                <p className="mb-1 text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    stat.mono && "font-mono text-sm"
                  )}
                >
                  {stat.value}
                </p>
              </div>
              {i < stats.length - 1 && (
                <Separator orientation="vertical" className="h-8" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
