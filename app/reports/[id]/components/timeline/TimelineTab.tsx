// app/reports/[id]/components/timeline/TimelineTab.tsx

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import SectionCard from "@/components/shared/SectionCard";
import ColorDot from "@/components/shared/ColorDot";
import FilterChip from "@/components/shared/FilterChip";
import DpsLineChart from "@/components/charts/DpsLineChart";
import { fmtDps } from "@/lib/formatters";
import type { ReportData } from "../../types";

interface TimelineTabProps {
  report: ReportData;
  colorMap: Record<number, string>;
  selectedPlayer: number | null;
  onTogglePlayer: (id: number) => void;
}

export default function TimelineTab({
  report,
  colorMap,
  selectedPlayer,
  onTogglePlayer,
}: TimelineTabProps) {
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
    <div className="flex flex-col gap-3">
      {/* 플레이어 필터 */}
      <div className="flex gap-2 flex-wrap">
        {report.players.map((p) => (
          <FilterChip
            key={p.entityId}
            label={p.name}
            active={selectedPlayer === p.entityId}
            accentColor={colorMap[p.entityId]}
            onClick={() => onTogglePlayer(p.entityId)}
          />
        ))}
      </div>

      {/* DPS 차트 */}
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

      {/* 타임라인 테이블 */}
      <Card className="border-border/50 shadow-none overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider">시간</TableHead>
              {report.players.map((p) => (
                <TableHead
                  key={p.entityId}
                  className="text-right text-[10px] uppercase tracking-wider whitespace-nowrap font-semibold"
                  style={{ color: colorMap[p.entityId] }}
                >
                  {p.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.timeline.map((tick) => (
              <TableRow key={tick.t} className="hover:bg-muted/30">
                <TableCell className="text-xs text-muted-foreground tabular-nums">
                  {tick.t}s
                </TableCell>
                {report.players.map((p) => {
                  const entry = tick.players.find((tp) => tp.entityId === p.entityId);
                  return (
                    <TableCell key={p.entityId} className="text-right text-xs tabular-nums">
                      {entry ? fmtDps(entry.dps) : "—"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
