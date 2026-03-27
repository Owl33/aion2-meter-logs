"use client"

// components/table/DataTable.tsx
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type HeaderContext,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableFooter } from "./DataTableFooter"
import { DataTableHeaderCell } from "./DataTableHeaderCell"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  emptyMessage?: string
  pageSize?: number
  pagination?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
  onClickRow?: (row: TData) => void
}

function extractHeaderTitle<TData, TValue>(
  col: ColumnDef<TData, TValue>,
  ctx: HeaderContext<TData, TValue>
): string {
  const meta = col.meta as { title?: string } | undefined

  if (meta?.title) return meta.title

  if (typeof col.header === "string") return col.header

  if (typeof col.header === "function") {
    const rendered = col.header(ctx)
    if (
      rendered &&
      typeof rendered === "object" &&
      "props" in rendered &&
      typeof rendered.props?.children === "string"
    ) {
      return rendered.props.children
    }
  }

  return ("accessorKey" in col ? String(col.accessorKey) : col.id) ?? ""
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  emptyMessage = "기록이 없습니다.",
  pageSize = 20,
  hasMore = false,
  onLoadMore,
  pagination = true,
  onClickRow,
  isLoadingMore = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [mode, setMode] = useState<"pagination" | "infinite">("pagination")
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize,
  })

  // meta.sortable 기반으로 enableSorting 주입 + 헤더를 DataTableHeaderCell로 자동 래핑
  const normalizedColumns = columns.map((col) => {
    const sortable =
      (col.meta as { sortable?: boolean } | undefined)?.sortable ?? false

    if (!sortable) {
      return { ...col, enableSorting: false } as ColumnDef<TData, TValue>
    }

    return {
      ...col,
      enableSorting: true,
      header: (ctx: HeaderContext<TData, TValue>) => (
        <DataTableHeaderCell
          column={ctx.column}
          title={extractHeaderTitle(col, ctx)}
        />
      ),
    } as ColumnDef<TData, TValue>
  })

  const table = useReactTable({
    data,
    columns: normalizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater)
      setPaginationState((p) => ({ ...p, pageIndex: 0 }))
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPaginationState,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination:
        mode === "infinite"
          ? { pageIndex: 0, pageSize: data.length || 9999 }
          : paginationState,
    },
    manualPagination: false,
  })

  const handleModeChange = (next: "pagination" | "infinite") => {
    setMode(next)
    if (next === "pagination") {
      setPaginationState((p) => ({ ...p, pageIndex: 0 }))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {toolbar?.(table)}

      <Table className="overflow-hidden rounded-lg">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-muted/30 hover:bg-muted/30"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => onClickRow?.(row.original)}
                key={row.id}
                className={cn(
                  "border-b-gray-100 transition-all duration-250 ease-in-out",
                  onClickRow && "cursor-pointer hover:-translate-y-0.5"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="first:rounded-l-lg last:rounded-r-lg"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-16 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && (
        <DataTableFooter
          table={table}
          mode={mode}
          onModeChange={handleModeChange}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
        />
      )}
    </div>
  )
}
