/**
 * components/download/DownloadPage.tsx
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DownloadData {
  latest: {
    version: string;
    releaseDate: string;
    downloadCount: number;
    sizeMb: number;
    exeUrl: string;
    zipUrl: string;
  };
  requirements: { label: string; value: string }[];
  changelog: {
    version: string;
    date: string;
    isLatest: boolean;
    changes: string[];
  }[];
}

// DownloadButton — 아이콘 + 레이블
function DownloadButton({ href, label, variant = "primary" }: {
  href: string; label: string; variant?: "primary" | "outline";
}) {
  return (
    <a href={href} download>
      <Button
        className={cn(
          "h-9 gap-2 text-sm",
          variant === "primary"
            ? "bg-[#7C6FE0] hover:bg-[#6B5FD0] text-white"
            : "border-border/60"
        )}
        variant={variant === "outline" ? "outline" : "default"}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M8 2v8M5 7l3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {label}
      </Button>
    </a>
  );
}

export default function DownloadPage({ data }: { data: DownloadData }) {
  const { latest, requirements, changelog } = data;

  return (
    <div className="max-w-[640px] mx-auto px-5 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">DPS 미터기 다운로드</h1>
        <p className="text-sm text-muted-foreground mt-1">
          아이온2 전용 DPS 미터기를 다운로드하고 AionLogs와 연동하세요.
        </p>
      </div>

      {/* 메인 다운로드 카드 */}
      <Card className="border-border/50 shadow-none">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">AionLogs DPS Meter</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                실시간 딜량 측정 및 로그 자동 저장. AionLogs 업로드 기능 내장.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 border-[#7C6FE0]/30 text-[#7C6FE0] bg-[#7C6FE0]/8 text-xs">
              v{latest.version} 최신
            </Badge>
          </div>

          <div className="flex gap-1.5">
            <Badge variant="secondary" className="text-xs">Windows 10+</Badge>
            <Badge variant="secondary" className="text-xs">64-bit</Badge>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span>출시: {latest.releaseDate}</span>
            <span>크기: {latest.sizeMb} MB</span>
            <span>다운로드: {latest.downloadCount.toLocaleString()}회</span>
          </div>

          <div className="flex gap-2">
            <DownloadButton href={latest.exeUrl} label=".exe 다운로드" variant="primary" />
            <DownloadButton href={latest.zipUrl} label=".zip 다운로드" variant="outline" />
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">시스템 요구사항</p>
            <div className="flex flex-col gap-1.5">
              {requirements.map((r) => (
                <div key={r.label} className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 업데이트 기록 */}
      <Card className="border-border/50 shadow-none">
        <div className="px-5 py-3 border-b border-border/50">
          <h3 className="text-sm font-semibold">업데이트 기록</h3>
        </div>
        <div className="divide-y divide-border/40">
          {changelog.map((entry) => (
            <div key={entry.version} className="px-5 py-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">v{entry.version}</span>
                {entry.isLatest && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-400/40 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400">
                    최신
                  </Badge>
                )}
                <span className="text-[11px] text-muted-foreground ml-auto">{entry.date}</span>
              </div>
              <ul className="flex flex-col gap-1">
                {entry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
