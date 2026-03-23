"use client";

/**
 * components/rankings/RankingsPage.tsx
 *
 * 레이아웃:
 *   - 사이드바: 던전 선택만 (네임드 서브 아이템 제거)
 *   - 메인: [전체 / 1넴 / 2넴 / 3넴] 세그먼트 → [파티 기록 / 개인 DPS / 밸런스 차트] 탭
 */

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import PartyRecordTable from "@/components/rankings/PartyRecordTable";
import PersonalDpsTable from "@/components/rankings/PersonalDpsTable";
import BalanceChart from "@/components/rankings/BalanceChart";

// ─── 타입 ────────────────────────────────────────────────────
interface Boss { index: number; name: string; maxHp: number; }
interface Dungeon { id: string; name: string; shortName: string; tier: number; bosses: Boss[]; }

interface PartyMember { name: string; jobName: string; dps: number; }
interface PartyRecord {
  rank: number; clearTime: number; reportId: string; date: string;
  members: PartyMember[];
}
interface PersonalEntry {
  rank: number; characterName: string; jobName: string; dps: number;
  clearTime: number; reportId: string; date: string;
  critRate: number; damagePercent: number; combatPower: number;
}
interface StatEntry { jobName: string; min: number; avg: number; max: number; }
interface BossStats { dateRange: { from: string; to: string }; data: StatEntry[]; }

interface RankingsData {
  dungeons: Dungeon[];
  partyRecords: Record<string, Record<string, PartyRecord[]>>;
  personalDps:  Record<string, Record<string, PersonalEntry[]>>;
  balanceStats: Record<string, Record<string, BossStats>>;
}

type ContentTab = "party" | "personal" | "balance";

// ─── 네임드 세그먼트 셀렉터 ──────────────────────────────────
function BossSegment({
  bosses,
  active,
  onChange,
}: {
  bosses: Boss[];
  active: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "all", label: "전체", sub: "종합" },
    ...bosses.map((b) => ({ value: String(b.index), label: `${b.index}네임드`, sub: b.name })),
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all text-left min-w-[90px]",
            active === opt.value
              ? "border-[#7C6FE0]/50 bg-[#7C6FE0]/8 shadow-sm"
              : "border-border/50 hover:border-border/80 hover:bg-muted/30"
          )}
        >
          <span
            className={cn(
              "text-xs font-bold tracking-tight",
              active === opt.value ? "text-[#7C6FE0]" : "text-muted-foreground"
            )}
          >
            {opt.label}
          </span>
          <span className="text-[11px] text-muted-foreground truncate max-w-[120px] mt-0.5">
            {opt.sub}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── 콘텐츠 탭 헤더 ──────────────────────────────────────────
function ContentTabBar({
  active,
  onChange,
}: {
  active: ContentTab;
  onChange: (v: ContentTab) => void;
}) {
  const tabs: { value: ContentTab; label: string }[] = [
    { value: "party",   label: "파티 기록" },
    { value: "personal", label: "개인 DPS" },
    { value: "balance", label: "밸런스 차트" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            active === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── 메인 콘텐츠 영역 ────────────────────────────────────────
function MainContent({
  dungeon,
  data,
}: {
  dungeon: Dungeon;
  data: RankingsData;
}) {
  const [bossFilter, setBossFilter] = useState("all");
  const [contentTab, setContentTab] = useState<ContentTab>("party");

  const partyRecords = useMemo(() => {
    if (bossFilter === "all") {
      // 전체: 모든 네임드 파티 기록 합산 후 클리어타임 기준 정렬
      const all = dungeon.bosses.flatMap((b) =>
        data.partyRecords[dungeon.id]?.[String(b.index)] ?? []
      );
      return [...all].sort((a, b) => a.clearTime - b.clearTime)
        .map((r, i) => ({ ...r, rank: i + 1 }));
    }
    return data.partyRecords[dungeon.id]?.[bossFilter] ?? [];
  }, [dungeon, data, bossFilter]);

  const personalEntries = useMemo(() => {
    if (bossFilter === "all") {
      // 전체: 캐릭터별 최고 DPS 하나만 (중복 제거)
      const all = dungeon.bosses.flatMap((b) =>
        data.personalDps[dungeon.id]?.[String(b.index)] ?? []
      );
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
  const fixedBossIndex = bossFilter === "all" ? undefined : Number(bossFilter);

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
        onChange={(v) => {
          setBossFilter(v);
          // URL 동기화
          const url = new URL(window.location.href);
          url.searchParams.set("dungeon", dungeon.id);
          if (v === "all") url.searchParams.delete("boss");
          else url.searchParams.set("boss", v);
          window.history.pushState({}, "", url.toString());
        }}
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

// ─── 메인 페이지 컴포넌트 ────────────────────────────────────
export default function RankingsPage({ data }: { data: RankingsData }) {
  const searchParams = useSearchParams();
  const dungeonParam = searchParams.get("dungeon");

  const [activeDungeonId, setActiveDungeonId] = useState(
    dungeonParam ?? data.dungeons[0].id
  );

  const dungeon = data.dungeons.find((d) => d.id === activeDungeonId) ?? data.dungeons[0];

  const handleDungeonChange = (id: string) => {
    setActiveDungeonId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("dungeon", id);
    url.searchParams.delete("boss");
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-background">
      {/* 사이드바 — 던전 선택만 */}
      <aside className="w-48 shrink-0 border-r border-border/50 bg-background flex flex-col py-4 gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3.5 mb-1">
          던전
        </p>
        {data.dungeons.map((d) => (
          <div
            key={d.id}
            className={cn(
              "px-3.5 py-2 text-sm cursor-pointer transition-colors border-l-2 leading-tight",
              activeDungeonId === d.id
                ? "border-[#7C6FE0] bg-[#7C6FE0]/5 text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => handleDungeonChange(d.id)}
          >
            {d.name}
          </div>
        ))}

        <Separator className="mx-3.5 w-auto my-2" />

        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3.5 mb-1">
          기간
        </p>
        {(["전체", "주간", "월간"] as const).map((p) => (
          <div
            key={p}
            className="pl-6 pr-3.5 py-1 text-xs cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
          >
            {p}
          </div>
        ))}
      </aside>

      {/* 메인 */}
      <main className="flex-1 min-w-0 p-6">
        <MainContent dungeon={dungeon} data={data} />
      </main>
    </div>
  );
}
