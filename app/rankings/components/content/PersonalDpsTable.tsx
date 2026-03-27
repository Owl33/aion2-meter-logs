"use client"

// app/rankings/components/content/PersonalDpsTable.tsx
import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { fmtDps, fmtTimeMmSs, fmtNumber } from "@/lib/formatters"
import JobBadge from "@/components/shared/JobBadge"
import DpsBar from "@/components/shared/DpsBar"
import RankBadge from "@/components/shared/RankBadge"
import { DataTable, DataTableToolbar } from "@/components/table"
import type { PersonalEntry } from "../../types"
import { useRouter } from "next/navigation"

interface PersonalDpsTableProps {
  entries: PersonalEntry[]
}

export default function PersonalDpsTable({ entries }: PersonalDpsTableProps) {
  const router = useRouter()
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
          <div className="">
            <RankBadge rank={row.index + 1} />
          </div>
        ),
        header: () => <span className="">#</span>,
        enableSorting: false,
      },
      {
        accessorKey: "characterName",
        header: () => <span className="">캐릭터</span>,
        cell: ({ getValue }) => (
          <div className="h-full transition-all duration-250 hover:scale-105 hover:text-primary">
            {getValue<string>()}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "jobName",
        header: () => <span className="">직업</span>,
        cell: ({ getValue }) => <JobBadge job={getValue<string>()} />,
        filterFn: (row, _, filterValue) =>
          filterValue === "전체" || row.original.jobName === filterValue,
        enableSorting: false,
      },
      {
        accessorKey: "dps",
        sortDescFirst: true,
        meta: {
          sortable: true,
        },
        header: ({ column }) => <div className="">Best DPS</div>,
        cell: ({ getValue, column }) => (
          <span>{fmtDps(getValue<number>())}</span>
        ),
      },
      {
        accessorKey: "clearTime",
        meta: {
          sortable: true,
        },
        sortDescFirst: false, // 클리어는 오름차순이 좋은 값
        header: ({ column }) => <div className="">클리어</div>,
        cell: ({ getValue, column }) => (
          <span>{fmtTimeMmSs(getValue<number>())}</span>
        ),
      },
      {
        accessorKey: "critRate",
        sortDescFirst: true,
        meta: {
          sortable: true,
        },
        header: ({ column }) => <div>치명타</div>,
        cell: ({ getValue, column }) => {
          const v = getValue<number>()
          return <span>{v.toFixed(1)}%</span>
        },
      },
      {
        accessorKey: "combatPower",
        sortDescFirst: true,
        meta: {
          sortable: true,
        },
        header: ({ column }) => (
          <div>
            전투력
            {/* <DataTableColumnHeader column={column} title="전투력" /> */}
          </div>
        ),
        cell: ({ getValue, column }) => (
          <span>{fmtNumber(getValue<number>())}</span>
        ),
      },
      {
        id: "dpsBar",
        header: () => <span>비율</span>,
        cell: ({ row }) => (
          <DpsBar
            percent={(row.original.dps / maxDps) * 100}
            label={`${row.original.damagePercent.toFixed(1)}%`}
          />
        ),
        enableSorting: false,
      },

      {
        accessorKey: "date",
        header: () => <span className="">날짜</span>,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        enableSorting: false,
      },
    ],
    [maxDps]
  )
  const onClickRow = (row: PersonalEntry) => {
    console.log(row)
    router.push(`reports/${row.reportId}`)
  }
  return (
    <DataTable
      columns={columns}
      data={entries}
      emptyMessage="기록이 없습니다."
      // toolbar prop 대신 JobFilterToolbar를 DataTable 내부에서 직접 사용
      toolbar={(table) => (
        <DataTableToolbar table={table} columnId="jobName" jobs={allJobs} />
      )}
      onClickRow={(row) => onClickRow(row)}
    />
  )
}
