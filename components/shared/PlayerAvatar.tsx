/**
 * components/shared/PlayerAvatar.tsx
 */

import { cn } from "@/lib/utils";

const JOB_COLORS: Record<string, string> = {
  검사:  "#E84D4D",
  정령사: "#5B9BD5",
  사수:  "#34C89A",
  성직자: "#F5A623",
  마법사: "#A855F7",
  격투가: "#F97316",
};

interface PlayerAvatarProps {
  name: string;
  jobName: string;
  /** 아바타 크기 클래스 (기본: w-8 h-8) */
  sizeClass?: string;
  className?: string;
}

export default function PlayerAvatar({
  name,
  jobName,
  sizeClass = "w-8 h-8",
  className,
}: PlayerAvatarProps) {
  const color = JOB_COLORS[jobName] ?? "#888888";

  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
        sizeClass,
        className
      )}
      style={{ background: `${color}22`, color }}
    >
      {name.slice(0, 1)}
    </div>
  );
}
