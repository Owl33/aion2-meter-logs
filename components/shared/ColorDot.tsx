/**
 * components/shared/ColorDot.tsx
 * 범례, 플레이어 카드, 차트 등에서 반복되는 색상 점
 */

import { cn } from "@/lib/utils";

type DotShape = "circle" | "square";
type DotSize = "sm" | "md";

interface ColorDotProps {
  color: string;
  shape?: DotShape;
  size?: DotSize;
  className?: string;
}

const SIZE_MAP: Record<DotSize, string> = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
};

const SHAPE_MAP: Record<DotShape, string> = {
  circle: "rounded-full",
  square: "rounded-sm",
};

export default function ColorDot({
  color,
  shape = "circle",
  size = "sm",
  className,
}: ColorDotProps) {
  return (
    <span
      className={cn("shrink-0 inline-block", SIZE_MAP[size], SHAPE_MAP[shape], className)}
      style={{ background: color }}
    />
  );
}
