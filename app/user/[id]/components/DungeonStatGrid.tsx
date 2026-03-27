// app/user/[id]/components/DungeonStatGrid.tsx

import DungeonStatCard from "./DungeonStatCard";
import type { DungeonStat } from "../types";

interface DungeonStatGridProps {
  dungeonStats: DungeonStat[];
}

export default function DungeonStatGrid({ dungeonStats }: DungeonStatGridProps) {
  if (!dungeonStats.length) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
        던전 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dungeonStats.map((stat) => (
        <DungeonStatCard key={stat.dungeonId} stat={stat} />
      ))}
    </div>
  );
}
