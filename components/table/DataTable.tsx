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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  emptyMessage?: string
  pageSize?: number
  /** false로 넘기면 footer 자체가 렌더되지 않음 */
  pagination?: boolean
  // 무한스크롤 관련 props는 외부 데이터 페칭이 필요할 때만 선택적으로
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      // 필터 바뀌면 첫 페이지로
      setColumnFilters(updater)
      setPaginationState((p) => ({ ...p, pageIndex: 0 }))
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPaginationState,
    // 무한스크롤 모드일 때는 pageSize를 전체 데이터 수로 설정해 한 번에 다 보여줌
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
    // 페이지네이션으로 돌아올 때 첫 페이지로 리셋
    if (next === "pagination") {
      setPaginationState((p) => ({ ...p, pageIndex: 0 }))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {toolbar?.(table)}

      <Table className="overflow-hidden rounded-lg">
        <TableHeader className="">
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
              <TableRow key={row.id} className="align-middle hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
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
