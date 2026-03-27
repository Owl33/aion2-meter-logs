// app/rankings/components/content/PartyRecordTable.tsx
"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { fmtDps, fmtTimeMmSs } from "@/lib/formatters"
import JobBadge from "@/components/shared/JobBadge"
import RankBadge from "@/components/shared/RankBadge"
import { DataTable } from "@/components/table"
import type { PartyRecord, PartyMember } from "../../types"

function avgDps(members: PartyMember[]): number {
  if (!members.length) return 0
  return Math.round(members.reduce((s, m) => s + m.dps, 0) / members.length)
}

interface PartyRecordTableProps {
  records: PartyRecord[]
}

export default function PartyRecordTable({ records }: PartyRecordTableProps) {
  const columns: ColumnDef<PartyRecord>[] = useMemo(
    () => [
      {
        id: "rank",
        size: 48,
        header: () => (
          <span className="block text-center text-[10px] uppercase tracking-wider">
            #
          </span>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <RankBadge rank={row.original.rank ?? row.index + 1} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "clearTime",
        size: 80,
        header: () => (
          <span className="text-[10px] uppercase tracking-wider">클리어</span>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm font-bold tabular-nums">
            {fmtTimeMmSs(getValue<number>())}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "avgDps",
        size: 112,
        header: () => (
          <span className="text-[10px] uppercase tracking-wider">평균 DPS</span>
        ),
        cell: ({ row }) => (
          <span className="text-sm font-semibold tabular-nums text-primary">
            {fmtDps(avgDps(row.original.members))}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "composition",
        header: () => (
          <span className="text-[10px] uppercase tracking-wider">파티 구성</span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1 flex-wrap">
            {row.original.members.map((m, i) => (
              <JobBadge key={i} job={m.jobName} />
            ))}
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "members",
        header: () => (
          <span className="text-[10px] uppercase tracking-wider">멤버</span>
        ),
        cell: ({ row }) => (
          <div className="flex gap-2 flex-wrap">
            {row.original.members.map((member, i) => (
              <span key={i} className="text-xs font-medium">
                {member.name}
              </span>
            ))}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "reportId",
        header: () => (
          <span className="block text-right text-[10px] uppercase tracking-wider">
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
          <span className="block text-right text-[10px] uppercase tracking-wider">
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
    []
  )

  return (
    <DataTable
      columns={columns}
      data={records}
      emptyMessage="파티 기록이 없습니다."
    />
  )
}