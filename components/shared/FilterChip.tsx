/**
 * components/shared/FilterChip.tsx
 * 직업 필터, 플레이어 선택 등 active 상태를 가진 pill 버튼
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  /** active 시 적용할 accent 색상 (기본: #7C6FE0) */
  accentColor?: string;
  className?: string;
}

export default function FilterChip({
  label,
  active,
  onClick,
  accentColor = "#7C6FE0",
  className,
}: FilterChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-7 px-3 text-xs rounded-full border-border/50 transition-all",
        active && "font-semibold",
        className
      )}
      style={
        active
          ? {
              background: `${accentColor}18`,
              color: accentColor,
              borderColor: `${accentColor}44`,
            }
          : undefined
      }
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
