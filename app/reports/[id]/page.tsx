import type { Metadata } from "next";
import reportData from "@/data/kPx2Qm9r.json";
import ReportClient from "./client";

/**
 * app/reports/[id]/page.tsx
 *
 * 실제 fetch 연동 시:
 *   const reportData = await fetchReport(params.id);
 */

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // mock 단계: 고정 데이터 사용
  const report = reportData;
  const topPlayer = report.players[0];

  return {
    title: `${report.targetName} — ${report.dungeon}`,
    description: `${report.dungeon} ${report.bossIndex}네임드 클리어 리포트. 최고 DPS: ${topPlayer?.name} ${(topPlayer?.dps / 1000).toFixed(1)}k`,
    openGraph: {
      title: `${report.targetName} 클리어 리포트 | AionLogs`,
      description: `파티 DPS: ${Math.round(report.totalPartyDamage / report.elapsedSeconds).toLocaleString()} · 참여 ${report.players.length}명`,
    },
  };
}

export default function ReportsPage({ params }: { params: { id: string } }) {
  return <ReportClient reportData={reportData} />;
}
