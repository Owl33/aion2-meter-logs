"use client";

// app/rankings/client.tsx

import { useState } from "react";
import DungeonSidebar from "./components/sideBar/DungeonSidebar";
import MainContent from "./components/content/MainContent";
import { useRankingsParams } from "./hooks/useRankingsParams";
import type { RankingsData } from "./types";

interface RankingsPageProps {
  data: RankingsData;
}

export default function RankingsPage({ data }: RankingsPageProps) {
  // 훅은 항상 최상단에서 호출 (버그 수정: early return이 훅보다 먼저 있으면 안 됨)
  const { params, setDungeon, setBoss } = useRankingsParams(data.dungeons[0]?.id ?? "");

  const dungeon =
    data.dungeons.find((d) => d.id === params.dungeonId) ?? data.dungeons[0];

  // data가 없는 경우 훅 호출 이후에 처리
  if (!data || !data.dungeons.length) return null;

  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-background">
      <DungeonSidebar
        dungeons={data.dungeons}
        activeDungeonId={dungeon.id}
        onDungeonChange={setDungeon}
      />

      <main className="flex-1 min-w-0 p-6">
        <MainContent
          dungeon={dungeon}
          data={data}
          initialBoss={params.boss}
          onBossChange={setBoss}
        />
      </main>
    </div>
  );
}
