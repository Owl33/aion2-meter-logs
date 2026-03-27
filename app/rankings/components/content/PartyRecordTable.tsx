// app/rankings/components/content/PartyRecordTable.tsx
"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { fmtDps, fmtTimeMmSs } from "@/lib/formatters"
import JobBadge from "@/components/shared/JobBadge"
import RankBadge from "@/components/shared/RankBadge"
import { DataTable } from "@/components/table"
import type { PartyRecord, PartyMember } from "../../types"
import { useRouter } from "next/navigation"

function avgDps(members: PartyMember[]): number {
  if (!members.length) return 0
  return Math.round(members.reduce((s, m) => s + m.dps, 0) / members.length)
}

interface PartyRecordTableProps {
  records: PartyRecord[]
}

export default function PartyRecordTable({ records }: PartyRecordTableProps) {
  const router = useRouter()
  const columns: ColumnDef<PartyRecord>[] = useMemo(
    () => [
      {
        id: "rank",
        size: 48,
        header: () => <span className="">#</span>,
        cell: ({ row }) => (
          <div className="">
            <RankBadge rank={row.original.rank ?? row.index + 1} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "clearTime",
        meta: {
          sortable: true,
        },
        header: () => <span className="">클리어</span>,
        cell: ({ getValue }) => (
          <span className="font-bold">{fmtTimeMmSs(getValue<number>())}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "avgDps",
        meta: {
          sortable: true,
        },
        header: () => <span className="">평균 DPS</span>,
        cell: ({ row }) => (
          <span className="font-semibold text-primary">
            {fmtDps(avgDps(row.original.members))}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "composition",
        header: () => <span className="">파티 구성</span>,
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-1">
            {row.original.members.map((m, i) => (
              <JobBadge key={i} job={m.jobName} />
            ))}
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "members",
        header: () => <span>멤버</span>,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.members.map((member, i) => (
              <span key={i} className="font-medium">
                {member.name}
              </span>
            ))}
          </div>
        ),
        enableSorting: false,
      },

      {
        accessorKey: "date",
        header: () => <span className="">날짜</span>,
        cell: ({ getValue }) => <span className="">{getValue<string>()}</span>,
        enableSorting: false,
      },
    ],
    []
  )

  const onClickRow = (row: PartyRecord) => {
    console.log(row)
    router.push(`reports/${row.reportId}`)
  }
  return (
    <DataTable
      columns={columns}
      data={records}
      emptyMessage="파티 기록이 없습니다."
      onClickRow={(row) => onClickRow(row)}
    />
  )
}
