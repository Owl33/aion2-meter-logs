/**
 * components/news/NewsPage.tsx
 */

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notice {
  id: string
  type: "update" | "notice"
  title: string
  summary: string
  date: string
  isNew: boolean
  body: string
}

export interface NewsData {
  notices: Notice[]
}

const TYPE_STYLES = {
  update: "border-primary/30 text-primary bg-primary/8",
  notice:
    "border-amber-400/30 text-amber-600 bg-amber-50 dark:bg-amber-900/15 dark:text-amber-400",
}

const TYPE_LABELS = {
  update: "업데이트",
  notice: "공지",
}

export default function NewsClient({ data }: { data: NewsData }) {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-5 py-10">
      <div>
        <h1 className="text-xl font-bold tracking-tight">공지 및 업데이트</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AionLogs 서비스 업데이트와 주요 공지사항을 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {data.notices.map((notice) => (
          <Card
            key={notice.id}
            className="border-border/50 shadow-none transition-colors hover:border-border/80"
          >
            <div className="flex flex-col gap-3 p-5">
              {/* 헤더 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "border px-2 py-0.5 text-[11px]",
                      TYPE_STYLES[notice.type]
                    )}
                  >
                    {TYPE_LABELS[notice.type]}
                  </Badge>
                  {notice.isNew && (
                    <Badge
                      variant="outline"
                      className="border border-emerald-400/30 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600 dark:bg-emerald-900/15 dark:text-emerald-400"
                    >
                      NEW
                    </Badge>
                  )}
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {notice.date}
                </span>
              </div>

              {/* 제목 */}
              <h2 className="text-base leading-snug font-semibold">
                {notice.title}
              </h2>

              {/* 본문 */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {notice.body}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
