"use client";

// app/rankings/components/content/MainContent.tsx

import { useState } from "react";
import BossSegment from "../boss/BossSegment";
import ContentTabBar from "../tabs/ContentTabBar";
import PartyRecordTable from "./PartyRecordTable";
import PersonalDpsTable from "./PersonalDpsTable";
import BalanceChart from "./BalanceChart";
import { useRankingsData } from "../../hooks/useRankingsData";
import type { ContentTab, Dungeon, RankingsData } from "../../types";

interface MainContentProps {
  dungeon: Dungeon;
  data: RankingsData;
  initialBoss?: string;
  onBossChange: (boss: string) => void;
}

export default function MainContent({
  dungeon,
  data,
  initialBoss = "all",
  onBossChange,
}: MainContentProps) {
  const [bossFilter, setBossFilter] = useState(initialBoss);
  const [contentTab, setContentTab] = useState<ContentTab>("party");

  const { partyRecords, personalEntries, balanceStats } = useRankingsData(
    dungeon,
    data,
    bossFilter
  );

  const fixedBossIndex = bossFilter === "all" ? undefined : Number(bossFilter);

  const handleBossChange = (value: string) => {
    setBossFilter(value);
    onBossChange(value);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 페이지 헤더 */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
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
      <ContentTabBar active={contentTab} onChange={setContentTab} />

      {/* 콘텐츠 */}
      {contentTab === "party" && (
        <PartyRecordTable records={partyRecords} />
      )}
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
    </div>
  );
}
