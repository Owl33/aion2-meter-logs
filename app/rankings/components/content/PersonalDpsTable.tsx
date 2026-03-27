"use client";

// app/rankings/components/content/PersonalDpsTable.tsx
// 변경점: characterName 셀을 Link로 감싸서 /user/[name]으로 이동
//          행 클릭(report 이동)과 이름 클릭(user 이동)을 분리

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { fmtDps, fmtTimeMmSs, fmtNumber } from "@/lib/formatters";
import JobBadge from "@/components/shared/JobBadge";
import DpsBar from "@/components/shared/DpsBar";
import RankBadge from "@/components/shared/RankBadge";
import { DataTable, DataTableToolbar } from "@/components/table";
import type { PersonalEntry } from "../../types";

interface PersonalDpsTableProps {
  entries: PersonalEntry[];
}

export default function PersonalDpsTable({ entries }: PersonalDpsTableProps) {
  const router = useRouter();

  const maxDps = useMemo(
    () => (entries.length ? Math.max(...entries.map((e) => e.dps)) : 1),
    [entries]
  );

  const allJobs = useMemo(() => {
    const jobs = new Set(entries.map((e) => e.jobName));
    return ["전체", ...Array.from(jobs)];
  }, [entries]);

  const columns: ColumnDef<PersonalEntry>[] = useMemo(
    () => [
      {
        id: "rank",
        size: 48,
        cell: ({ row }) => <RankBadge rank={row.index + 1} />,
        header: () => <span>#</span>,
        enableSorting: false,
      },
      {
        accessorKey: "characterName",
        header: () => <span>캐릭터</span>,
        cell: ({ getValue }) => {
          const name = getValue<string>();
          return (
            // stopPropagation: 행 클릭(report 이동) 이벤트와 분리
            <Link
              href={`/user/${encodeURIComponent(name)}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium hover:text-primary hover:underline underline-offset-2 transition-colors"
            >
              {name}
            </Link>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "jobName",
        header: () => <span>직업</span>,
        cell: ({ getValue }) => <JobBadge job={getValue<string>()} />,
        filterFn: (row, _, filterValue) =>
          filterValue === "전체" || row.original.jobName === filterValue,
        enableSorting: false,
      },
      {
        accessorKey: "dps",
        sortDescFirst: true,
        meta: { sortable: true },
        header: () => <span>Best DPS</span>,
        cell: ({ getValue }) => (
          <span className="font-semibold text-primary tabular-nums">
            {fmtDps(getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: "clearTime",
        meta: { sortable: true },
        sortDescFirst: false,
        header: () => <span>클리어</span>,
        cell: ({ getValue }) => (
          <span className="tabular-nums">{fmtTimeMmSs(getValue<number>())}</span>
        ),
      },
      {
        accessorKey: "critRate",
        sortDescFirst: true,
        meta: { sortable: true },
        header: () => <span>치명타</span>,
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<number>().toFixed(1)}%</span>
        ),
      },
      {
        accessorKey: "combatPower",
        sortDescFirst: true,
        meta: { sortable: true },
        header: () => <span>전투력</span>,
        cell: ({ getValue }) => (
          <span className="tabular-nums">{fmtNumber(getValue<number>())}</span>
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
        header: () => <span>날짜</span>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>()}</span>
        ),
        enableSorting: false,
      },
    ],
    [maxDps]
  );

  return (
    <DataTable
      columns={columns}
      data={entries}
      emptyMessage="기록이 없습니다."
      toolbar={(table) => (
        <DataTableToolbar table={table} columnId="jobName" jobs={allJobs} />
      )}
      // 행 클릭 → report 페이지 이동 (이름 클릭은 별도 Link로 분리됨)
      onClickRow={(row) => router.push(`/reports/${row.reportId}`)}
    />
  );
}
