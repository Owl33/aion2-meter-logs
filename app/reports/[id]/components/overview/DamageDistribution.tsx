// app/reports/[id]/components/overview/DamageDistribution.tsx

import SectionCard from "@/components/shared/SectionCard";
import ColorDot from "@/components/shared/ColorDot";
import type { Player } from "../../types";

interface DamageDistributionProps {
  players: Player[];
  colorMap: Record<number, string>;
  selectedPlayer: number | null;
}

export default function DamageDistribution({
  players,
  colorMap,
  selectedPlayer,
}: DamageDistributionProps) {
  return (
    <SectionCard title="파티 딜 분포">
      {/* 분포 바 */}
      <div className="h-7 rounded-lg overflow-hidden flex mb-3">
        {players.map((p) => (
          <div
            key={p.entityId}
            className="h-full flex items-center justify-center text-[11px] font-semibold text-white transition-all duration-300 overflow-hidden whitespace-nowrap"
            style={{
              width: `${p.damagePercent}%`,
              background: colorMap[p.entityId],
              opacity:
                selectedPlayer === null || selectedPlayer === p.entityId ? 1 : 0.35,
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
            <span className="text-muted-foreground">{p.damagePercent.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
