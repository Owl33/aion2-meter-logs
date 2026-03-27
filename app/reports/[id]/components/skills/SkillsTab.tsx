// app/reports/[id]/components/skills/SkillsTab.tsx

import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fmtDps, fmtDmg } from "@/lib/formatters";
import DpsBar from "@/components/shared/DpsBar";
import ColorDot from "@/components/shared/ColorDot";
import FilterChip from "@/components/shared/FilterChip";
import type { Player } from "../../types";

// ─── SkillTable ───────────────────────────────────────────────
interface SkillTableProps {
  player: Player;
  color: string;
}

function SkillTable({ player, color }: SkillTableProps) {
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
                        src={skill.icon}
                        alt={skill.name}
                        className="w-6 h-6 object-cover rounded-md"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-muted rounded-md" />
                    )}
                  </div>
                  <span className="text-xs whitespace-nowrap">{skill.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums font-medium">
                {fmtDps(skill.dps)}
              </TableCell>
              <TableCell>
                <DpsBar
                  percent={(skill.dps / maxDps) * 100}
                  label={`${skill.percent.toFixed(1)}%`}
                  color={color}
                  heightClass="h-1.5"
                />
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums">
                {fmtDmg(skill.totalDamage)}
              </TableCell>
              <TableCell className="text-right text-xs">{skill.hitCount}</TableCell>
              <TableCell className="text-right text-xs">
                <span
                  className={cn(
                    "tabular-nums",
                    skill.hitCount > 0 &&
                      skill.critCount / skill.hitCount > 0.7 &&
                      "text-amber-500 font-semibold"
                  )}
                >
                  {skill.hitCount > 0
                    ? Math.round((skill.critCount / skill.hitCount) * 100)
                    : 0}%
                </span>
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums">
                {fmtDmg(skill.avgDamage)}
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums">
                {fmtDmg(skill.maxDamage)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// ─── SkillsTab ────────────────────────────────────────────────
interface SkillsTabProps {
  players: Player[];
  colorMap: Record<number, string>;
  selectedPlayer: number | null;
  onTogglePlayer: (id: number) => void;
}

export default function SkillsTab({
  players,
  colorMap,
  selectedPlayer,
  onTogglePlayer,
}: SkillsTabProps) {
  const displayedPlayers =
    selectedPlayer !== null
      ? players.filter((p) => p.entityId === selectedPlayer)
      : players;

  return (
    <div>
      {/* 플레이어 필터 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <FilterChip
          label="전체"
          active={selectedPlayer === null}
          onClick={() => onTogglePlayer(-1)} // -1 신호로 전체 선택 처리
        />
        {players.map((p) => (
          <FilterChip
            key={p.entityId}
            label={p.name}
            active={selectedPlayer === p.entityId}
            accentColor={colorMap[p.entityId]}
            onClick={() => onTogglePlayer(p.entityId)}
          />
        ))}
      </div>

      {/* 스킬 테이블 목록 */}
      {displayedPlayers.map((player) => (
        <SkillTable
          key={player.entityId}
          player={player}
          color={colorMap[player.entityId]}
        />
      ))}
    </div>
  );
}
