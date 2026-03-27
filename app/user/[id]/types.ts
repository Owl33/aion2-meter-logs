// app/user/[id]/types.ts

export interface BossStat {
  index: number;
  name: string;
  clears: number;
  bestDps: number;
  globalRank: number | null;
}

export interface DungeonStat {
  dungeonId: string;
  dungeonName: string;
  clears: number;
  bestDps: number;
  avgDps: number;
  bestClearTime: number;
  globalRank: number | null;
  bosses: BossStat[];
}

export interface RecentLog {
  reportId: string;
  date: string;
  dungeonName: string;
  dungeonId: string;
  bossIndex: number;
  bossName: string;
  dps: number;
  clearTime: number;
  critRate: number;
  damagePercent: number;
  partyDps: number;
  combatPower: number;
}

export interface UserProfileData {
  characterName: string;
  jobName: string;
  jobCode: number;
  serverId: number;
  serverName: string;
  combatPower: number;
  totalClears: number;
  bestDps: number;
  avgDps: number;
  avgCritRate: number;
  firstSeen: string;
  lastSeen: string;
  dungeonStats: DungeonStat[];
  recentLogs: RecentLog[];
}

export type UserTab = "dungeons" | "logs";
