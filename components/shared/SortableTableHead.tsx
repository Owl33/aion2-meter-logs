/**
 * components/shared/SortableTableHead.tsx
 * 클릭 정렬 + active 색상 강조를 가진 TableHead
 */

import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface SortableTableHeadProps {
  label: string
  sortKey: string
  activeKey: string
  onSort: (key: string) => void
  className?: string
}

export default function SortableTableHead({
  label,
  sortKey,
  activeKey,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isActive = sortKey === activeKey

  return (
    <TableHead
      className={cn(
        "cursor-pointer text-right text-[10px] tracking-wider uppercase select-none",
        "transition-colors hover:text-foreground",
        isActive ? "text-primary" : "text-muted-foreground",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      {label}
      <span className="ml-1 text-[9px] opacity-60">{isActive ? "↓" : "↕"}</span>
    </TableHead>
  )
}
