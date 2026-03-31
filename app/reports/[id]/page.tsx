import type { Metadata } from "next"
import rawReport from "@/data/newReport.json"
import skillsCatalog from "@/data/skills.json"
import ReportClient from "./client"
import {
  buildReportDataFromRaw,
  type RawReport,
  type SkillCatalogEntry,
} from "@/lib/reportFromPackets"

/**
 * app/reports/[id]/page.tsx
 *
 * 실제 fetch 연동 시:
 *   const reportData = await fetchReport(params.id);
 */

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const report = buildReportDataFromRaw({
    raw: rawReport as RawReport,
    reportId: params.id,
    skillsCatalog: skillsCatalog as SkillCatalogEntry[],
  })
  const topPlayer = report.players[0]

  return {
    title: `${report.targetName} — ${report.dungeon}`,
    description: `${report.dungeon} ${report.bossIndex}네임드 클리어 리포트. 최고 DPS: ${topPlayer?.name} ${(topPlayer?.dps / 1000).toFixed(1)}k`,
    openGraph: {
      title: `${report.targetName} 클리어 리포트 | AionLogs`,
      description: `파티 DPS: ${Math.round(report.totalPartyDamage / report.elapsedSeconds).toLocaleString()} · 참여 ${report.players.length}명`,
    },
  }
}

export default function ReportsPage({ params }: { params: { id: string } }) {
  const reportData = buildReportDataFromRaw({
    raw: rawReport as RawReport,
    reportId: params.id,
    skillsCatalog: skillsCatalog as SkillCatalogEntry[],
  })
  return <ReportClient reportData={reportData} />
}
