/**
 * components/news/NewsPage.tsx
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notice {
  id: string;
  type: "update" | "notice";
  title: string;
  summary: string;
  date: string;
  isNew: boolean;
  body: string;
}

interface NewsData {
  notices: Notice[];
}

const TYPE_STYLES = {
  update: "border-[#7C6FE0]/30 text-[#7C6FE0] bg-[#7C6FE0]/8",
  notice: "border-amber-400/30 text-amber-600 bg-amber-50 dark:bg-amber-900/15 dark:text-amber-400",
};

const TYPE_LABELS = {
  update: "업데이트",
  notice: "공지",
};

export default function NewsPage({ data }: { data: NewsData }) {
  return (
    <div className="max-w-[720px] mx-auto px-5 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">공지 및 업데이트</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AionLogs 서비스 업데이트와 주요 공지사항을 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {data.notices.map((notice) => (
          <Card
            key={notice.id}
            className="border-border/50 shadow-none hover:border-border/80 transition-colors"
          >
            <div className="p-5 flex flex-col gap-3">
              {/* 헤더 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("text-[11px] px-2 py-0.5 border", TYPE_STYLES[notice.type])}
                  >
                    {TYPE_LABELS[notice.type]}
                  </Badge>
                  {notice.isNew && (
                    <Badge
                      variant="outline"
                      className="text-[11px] px-2 py-0.5 border border-emerald-400/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/15 dark:text-emerald-400"
                    >
                      NEW
                    </Badge>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{notice.date}</span>
              </div>

              {/* 제목 */}
              <h2 className="text-base font-semibold leading-snug">{notice.title}</h2>

              {/* 본문 */}
              <p className="text-sm text-muted-foreground leading-relaxed">{notice.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
