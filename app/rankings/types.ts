// app/rankings/types.ts

export interface Boss {
  index: number;
  name: string;
  maxHp: number;
}

export interface Dungeon {
  id: string;
  name: string;
  shortName: string;
  tier: number;
  bosses: Boss[];
}

export interface PartyMember {
  name: string;
  jobName: string;
  dps: number;
}

export interface PartyRecord {
  rank: number;
  clearTime: number;
  reportId: string;
  date: string;
  members: PartyMember[];
}

export interface PersonalEntry {
  rank: number;
  characterName: string;
  jobName: string;
  dps: number;
  clearTime: number;
  reportId: string;
  date: string;
  critRate: number;
  damagePercent: number;
  combatPower: number;
}

export interface StatEntry {
  jobName: string;
  min: number;
  avg: number;
  max: number;
  q1?: number;
  q3?: number;
  outliers?: number[];
}

export interface BossStats {
  dateRange: { from: string; to: string };
  data: StatEntry[];
}

export interface RankingsData {
  dungeons: Dungeon[];
  partyRecords: Record<string, Record<string, PartyRecord[]>>;
  personalDps: Record<string, Record<string, PersonalEntry[]>>;
  balanceStats: Record<string, Record<string, BossStats>>;
}

export type ContentTab = "party" | "personal" | "balance";
export type Period = "month" | "all";
export type SortKey = "dps" | "clearTime" | "critRate" | "combatPower";
