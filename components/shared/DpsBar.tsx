/**
 * components/shared/DpsBar.tsx
 *
 * 단순 진행 바 — 랭킹 테이블과 플레이어 카드 양쪽에서 사용
 */

import { cn } from "@/lib/utils";

interface DpsBarProps {
  /** 0 ~ 100 사이 퍼센트 값 */
  percent: number;
  /** 오른쪽에 표시할 레이블 (예: "44.3%") */
  label?: string;
  /** 바 색상 (기본: #7C6FE0) */
  color?: string;
  /** 바 높이 클래스 (기본: h-1.5) */
  heightClass?: string;
  className?: string;
}

export default function DpsBar({
  percent,
  label,
  color = "#7C6FE0",
  heightClass = "h-1.5",
  className,
}: DpsBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("flex-1 rounded-full bg-muted overflow-hidden", heightClass)}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", heightClass)}
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      {label && (
        <span className="text-[10px] text-muted-foreground min-w-[34px] text-right">
          {label}
        </span>
      )}
    </div>
  );
}
