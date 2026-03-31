// app/reports/[id]/components/overview/DamageDistribution.tsx

import SectionCard from "@/components/shared/SectionCard"
import ColorDot from "@/components/shared/ColorDot"
import type { Player } from "../../types"

interface DamageDistributionProps {
  players: Player[]
  colorMap: Record<number, string>
  selectedPlayer: number | null
}

export default function DamageDistribution({
  players,
  colorMap,
  selectedPlayer,
}: DamageDistributionProps) {
  return (
    <SectionCard title="파티 딜 분포" className="py-2">
      {/* 분포 바 */}
      <div className="mb-3 flex h-7 overflow-hidden rounded-lg">
        {players.map((p) => (
          <div
            key={p.entityId}
            className="flex h-full items-center justify-center overflow-hidden text-[11px] font-semibold whitespace-nowrap text-white transition-all duration-300"
            style={{
              width: `${p.damagePercent}%`,
              background: colorMap[p.entityId],
              opacity:
                selectedPlayer === null || selectedPlayer === p.entityId
                  ? 1
                  : 0.35,
            }}
          >
            {p.damagePercent >= 8 ? `${p.damagePercent.toFixed(1)}%` : ""}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-3">
        {players.map((p) => (
          <div key={p.entityId} className="flex items-center gap-1.5 text-xs">
            <ColorDot color={colorMap[p.entityId]} shape="square" />
            <span>{p.name}</span>
            <span className="text-muted-foreground">
              {p.damagePercent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
