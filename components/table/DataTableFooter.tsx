"use client"

// components/table/DataTableFooter.tsx
import type { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

interface DataTableFooterProps<TData> {
  table: Table<TData>
  mode: "pagination" | "infinite"
  onModeChange: (mode: "pagination" | "infinite") => void
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
}

export function DataTableFooter<TData>({
  table,
  mode,
  onModeChange,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: DataTableFooterProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const from = pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between border-t border-border/50 px-2 py-3 text-[11px] text-muted-foreground">

      {/* 좌측: 모드 전환 토글 */}
      <div className="flex items-center gap-1 rounded-md border border-border/50 p-0.5">
        <button
          className={cn(
            "rounded px-2 py-1 transition-colors",
            mode === "pagination"
              ? "bg-muted text-foreground font-medium"
              : "hover:text-foreground"
          )}
          onClick={() => onModeChange("pagination")}
        >
          페이지
        </button>
        <button
          className={cn(
            "rounded px-2 py-1 transition-colors",
            mode === "infinite"
              ? "bg-muted text-foreground font-medium"
              : "hover:text-foreground"
          )}
          onClick={() => onModeChange("infinite")}
        >
          무한스크롤
        </button>
      </div>

      {/* 우측 */}
      {mode === "pagination" ? (
        <div className="flex items-center gap-4">

          {/* 페이지당 행 수 select */}
          <div className="flex items-center gap-1.5">
            <span>행</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                table.setPageSize(Number(v))
                table.setPageIndex(0)
              }}
            >
              <SelectTrigger className="h-6 w-16 text-[11px] px-2 py-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)} className="text-[11px]">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 현재 범위 */}
          <span>{from}–{to} / {totalRows}</span>

          {/* 페이지 이동 버튼 */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <span className="px-2">{pageIndex + 1} / {pageCount}</span>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span>{totalRows}개 표시 중</span>
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px]"
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "불러오는 중..." : "더 보기"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}