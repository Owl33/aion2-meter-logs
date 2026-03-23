"use client";

/**
 * components/home/HomePage.tsx
 */

import { useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import DungeonRankingCard from "@/components/home/DungeonRankingCard";
import CharacterSearchModal from "@/components/search/CharacterSearchModal";

interface RankEntry {
  rank: number;
  characterName: string;
  jobName: string;
  dps: number;
  reportId: string;
}

interface HomeData {
  stats: {
    totalReports: number;
    totalReportsToday: number;
    totalCharacters: number;
    totalDungeons: number;
    totalBosses: number;
    topDps: number;
    topDpsDungeon: string;
  };
  dungeonRankings: {
    id: string;
    name: string;
    bosses: {
      index: number;
      name: string;
      top10: RankEntry[];
    }[];
  }[];
}

export default function HomePage({ data }: { data: HomeData }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="max-w-[1100px] mx-auto px-5 pb-16 flex flex-col gap-10">
        <HeroSection onSearchOpen={() => setSearchOpen(true)} />

        <StatsBar stats={data.stats} />

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            던전별 네임드 랭킹
          </h2>
          <div className="flex flex-col gap-4">
            {data.dungeonRankings.map((dungeon) => (
              <DungeonRankingCard
                key={dungeon.id}
                dungeonId={dungeon.id}
                dungeonName={dungeon.name}
                bosses={dungeon.bosses}
              />
            ))}
          </div>
        </section>
      </div>

      <CharacterSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
