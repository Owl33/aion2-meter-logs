"use client"

import { useState, useMemo } from "react"
import AppTabs from "@/components/shared/AppTabs"
import { buildColorMap } from "@/lib/playerColors"

import ReportSummaryCard from "./components/summary/ReportSummaryCard"
import OverviewTab from "./components/overview/OverviewTab"
import SkillsTab from "./components/skills/SkillsTab"
import TimelineTab from "./components/timeline/TimelineTab"

import type { ReportData } from "./types"
import TransitionContent from "@/components/shared/TransitionContent"

type ReportTab = "overview" | "skills" | "timeline"

interface ReportClientProps {
  reportData: ReportData
}

export default function ReportClient({ reportData }: ReportClientProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [tab, setTab] = useState<ReportTab>("overview")

  const colorMap = useMemo(
    () => buildColorMap(reportData.players.map((p) => p.entityId)),
    [reportData.players]
  )

  const togglePlayer = (id: number) => {
    if (id === -1) {
      setSelectedPlayer(null)
      return
    }
    setSelectedPlayer((prev) => (prev === id ? null : id))
  }

  const tabs: { value: ReportTab; label: string }[] = [
    { value: "overview", label: "개요" },
    { value: "skills", label: "스킬 분석" },
    { value: "timeline", label: "타임라인" },
  ]

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-5 px-5 py-6 pb-16">
      <ReportSummaryCard report={reportData} />

      {/* ✅ 새로운 Tabs */}
      <AppTabs tabs={tabs} active={tab} onChange={(value) => setTab(value)} />

      {/* ✅ Content */}
      <TransitionContent key={tab}>
        {tab === "overview" && (
          <OverviewTab
            report={reportData}
            colorMap={colorMap}
            selectedPlayer={selectedPlayer}
            onTogglePlayer={togglePlayer}
          />
        )}

        {tab === "skills" && (
          <SkillsTab
            players={reportData.players}
            colorMap={colorMap}
            selectedPlayer={selectedPlayer}
            onTogglePlayer={togglePlayer}
          />
        )}

        {tab === "timeline" && (
          <TimelineTab
            report={reportData}
            colorMap={colorMap}
            selectedPlayer={selectedPlayer}
            onTogglePlayer={togglePlayer}
          />
        )}
      </TransitionContent>
    </div>
  )
}
