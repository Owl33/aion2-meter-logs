"use client"

// app/rankings/components/content/MainContent.tsx

import { useState } from "react"
import BossSegment from "../boss/BossSegment"
import PartyRecordTable from "./PartyRecordTable"
import PersonalDpsTable from "./PersonalDpsTable"
import BalanceChart from "./BalanceChart"
import { useRankingsData } from "../../hooks/useRankingsData"
import type { ContentTab, Dungeon, RankingsData } from "../../types"
import AppTabs from "@/components/shared/AppTabs"
import TransitionContent from "@/components/shared/TransitionContent"

interface MainContentProps {
  dungeon: Dungeon
  data: RankingsData
  initialBoss?: string
  onBossChange: (boss: string) => void
}

export default function MainContent({
  dungeon,
  data,
  initialBoss = "all",
  onBossChange,
}: MainContentProps) {
  const [bossFilter, setBossFilter] = useState(initialBoss)
  const [contentTab, setContentTab] = useState("party")

  const { partyRecords, personalEntries, balanceStats } = useRankingsData(
    dungeon,
    data,
    bossFilter
  )

  const fixedBossIndex = bossFilter === "all" ? undefined : Number(bossFilter)

  const handleBossChange = (value: string) => {
    setBossFilter(value)
    onBossChange(value)
  }

  const tabs = [
    { value: "party", label: "파티 기록" },
    { value: "personal", label: "개인 DPS" },
    { value: "balance", label: "밸런스 차트" },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* 페이지 헤더 */}
      <div>
        <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>랭킹</span>
          <span className="opacity-40">›</span>
          <span>{dungeon.name}</span>
          {bossFilter !== "all" && (
            <>
              <span className="opacity-40">›</span>
              <span>{bossFilter}네임드</span>
            </>
          )}
        </div>
        <h1 className="text-xl font-bold tracking-tight">{dungeon.name}</h1>
      </div>

      {/* 네임드 세그먼트 */}
      <BossSegment
        bosses={dungeon.bosses}
        active={bossFilter}
        onChange={handleBossChange}
      />

      {/* 콘텐츠 탭 바 */}
      <AppTabs tabs={tabs} active={contentTab} onChange={setContentTab} />
      <TransitionContent key={`${bossFilter}-${contentTab}`}>
        {/* 콘텐츠 */}
        {contentTab === "party" && <PartyRecordTable records={partyRecords} />}
        {contentTab === "personal" && (
          <PersonalDpsTable entries={personalEntries} />
        )}
        {contentTab === "balance" && (
          <BalanceChart
            statsByBoss={balanceStats}
            bosses={dungeon.bosses}
            fixedBossIndex={fixedBossIndex}
          />
        )}
      </TransitionContent>
    </div>
  )
}
