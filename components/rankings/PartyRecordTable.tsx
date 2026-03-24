/**
 * components/rankings/PartyRecordTable.tsx
 * 클리어 타임 기준 파티 기록 테이블
 * - 파티 평균 DPS 표기
 * - 파티 구성(직업 조합)을 별도로 표시
 * - 캐릭터 이름 옆에 직업 뱃지 없음
 */

import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { fmtDps, fmtTimeMmSs } from "@/lib/formatters";
import JobBadge from "@/components/shared/JobBadge";

interface PartyMember {
  name: string;
  jobName: string;
  dps: number;
}

interface PartyRecord {
  rank: number;
  clearTime: number;
  reportId: string;
  date: string;
  members: PartyMember[];
}

interface PartyRecordTableProps {
  records: PartyRecord[];
}

const RANK_BADGE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  2: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

function avgDps(members: PartyMember[]) {
  if (!members.length) return 0;
  return Math.round(members.reduce((s, m) => s + m.dps, 0) / members.length);
}

export default function PartyRecordTable({ records }: PartyRecordTableProps) {
  if (!records.length) {
    return (
      <Card className="border-border/50 shadow-none">
        <div className="py-16 text-center text-sm text-muted-foreground">
          파티 기록이 없습니다.
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-none overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-12 text-center text-[10px] uppercase tracking-wider">#</TableHead>
            <TableHead className="w-20 text-[10px] uppercase tracking-wider">클리어</TableHead>
            <TableHead className="w-28 text-[10px] uppercase tracking-wider">평균 DPS</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider">파티 구성</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider">멤버</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">리포트</TableHead>
            <TableHead className="text-right text-[10px] uppercase tracking-wider">날짜</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.reportId} className="hover:bg-muted/30 align-middle">
              {/* 순위 */}
              <TableCell className="text-center">
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold",
                    RANK_BADGE[record.rank] ?? "text-muted-foreground text-xs font-medium"
                  )}
                >
                  {record.rank}
                </span>
              </TableCell>

              {/* 클리어 타임 */}
              <TableCell>
                <span className="text-sm font-bold tabular-nums">
                  {fmtTimeMmSs(record.clearTime)}
                </span>
              </TableCell>

              {/* 파티 평균 DPS */}
              <TableCell>
                <span className="text-sm font-semibold tabular-nums text-[#7C6FE0]">
                  {fmtDps(avgDps(record.members))}
                </span>
              </TableCell>

              {/* 파티 구성 (직업 뱃지만) */}
              <TableCell>
                <div className="flex items-center gap-1 flex-wrap">
                  {record.members.map((m, i) => (
                    <JobBadge key={i} job={m.jobName} />
                  ))}
                </div>
              </TableCell>

              {/* 멤버 이름 + 개인 DPS */}
              <TableCell>
                <div className="flex  gap-1">
                  {record.members.map((member, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium">{member.name}</span>
                      {/* <span className="tabular-nums text-muted-foreground">
                        {fmtDps(member.dps)}
                      </span> */}
                    </div>
                  ))}
                </div>
              </TableCell>

              {/* 리포트 링크 */}
              <TableCell className="text-right">
                <a
                  href={`/reports/${record.reportId}`}
                  className="font-mono text-[11px] text-[#7C6FE0] hover:underline"
                >
                  #{record.reportId.slice(0, 6)}
                </a>
              </TableCell>

              {/* 날짜 */}
              <TableCell className="text-right text-[11px] text-muted-foreground whitespace-nowrap">
                {record.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
