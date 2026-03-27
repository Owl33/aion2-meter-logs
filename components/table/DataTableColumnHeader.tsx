// components/table/DataTableColumnHeader.tsx
import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span className={cn("text-[10px] uppercase tracking-wider", className)}>
        {title}
      </span>
    )
  }

  const sorted = column.getIsSorted()

  return (
    <button
      className={cn(
        "flex items-center gap-1 text-[10px] uppercase tracking-wider select-none",
        "transition-colors hover:text-foreground cursor-pointer",
        sorted ? "text-primary font-semibold" : "text-muted-foreground",
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