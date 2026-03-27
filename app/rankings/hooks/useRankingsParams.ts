"use client";

// app/rankings/hooks/useRankingsParams.ts

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface RankingsParams {
  dungeonId: string;
  boss: string;
}

interface UseRankingsParamsReturn {
  params: RankingsParams;
  setDungeon: (id: string) => void;
  setBoss: (boss: string) => void;
}

export function useRankingsParams(defaultDungeonId: string): UseRankingsParamsReturn {
  const searchParams = useSearchParams();

  const dungeonId = searchParams.get("dungeon") ?? defaultDungeonId;
  const boss = searchParams.get("boss") ?? "all";

  const setDungeon = useCallback((id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("dungeon", id);
    url.searchParams.delete("boss");
    window.history.pushState({}, "", url.toString());
  }, []);

  const setBoss = useCallback((value: string) => {
    const url = new URL(window.location.href);
    if (value === "all") {
      url.searchParams.delete("boss");
    } else {
      url.searchParams.set("boss", value);
    }
    window.history.pushState({}, "", url.toString());
  }, []);

  return {
    params: { dungeonId, boss },
    setDungeon,
    setBoss,
  };
}
