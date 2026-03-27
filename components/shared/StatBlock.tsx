// components/shared/StatBlock.tsx
// 레이블 + 값 형태의 통계 블록 — UserProfileCard, DungeonStatCard 등에서 공용

import { cn } from "@/lib/utils";

interface StatBlockProps {
  label: string;
  value: string;
  valueClassName?: string;
  className?: string;
}

export default function StatBlock({
  label,
  value,
  valueClassName,
  className,
}: StatBlockProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className={cn("text-sm font-semibold tabular-nums", valueClassName)}>
        {value}
      </span>
    </div>
  );
}
