"use client";

// app/reports/[id]/client.tsx

import { useState, useMemo } from "react";
import { AppTabs, AppTabsList, AppTabsTrigger, AppTabsContent } from "@/components/shared/AppTabs";
import { buildColorMap } from "@/lib/playerColors";
import ReportSummaryCard from "./components/summary/ReportSummaryCard";
import OverviewTab from "./components/overview/OverviewTab";
import SkillsTab from "./components/skills/SkillsTab";
import TimelineTab from "./components/timeline/TimelineTab";
import type { ReportData } from "./types";

interface ReportClientProps {
  reportData: ReportData;
}

export default function ReportClient({ reportData }: ReportClientProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const colorMap = useMemo(
    () => buildColorMap(reportData.players.map((p) => p.entityId)),
    [reportData.players]
  );

  const togglePlayer = (id: number) => {
    // -1은 SkillsTab의 "전체" 버튼 신호
    if (id === -1) {
      setSelectedPlayer(null);
      return;
    }
    setSelectedPlayer((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-6 pb-16 flex flex-col gap-5">
      <ReportSummaryCard report={reportData} />

      <AppTabs defaultValue="overview">
        <AppTabsList>
          <AppTabsTrigger value="overview">개요</AppTabsTrigger>
          <AppTabsTrigger value="skills">스킬 분석</AppTabsTrigger>
          <AppTabsTrigger value="timeline">타임라인</AppTabsTrigger>
        </AppTabsList>

        <AppTabsContent value="overview" className="mt-4">
          <OverviewTab
            report={reportData}
            colorMap={colorMap}
            selectedPlayer={selectedPlayer}
            onTogglePlayer={togglePlayer}
          />
        </AppTabsContent>

        <AppTabsContent value="skills" className="mt-4">
          <SkillsTab
            players={reportData.players}
            colorMap={colorMap}
            selectedPlayer={selectedPlayer}
            onTogglePlayer={togglePlayer}
          />
        </AppTabsContent>

        <AppTabsContent value="timeline" className="mt-4">
          <TimelineTab
            report={reportData}
            colorMap={colorMap}
            selectedPlayer={selectedPlayer}
            onTogglePlayer={togglePlayer}
          />
        </AppTabsContent>
      </AppTabs>
    </div>
  );
}
