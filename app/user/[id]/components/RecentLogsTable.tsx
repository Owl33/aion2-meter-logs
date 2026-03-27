// app/user/[id]/components/RecentLogsTable.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { fmtDps, fmtTimeMmSs, fmtNumber } from "@/lib/formatters";
import { DataTable } from "@/components/table";
import RankBadge from "@/components/shared/RankBadge";
import JobBadge from "@/components/shared/JobBadge";
import DpsBar from "@/components/shared/DpsBar";
import type { RecentLog } from "../types";

interface RecentLogsTableProps {
  logs: RecentLog[];
}

export default function RecentLogsTable({ logs }: RecentLogsTableProps) {
  const router = useRouter();

  // DPS 바 비율 계산용 최대값
  const maxDps = useMemo(
    () => (logs.length ? Math.max(...logs.map((l) => l.dps)) : 1),
    [logs]
  );

  const columns: ColumnDef<RecentLog>[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: () => <span>날짜</span>,
        cell: ({ getValue }) => (
          <span className="text-xs tabular-nums text-muted-foreground">
            {getValue<string>()}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: "dungeon",
        header: () => <span>던전 / 보스</span>,
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium">{row.original.dungeonName}</span>
            <span className="text-[11px] text-muted-foreground">
              {row.original.bossIndex}네임드 · {row.original.bossName}
            </span>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "dps",
        meta: { sortable: true },
        sortDescFirst: true,
        header: () => <span>DPS</span>,
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-primary tabular-nums">
            {fmtDps(getValue<number>())}
          </span>
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
        accessorKey: "clearTime",
        meta: { sortable: true },
        sortDescFirst: false,
        header: () => <span>클리어</span>,
        cell: ({ getValue }) => (
          <span className="text-xs tabular-nums">
            {fmtTimeMmSs(getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: "critRate",
        meta: { sortable: true },
        sortDescFirst: true,
        header: () => <span>치명타</span>,
        cell: ({ getValue }) => (
          <span className="text-xs tabular-nums">
            {getValue<number>().toFixed(1)}%
          </span>
        ),
      },
      {
        accessorKey: "partyDps",
        header: () => <span>파티 DPS</span>,
        cell: ({ getValue }) => (
          <span className="text-xs tabular-nums text-muted-foreground">
            {fmtDps(getValue<number>())}
          </span>
        ),
        enableSorting: false,
      },
    ],
    [maxDps]
  );

  return (
    <DataTable
      columns={columns}
      data={logs}
      emptyMessage="최근 기록이 없습니다."
      onClickRow={(row) => router.push(`/reports/${row.reportId}`)}
    />
  );
}
