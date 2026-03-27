"use client";

// app/rankings/hooks/useRankingsData.ts

import { useMemo } from "react";
import type { Dungeon, RankingsData, PartyRecord, PersonalEntry } from "../types";

interface UseRankingsDataReturn {
  partyRecords: PartyRecord[];
  personalEntries: PersonalEntry[];
  balanceStats: RankingsData["balanceStats"][string];
}

export function useRankingsData(
  dungeon: Dungeon,
  data: RankingsData,
  bossFilter: string
): UseRankingsDataReturn {
  const partyRecords = useMemo<PartyRecord[]>(() => {
    if (bossFilter === "all") {
      const all = dungeon.bosses.flatMap(
        (b) => data.partyRecords[dungeon.id]?.[String(b.index)] ?? []
      );
      return [...all]
        .sort((a, b) => a.clearTime - b.clearTime)
        .map((r, i) => ({ ...r, rank: i + 1 }));
    }
    return data.partyRecords[dungeon.id]?.[bossFilter] ?? [];
  }, [dungeon, data, bossFilter]);

  const personalEntries = useMemo<PersonalEntry[]>(() => {
    if (bossFilter === "all") {
      const all = dungeon.bosses.flatMap(
        (b) => data.personalDps[dungeon.id]?.[String(b.index)] ?? []
      );
      // 캐릭터별 최고 DPS 하나만 (중복 제거)
      const best: Record<string, PersonalEntry> = {};
      all.forEach((e) => {
        if (!best[e.characterName] || e.dps > best[e.characterName].dps) {
          best[e.characterName] = e;
        }
      });
      return Object.values(best)
        .sort((a, b) => b.dps - a.dps)
        .map((e, i) => ({ ...e, rank: i + 1 }));
    }
    return data.personalDps[dungeon.id]?.[bossFilter] ?? [];
  }, [dungeon, data, bossFilter]);

  const balanceStats = data.balanceStats[dungeon.id] ?? {};

  return { partyRecords, personalEntries, balanceStats };
}
