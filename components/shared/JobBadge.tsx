/**
 * components/shared/JobBadge.tsx
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const JOB_STYLES: Record<string, { color: string; bg: string }> = {
  검사:  { color: "#E84D4D", bg: "rgba(232,77,77,0.12)" },
  정령사: { color: "#5B9BD5", bg: "rgba(91,155,213,0.12)" },
  사수:  { color: "#34C89A", bg: "rgba(52,200,154,0.12)" },
  성직자: { color: "#F5A623", bg: "rgba(245,166,35,0.12)" },
  마법사: { color: "#A855F7", bg: "rgba(168,85,247,0.12)" },
  격투가: { color: "#F97316", bg: "rgba(249,115,22,0.12)" },
};

interface JobBadgeProps {
  job: string;
  className?: string;
}

export default function JobBadge({ job, className }: JobBadgeProps) {
  const style = JOB_STYLES[job];

  return (
    <Badge
      variant="outline"
      className={cn("border-0 text-xs font-semibold px-2 py-0.5 rounded-full", className)}
      style={
        style
          ? { color: style.color, background: style.bg }
          : { color: "#888", background: "rgba(128,128,128,0.1)" }
      }
    >
      {job}
    </Badge>
  );
}
