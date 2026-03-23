/**
 * components/shared/SectionCard.tsx
 *
 * 섹션 구분용 Card 래퍼 — 타이틀 + children
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** CardHeader 없이 children만 렌더링 */
  noHeader?: boolean;
}

export default function SectionCard({
  title,
  children,
  className,
  contentClassName,
  noHeader = false,
}: SectionCardProps) {
  return (
    <Card className={cn("border-border/50 shadow-none", className)}>
      {!noHeader && title && (
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("px-4 pb-4", noHeader && "pt-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
