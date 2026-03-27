// app/reports/[id]/types.ts

export interface Skill {
  name: string;
  icon: string;
  dps: number;
  percent: number;
  hitCount: number;
  critCount: number;
  avgDamage: number;
  maxDamage: number;
  totalDamage: number;
  backCount: number;
  hardHitCount: number;
  perfectCount: number;
}

export interface Player {
  entityId: number;
  name: string;
  jobCode: number;
  jobName: string;
  serverId: number;
  isUploader: boolean;
  totalDamage: number;
  dps: number;
  partyDps: number;
  wallDps: number;
  damagePercent: number;
  critRate: number;
  healTotal: number;
  combatScore: number;
  combatPower: number;
  topSkills: Skill[];
}

export interface TimelineEntry {
  t: number;
  players: { entityId: number; dps: number; damage: number }[];
}

export interface ReportData {
  id: string;
  timestamp: string;
  elapsedSeconds: number;
  dungeon: string;
  bossIndex: number;
  targetName: string;
  targetMaxHp: number;
  totalPartyDamage: number;
  players: Player[];
  timeline: TimelineEntry[];
}
