// app/reports/[id]/components/overview/PlayerCard.tsx

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { fmtDps, fmtDmg } from "@/lib/formatters"
import JobBadge from "@/components/shared/JobBadge"
import DpsBar from "@/components/shared/DpsBar"
import PlayerAvatar from "@/components/shared/PlayerAvatar"
import type { Player } from "../../types"

interface PlayerCardProps {
  player: Player
  color: string
  isActive: boolean
  onSelect: () => void
}

export default function PlayerCard({
  player,
  color,
  isActive,
  onSelect,
}: PlayerCardProps) {
  return (
    <button
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border p-3 text-left transition-all",
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
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold">
              {player.name}
            </span>
            {player.isUploader && (
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 px-1.5 py-0 text-[10px] text-primary"
              >
                업로더
              </Badge>
            )}
          </div>
          <JobBadge job={player.jobName} className="mt-0.5" />
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[15px] font-bold tabular-nums">
            {fmtDps(player.dps)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {player.damagePercent.toFixed(1)}%
          </div>
        </div>
      </div>

      <DpsBar
        percent={player.damagePercent}
        heightClass="h-[3px]"
        color={color}
      />

      <div className="flex gap-2.5 text-[11px] text-muted-foreground">
        <span>치명타 {player.critRate.toFixed(1)}%</span>
        <span>피해량 {fmtDmg(player.totalDamage)}</span>
        {player.healTotal > 0 && <span>힐량 {fmtDmg(player.healTotal)}</span>}
      </div>
    </button>
  )
}
