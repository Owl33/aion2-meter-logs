/**
 * components/shared/AppTabs.tsx
 * 사이트 전체에서 공유하는 하단 보더 스타일 탭
 * RankingsPage, ReportPage 동일한 TabsTrigger className을 추상화
 */

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ─── AppTabsTrigger ──────────────────────────────────────────
interface AppTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AppTabsTrigger({ value, children, className }: AppTabsTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium",
        "bg-transparent shadow-none",
        "data-[state=active]:border-[#7C6FE0] data-[state=active]:text-[#7C6FE0]",
        "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
        className
      )}
    >
      {children}
    </TabsTrigger>
  );
}

// ─── AppTabsList ─────────────────────────────────────────────
interface AppTabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function AppTabsList({ children, className }: AppTabsListProps) {
  return (
    <TabsList
      className={cn(
        "bg-transparent p-0 h-auto border-b border-border/50",
        "w-full justify-start rounded-none gap-0",
        className
      )}
    >
      {children}
    </TabsList>
  );
}

// ─── AppTabs (re-export for convenience) ────────────────────
export { Tabs as AppTabs, TabsContent as AppTabsContent };
