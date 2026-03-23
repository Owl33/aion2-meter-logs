/**
 * components/rankings/PersonalDpsTable.tsx
 * 개인 Best DPS 기준 랭킹 테이블 (기존 RankTable 고도화)
 */

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fmtDps, fmtTimeMmSs, fmtNumber } from "@/lib/formatters";
import JobBadge from "@/components/shared/JobBadge";
import DpsBar from "@/components/shared/DpsBar";
import SortableTableHead from "@/components/shared/SortableTableHead";
import FilterChip from "@/components/shared/FilterChip";

interface PersonalEntry {
  rank: number;
  characterName: string;
  jobName: string;
  dps: number;
  clearTime: number;
  reportId: string;
  date: string;
  critRate: number;
  damagePercent: number;
  combatPower: number;
}

interface PersonalDpsTableProps {
  entries: PersonalEntry[];
}

type SortKey = "dps" | "clearTime" | "critRate" | "combatPower";

const RANK_BADGE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  2: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function PersonalDpsTable({ entries }: PersonalDpsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("dps");
  const [filterJob, setFilterJob] = useState("전체");

  const allJobs = useMemo(() => {
    const jobs = new Set(entries.map((e) => e.jobName));
    return ["전체", ...Array.from(jobs)];
  }, [entries]);

  const sorted = useMemo(() => {
    let list = filterJob === "전체" ? [...entries] : entries.filter((e) => e.jobName === filterJob);
    list.sort((a, b) => {
      if (sortKey === "clearTime") return a.clearTime - b.clearTime;
      if (sortKey === "dps") return b.dps - a.dps;
      if (sortKey === "critRate") return b.critRate - a.critRate;
      if (sortKey === "combatPower") return b.combatPower - a.combatPower;
      return 0;
    });
    return list.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [entries, sortKey, filterJob]);

  const maxDps = sorted.length ? Math.max(...sorted.map((e) => e.dps)) : 1;

  if (!entries.length) {
    return (
      <Card className="border-border/50 shadow-none">
        <div className="py-16 text-center text-sm text-muted-foreground">
          기록이 없습니다.
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 직업 필터 */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground mr-1">직업</span>
        {allJobs.map((job) => (
          <FilterChip
            key={job}
            label={job}
            active={filterJob === job}
            onClick={() => setFilterJob(job)}
          />
        ))}
      </div>

      <Card className="border-border/50 shadow-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-12 text-center text-[10px] uppercase tracking-wider">#</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">캐릭터</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">직업</TableHead>
              <SortableTableHead label="Best DPS" sortKey="dps" activeKey={sortKey} onSort={(k) => setSortKey(k as SortKey)} />
              <SortableTableHead label="클리어" sortKey="clearTime" activeKey={sortKey} onSort={(k) => setSortKey(k as SortKey)} />
              <SortableTableHead label="치명타" sortKey="critRate" activeKey={sortKey} onSort={(k) => setSortKey(k as SortKey)} />
              <SortableTableHead label="전투력" sortKey="combatPower" activeKey={sortKey} onSort={(k) => setSortKey(k as SortKey)} />
              <TableHead className="w-40 text-[10px] uppercase tracking-wider">비율</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-wider">리포트</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-wider">날짜</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((entry, idx) => (
              <TableRow key={`${entry.characterName}-${idx}`} className="hover:bg-muted/30">
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold",
                      RANK_BADGE[entry.rank] ?? "text-muted-foreground text-xs font-medium"
                    )}
                  >
                    {entry.rank}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-sm">{entry.characterName}</TableCell>
                <TableCell><JobBadge job={entry.jobName} /></TableCell>
                <TableCell className={cn("text-right tabular-nums", sortKey === "dps" && "text-[#7C6FE0] font-bold")}>
                  <span className="text-sm font-bold">{fmtDps(entry.dps)}</span>
                </TableCell>
                <TableCell className={cn("text-right", sortKey === "clearTime" && "text-[#7C6FE0] font-semibold")}>
                  {fmtTimeMmSs(entry.clearTime)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn("tabular-nums", entry.critRate >= 80 && "text-amber-500 font-semibold", sortKey === "critRate" && "text-[#7C6FE0] font-semibold")}>
                    {entry.critRate.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", sortKey === "combatPower" && "text-[#7C6FE0] font-semibold")}>
                  {fmtNumber(entry.combatPower)}
                </TableCell>
                <TableCell>
                  <DpsBar
                    percent={(entry.dps / maxDps) * 100}
                    label={`${entry.damagePercent.toFixed(1)}%`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <a href={`/reports/${entry.reportId}`} className="font-mono text-[11px] text-[#7C6FE0] hover:underline">
                    #{entry.reportId.slice(0, 6)}
                  </a>
                </TableCell>
                <TableCell className="text-right text-[11px] text-muted-foreground whitespace-nowrap">
                  {entry.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
