// components/table/DataTableHeaderCell.tsx
import type { Column, RowData } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// ColumnDef의 meta 타입을 전역으로 확장
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    sortable?: boolean
  }
}

interface DataTableHeaderCellProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableHeaderCell<TData, TValue>({
  column,
  title,
  className,
}: DataTableHeaderCellProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span className={cn("tracking-wider uppercase", className)}>{title}</span>
    )
  }

  const sorted = column.getIsSorted()

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2",
        sorted ? "font-semibold text-primary" : "",
        className
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="h-3 w-3" />
      ) : sorted === "desc" ? (
        <ArrowDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  )
}
