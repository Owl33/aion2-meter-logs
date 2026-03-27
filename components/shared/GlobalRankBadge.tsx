// components/shared/GlobalRankBadge.tsx
// 글로벌 랭킹 표시 — null이면 "-" 표기

import { cn } from "@/lib/utils";

interface GlobalRankBadgeProps {
  rank: number | null;
  className?: string;
}

export default function GlobalRankBadge({ rank, className }: GlobalRankBadgeProps) {
  if (rank === null) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>—</span>
    );
  }

  const isTop = rank <= 10;
  const isMid = rank <= 50;

  return (
    <span
      className={cn(
        "text-sm font-bold tabular-nums",
        isTop ? "text-amber-500" : isMid ? "text-primary" : "text-foreground",
        className
      )}
    >
      #{rank}
    </span>
  );
}
