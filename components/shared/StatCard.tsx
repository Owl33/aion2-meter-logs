/**
 * components/shared/StatCard.tsx
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  className?: string;
}

export default function StatCard({ label, value, sub, className }: StatCardProps) {
  return (
    <Card className={cn("border-border/50 shadow-none", className)}>
      <CardContent className="p-3 flex flex-col gap-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-[19px] font-bold tracking-tight tabular-nums leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
