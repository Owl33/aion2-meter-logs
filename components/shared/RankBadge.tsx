// components/shared/RankBadge.tsx

import { cn } from "@/lib/utils";

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  2: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export default function RankBadge({ rank, className }: RankBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold",
        RANK_STYLE[rank] ?? "text-muted-foreground text-xs font-medium",
        className
      )}
    >
      {rank}
    </span>
  );
}
