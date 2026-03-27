"use client"

// app/rankings/components/content/PersonalDpsTable.tsx
import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { fmtDps, fmtTimeMmSs, fmtNumber } from "@/lib/formatters"
import JobBadge from "@/components/shared/JobBadge"
import DpsBar from "@/components/shared/DpsBar"
import RankBadge from "@/components/shared/RankBadge"
import {
  DataTable,
  DataTableColumnHeader,
  DataTableToolbar,
} from "@/components/table"
import type { PersonalEntry } from "../../types"

interface PersonalDpsTableProps {
  entries: PersonalEntry[]
}

export default function PersonalDpsTable({ entries }: PersonalDpsTableProps) {
  const maxDps = useMemo(
    () => (entries.length ? Math.max(...entries.map((e) => e.dps)) : 1),
    [entries]
  )

  const allJobs = useMemo(() => {
    const jobs = new Set(entries.map((e) => e.jobName))
    return ["전체", ...Array.from(jobs)]
  }, [entries])

  const columns: ColumnDef<PersonalEntry>[] = useMemo(
    () => [
      {
        id: "rank",
        size: 48,
        // 정렬/필터 후 row.index 기준으로 rank 표시
        cell: ({ row }) => (
          <div className="text-center">
            <RankBadge rank={row.index + 1} />
          </div>
        ),
        header: () => (
          <span className="block text-center text-[10px] tracking-wider uppercase">
            #
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "characterName",
        header: () => (
          <span className="text-[10px] tracking-wider uppercase">캐릭터</span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold">{getValue<string>()}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "jobName",
        header: () => (
          <span className="text-[10px] tracking-wider uppercase">직업</span>
        ),
        cell: ({ getValue }) => <JobBadge job={getValue<string>()} />,
        filterFn: (row, _, filterValue) =>
          filterValue === "전체" || row.original.jobName === filterValue,
        enableSorting: false,
      },
      {
        accessorKey: "dps",
        sortDescFirst: true,
        header: ({ column }) => (
          <div className="text-right">
            <DataTableColumnHeader column={column} title="Best DPS" />
          </div>
        ),
        cell: ({ getValue, column }) => (
          <span
            className={cn(
              "block text-right text-sm font-bold tabular-nums",
              column.getIsSorted() && "text-primary"
            )}
          >
            {fmtDps(getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: "clearTime",
        sortDescFirst: false, // 클리어는 오름차순이 좋은 값
        header: ({ column }) => (
          <div className="text-right">
            <DataTableColumnHeader column={column} title="클리어" />
          </div>
        ),
        cell: ({ getValue, column }) => (
          <span
            className={cn(
              "block text-right tabular-nums",
              column.getIsSorted() && "font-semibold text-primary"
            )}
          >
            {fmtTimeMmSs(getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: "critRate",
        sortDescFirst: true,
        header: ({ column }) => (
          <div className="text-right">
            <DataTableColumnHeader column={column} title="치명타" />
          </div>
        ),
        cell: ({ getValue, column }) => {
          const v = getValue<number>()
          return (
            <span
              className={cn(
                "block text-right tabular-nums",
                v >= 80 && "font-semibold text-amber-500",
                column.getIsSorted() && "text-primary"
              )}
            >
              {v.toFixed(1)}%
            </span>
          )
        },
      },
      {
        accessorKey: "combatPower",
        sortDescFirst: true,
        header: ({ column }) => (
          <div className="text-right">
            <DataTableColumnHeader column={column} title="전투력" />
          </div>
        ),
        cell: ({ getValue, column }) => (
          <span
            className={cn(
              "block text-right tabular-nums",
              column.getIsSorted() && "font-semibold text-primary"
            )}
          >
            {fmtNumber(getValue<number>())}
          </span>
        ),
      },
      {
        id: "dpsBar",
        size: 160,
        header: () => (
          <span className="text-[10px] tracking-wider uppercase">비율</span>
        ),
        cell: ({ row }) => (
          <DpsBar
            percent={(row.original.dps / maxDps) * 100}
            label={`${row.original.damagePercent.toFixed(1)}%`}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "reportId",
        header: () => (
          <span className="block text-right text-[10px] tracking-wider uppercase">
            리포트
          </span>
        ),
        cell: ({ getValue }) => (
          <div className="text-right">
            <a
              href={`/reports/${getValue<string>()}`}
              className="font-mono text-[11px] text-primary hover:underline"
            >
              #{getValue<string>().slice(0, 6)}
            </a>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "date",
        header: () => (
          <span className="block text-right text-[10px] tracking-wider uppercase">
            날짜
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="block text-right text-[11px] whitespace-nowrap text-muted-foreground">
            {getValue<string>()}
          </span>
        ),
        enableSorting: false,
      },
    ],
    [maxDps]
  )

  return (
    <DataTable
      columns={columns}
      data={entries}
      emptyMessage="기록이 없습니다."
      // toolbar prop 대신 JobFilterToolbar를 DataTable 내부에서 직접 사용
      toolbar={(table) => (
        <DataTableToolbar table={table} columnId="jobName" jobs={allJobs} />
      )}
    />
  )
}
