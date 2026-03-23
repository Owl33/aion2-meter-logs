"use client";

/**
 * components/report/ReportPage.tsx
 */

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fmtDps, fmtDmg, fmtSeconds, fmtTimestamp } from "@/lib/formatters";
import { buildColorMap } from "@/lib/playerColors";
import JobBadge from "@/components/shared/JobBadge";
import DpsBar from "@/components/shared/DpsBar";
import PlayerAvatar from "@/components/shared/PlayerAvatar";
import SectionCard from "@/components/shared/SectionCard";
import ColorDot from "@/components/shared/ColorDot";
import FilterChip from "@/components/shared/FilterChip";
import { AppTabs, AppTabsList, AppTabsTrigger, AppTabsContent } from "@/components/shared/AppTabs";
import DpsLineChart from "@/components/charts/DpsLineChart";

// ─── 타입 ────────────────────────────────────────────────────
interface Skill {
  name: string; icon: string; dps: number; percent: number;
  hitCount: number; critCount: number; avgDamage: number;
  maxDamage: number; totalDamage: number; backCount: number;
  hardHitCount: number; perfectCount: number;
}

interface Player {
  entityId: number; name: string; jobCode: number; jobName: string;
  serverId: number; isUploader: boolean; totalDamage: number;
  dps: number; partyDps: number; wallDps: number; damagePercent: number;
  critRate: number; healTotal: number; combatScore: number;
  combatPower: number; topSkills: Skill[];
}

interface TimelineEntry {
  t: number;
  players: { entityId: number; dps: number; damage: number }[];
}

export interface ReportData {
  id: string; timestamp: string; elapsedSeconds: number;
  dungeon: string; bossIndex: number; targetName: string;
  targetMaxHp: number; totalPartyDamage: number;
  players: Player[]; timeline: TimelineEntry[];
}

// ─── DPS 차트 래퍼 ───────────────────────────────────────────
function DpsChartSection({
  report,
  colorMap,
  activePlayer,
}: {
  report: ReportData;
  colorMap: Record<number, string>;
  activePlayer: number | null;
}) {
  // ReportData → DpsLineChart series 변환
  const series = useMemo(() =>
    report.players.map((player) => ({
      id: player.entityId,
      label: player.name,
      color: colorMap[player.entityId],
      active: activePlayer === null || activePlayer === player.entityId,
      data: report.timeline.flatMap((tick) => {
        const entry = tick.players.find((p) => p.entityId === player.entityId);
        return entry ? [{ t: tick.t, dps: entry.dps }] : [];
      }),
    })),
    [report, colorMap, activePlayer]
  );

  return (
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
  );
}

// ─── PlayerCard ──────────────────────────────────────────────
function PlayerCard({
  player, color, isActive, onSelect,
}: {
  player: Player; color: string; isActive: boolean; onSelect: () => void;
}) {
  return (
    <button
      className={cn(
        "w-full text-left rounded-xl border p-3 flex flex-col gap-2 transition-all",
        "hover:bg-muted/40",
        isActive
          ? "border-[--player-color] bg-[--player-color]/5"
          : "border-border/50 bg-background"
      )}
      style={{ "--player-color": color } as React.CSSProperties}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <PlayerAvatar name={player.name} jobName={player.jobName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold truncate">{player.name}</span>
            {player.isUploader && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#7C6FE0]/40 text-[#7C6FE0] bg-[#7C6FE0]/10">
                업로더
              </Badge>
            )}
          </div>
          <JobBadge job={player.jobName} className="mt-0.5" />
        </div>
        <div className="text-right shrink-0">
          <div className="text-[15px] font-bold tabular-nums">{fmtDps(player.dps)}</div>
          <div className="text-[11px] text-muted-foreground">{player.damagePercent.toFixed(1)}%</div>
        </div>
      </div>
      <DpsBar percent={player.damagePercent} heightClass="h-[3px]" color={color} />
      <div className="flex gap-2.5 text-[11px] text-muted-foreground">
        <span>치명타 {player.critRate.toFixed(1)}%</span>
        <span>피해량 {fmtDmg(player.totalDamage)}</span>
        {player.healTotal > 0 && <span>힐량 {fmtDmg(player.healTotal)}</span>}
      </div>
    </button>
  );
}

// ─── SkillTable ──────────────────────────────────────────────
function SkillTable({ player, color }: { player: Player; color: string }) {
  const maxDps = Math.max(...player.topSkills.map((s) => s.dps));

  return (
    <Card className="border-border/50 shadow-none overflow-hidden mb-3">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <ColorDot color={color} size="md" />
        <span className="text-sm font-semibold">{player.name}</span>
        <span className="text-xs text-muted-foreground flex-1">{player.jobName}</span>
        <span className="text-sm font-semibold">{fmtDps(player.dps)} DPS</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-[10px] uppercase tracking-wider">스킬</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">DPS</TableHead>
            <TableHead className="w-32 text-[10px] uppercase tracking-wider">비율</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">피해량</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">횟수</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">치명</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">평균</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">최대</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {player.topSkills.map((skill) => (
            <TableRow key={skill.name} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-muted overflow-hidden shrink-0">
                    {skill.icon ? (
                      <img
                        src={skill.icon} alt={skill.name}
                        className="w-6 h-6 object-cover rounded-md"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-muted rounded-md" />
                    )}
                  </div>
                  <span className="text-xs whitespace-nowrap">{skill.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums font-medium">{fmtDps(skill.dps)}</TableCell>
              <TableCell>
                <DpsBar percent={(skill.dps / maxDps) * 100} label={`${skill.percent.toFixed(1)}%`} color={color} heightClass="h-1.5" />
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums">{fmtDmg(skill.totalDamage)}</TableCell>
              <TableCell className="text-right text-xs">{skill.hitCount}</TableCell>
              <TableCell className="text-right text-xs">
                <span className={cn("tabular-nums", skill.hitCount > 0 && skill.critCount / skill.hitCount > 0.7 && "text-amber-500 font-semibold")}>
                  {skill.hitCount > 0 ? Math.round((skill.critCount / skill.hitCount) * 100) : 0}%
                </span>
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums">{fmtDmg(skill.avgDamage)}</TableCell>
              <TableCell className="text-right text-xs tabular-nums">{fmtDmg(skill.maxDamage)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────
export default function ReportPage({ reportData }: { reportData: ReportData }) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const colorMap = useMemo(
    () => buildColorMap(reportData.players.map((p) => p.entityId)),
    [reportData.players]
  );

  const togglePlayer = (id: number) =>
    setSelectedPlayer((prev) => (prev === id ? null : id));

  const displayedPlayers = selectedPlayer !== null
    ? reportData.players.filter((p) => p.entityId === selectedPlayer)
    : reportData.players;

  const partyDps = Math.round(reportData.totalPartyDamage / reportData.elapsedSeconds);

  const summaryStats = [
    { label: "클리어 시간", value: fmtSeconds(reportData.elapsedSeconds) },
    { label: "총 피해량",   value: fmtDmg(reportData.totalPartyDamage) },
    { label: "파티 DPS",   value: fmtDps(partyDps) },
    { label: "참여 인원",  value: `${reportData.players.length}명` },
    { label: "리포트 ID",  value: `#${reportData.id.slice(0, 8)}`, mono: true },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-6 pb-16 flex flex-col gap-5">
      {/* 상단 요약 */}
      <Card className="border-border/50 shadow-none">
        <CardContent className="p-5 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="w-fit text-[11px] border-0 bg-[#7C6FE0]/15 text-[#7C6FE0] rounded-full">
              {reportData.dungeon}
            </Badge>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              {reportData.targetName}
              <span className="text-xs font-normal text-muted-foreground border border-border/50 rounded px-1.5 py-0.5">
                {reportData.bossIndex}네임드
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">{fmtTimestamp(reportData.timestamp)}</p>
          </div>
          <div className="flex items-center flex-wrap">
            {summaryStats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <div className="px-5 text-right">
                  <p className="text-[11px] text-muted-foreground mb-1">{stat.label}</p>
                  <p className={cn("text-lg font-semibold", stat.mono && "font-mono text-sm")}>
                    {stat.value}
                  </p>
                </div>
                {i < summaryStats.length - 1 && <Separator orientation="vertical" className="h-8" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 탭 */}
      <AppTabs defaultValue="overview">
        <AppTabsList>
          <AppTabsTrigger value="overview">개요</AppTabsTrigger>
          <AppTabsTrigger value="skills">스킬 분석</AppTabsTrigger>
          <AppTabsTrigger value="timeline">타임라인</AppTabsTrigger>
        </AppTabsList>

        {/* 개요 탭 */}
        <AppTabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-[300px_1fr] gap-4 items-start">
            <div className="flex flex-col gap-2">
              {reportData.players.map((player) => (
                <PlayerCard
                  key={player.entityId}
                  player={player}
                  color={colorMap[player.entityId]}
                  isActive={selectedPlayer === player.entityId}
                  onSelect={() => togglePlayer(player.entityId)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <SectionCard title="파티 딜 분포">
                <div className="h-7 rounded-lg overflow-hidden flex mb-3">
                  {reportData.players.map((p) => (
                    <div
                      key={p.entityId}
                      className="h-full flex items-center justify-center text-[11px] font-semibold text-white transition-all duration-300 overflow-hidden whitespace-nowrap"
                      style={{
                        width: `${p.damagePercent}%`,
                        background: colorMap[p.entityId],
                        opacity: selectedPlayer === null || selectedPlayer === p.entityId ? 1 : 0.35,
                      }}
                    >
                      {p.damagePercent >= 8 ? `${p.damagePercent.toFixed(1)}%` : ""}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {reportData.players.map((p) => (
                    <div key={p.entityId} className="flex items-center gap-1.5 text-xs">
                      <ColorDot color={colorMap[p.entityId]} shape="square" />
                      <span>{p.name}</span>
                      <span className="text-muted-foreground">{p.damagePercent.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
              <DpsChartSection
                report={reportData}
                colorMap={colorMap}
                activePlayer={selectedPlayer}
              />
            </div>
          </div>
        </AppTabsContent>

        {/* 스킬 분석 탭 */}
        <AppTabsContent value="skills" className="mt-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            <FilterChip label="전체" active={selectedPlayer === null} onClick={() => setSelectedPlayer(null)} />
            {reportData.players.map((p) => (
              <FilterChip
                key={p.entityId}
                label={p.name}
                active={selectedPlayer === p.entityId}
                accentColor={colorMap[p.entityId]}
                onClick={() => togglePlayer(p.entityId)}
              />
            ))}
          </div>
          {displayedPlayers.map((player) => (
            <SkillTable key={player.entityId} player={player} color={colorMap[player.entityId]} />
          ))}
        </AppTabsContent>

        {/* 타임라인 탭 */}
        <AppTabsContent value="timeline" className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            {reportData.players.map((p) => (
              <FilterChip
                key={p.entityId}
                label={p.name}
                active={selectedPlayer === p.entityId}
                accentColor={colorMap[p.entityId]}
                onClick={() => togglePlayer(p.entityId)}
              />
            ))}
          </div>
          <DpsChartSection
            report={reportData}
            colorMap={colorMap}
            activePlayer={selectedPlayer}
          />
          <Card className="border-border/50 shadow-none overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider">시간</TableHead>
                  {reportData.players.map((p) => (
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
                {reportData.timeline.map((tick) => (
                  <TableRow key={tick.t} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground tabular-nums">{tick.t}s</TableCell>
                    {reportData.players.map((p) => {
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
        </AppTabsContent>
      </AppTabs>
    </div>
  );
}
