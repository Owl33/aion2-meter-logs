// app/reports/[id]/components/overview/OverviewTab.tsx

import { useMemo } from "react";
import SectionCard from "@/components/shared/SectionCard";
import ColorDot from "@/components/shared/ColorDot";
import DpsLineChart from "@/components/charts/DpsLineChart";
import PlayerCard from "./PlayerCard";
import DamageDistribution from "./DamageDistribution";
import type { ReportData } from "../../types";

interface OverviewTabProps {
  report: ReportData;
  colorMap: Record<number, string>;
  selectedPlayer: number | null;
  onTogglePlayer: (id: number) => void;
}

export default function OverviewTab({
  report,
  colorMap,
  selectedPlayer,
  onTogglePlayer,
}: OverviewTabProps) {
  const series = useMemo(
    () =>
      report.players.map((player) => ({
        id: player.entityId,
        label: player.name,
        color: colorMap[player.entityId],
        active: selectedPlayer === null || selectedPlayer === player.entityId,
        data: report.timeline.flatMap((tick) => {
          const entry = tick.players.find((p) => p.entityId === player.entityId);
          return entry ? [{ t: tick.t, dps: entry.dps }] : [];
        }),
      })),
    [report, colorMap, selectedPlayer]
  );

  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 items-start">
      {/* 플레이어 카드 목록 */}
      <div className="flex flex-col gap-2">
        {report.players.map((player) => (
          <PlayerCard
            key={player.entityId}
            player={player}
            color={colorMap[player.entityId]}
            isActive={selectedPlayer === player.entityId}
            onSelect={() => onTogglePlayer(player.entityId)}
          />
        ))}
      </div>

      {/* 오른쪽 패널 */}
      <div className="flex flex-col gap-3">
        <DamageDistribution
          players={report.players}
          colorMap={colorMap}
          selectedPlayer={selectedPlayer}
        />

        {/* DPS 타임라인 */}
        <SectionCard title="DPS 타임라인" contentClassName="pt-0">
          <DpsLineChart series={series} height={240} />
          <div className="flex gap-3.5 flex-wrap mt-3">
            {report.players.map((p) => (
              <div key={p.entityId} className="flex items-center gap-1.5">
                <ColorDot color={colorMap[p.entityId]} />
                <span className="text-[11px] text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
