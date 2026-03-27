// components/table/DataTableToolbar.tsx
"use client"

import type { Table } from "@tanstack/react-table"
import FilterChip from "@/components/shared/FilterChip"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  columnId: string
  jobs: string[]
  label?: string
}

export function DataTableToolbar<TData>({
  table,
  columnId,
  jobs,
  label = "직업",
}: DataTableToolbarProps<TData>) {
  const current =
    (table.getColumn(columnId)?.getFilterValue() as string) ?? "전체"

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] text-muted-foreground">{label}</span>
      {jobs.map((job) => (
        <FilterChip
          key={job}
          label={job}
          active={current === job}
          onClick={() => table.getColumn(columnId)?.setFilterValue(job)}
        />
      ))}
    </div>
  )
}
