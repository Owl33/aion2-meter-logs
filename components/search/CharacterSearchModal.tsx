"use client";

/**
 * components/search/CharacterSearchModal.tsx
 *
 * mock 단계: characters를 prop으로 받아 클라이언트에서 필터링
 * 실제 fetch 연동 시: useDebounce + fetch로 교체
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { highlight } from "@/lib/highlight";
import JobBadge from "@/components/shared/JobBadge";

// ─── 타입 ────────────────────────────────────────────────────
export interface CharacterResult {
  name: string;
  jobName: string;
  serverId: number;
  topDps?: number;
  reportCount?: number;
}

interface CharacterSearchModalProps {
  open: boolean;
  onClose: () => void;
  /** mock 단계에서 사용할 전체 캐릭터 목록 */
  characters?: CharacterResult[];
}

// ─── mock 데이터 (실제 fetch 전까지 사용) ────────────────────
const MOCK_CHARACTERS: CharacterResult[] = [
  { name: "아이네하르트", jobName: "검사", serverId: 1, topDps: 458200, reportCount: 24 },
  { name: "루시엘", jobName: "정령사", serverId: 1, topDps: 431600, reportCount: 18 },
  { name: "레이나흐트", jobName: "격투가", serverId: 1, topDps: 408300, reportCount: 15 },
  { name: "다일로스", jobName: "마법사", serverId: 1, topDps: 401200, reportCount: 21 },
  { name: "카엘타스", jobName: "사수", serverId: 1, topDps: 389600, reportCount: 12 },
  { name: "세라핀", jobName: "성직자", serverId: 1, topDps: 276800, reportCount: 9 },
  { name: "아스트라엘", jobName: "검사", serverId: 1, topDps: 358900, reportCount: 16 },
  { name: "미라엘", jobName: "정령사", serverId: 1, topDps: 341200, reportCount: 11 },
  { name: "테르반", jobName: "사수", serverId: 1, topDps: 324100, reportCount: 8 },
  { name: "카이로스", jobName: "마법사", serverId: 1, topDps: 289300, reportCount: 7 },
];

// ─── ResultItem ──────────────────────────────────────────────
function ResultItem({
  character,
  isActive,
  query,
  onClick,
  onMouseEnter,
}: {
  character: CharacterResult;
  isActive: boolean;
  query: string;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <button
      data-item="true"
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors",
        isActive
          ? "bg-[#7C6FE0]/8 border border-[#7C6FE0]/30"
          : "border border-transparent hover:bg-muted/50"
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {/* 아바타 */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
        style={{
          background: isActive ? "rgba(124,111,224,0.15)" : "rgba(128,128,128,0.08)",
          color: isActive ? "#7C6FE0" : undefined,
        }}
      >
        {character.name.slice(0, 1)}
      </div>

      {/* 이름 + 직업 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate">
            {highlight(character.name, query)}
          </span>
          <JobBadge job={character.jobName} />
        </div>
        {character.topDps && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            최고 DPS {(character.topDps / 1000).toFixed(1)}k
            {character.reportCount ? ` · ${character.reportCount}개 리포트` : ""}
          </p>
        )}
      </div>

      {/* 활성 화살표 */}
      {isActive && (
        <svg className="w-4 h-4 text-[#7C6FE0] shrink-0" fill="none" viewBox="0 0 16 16">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// ─── ResultSkeleton ───────────────────────────────────────────
function ResultSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-muted shrink-0 animate-pulse" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-1/3 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────
export default function CharacterSearchModal({
  open,
  onClose,
  characters = MOCK_CHARACTERS,
}: CharacterSearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const debouncedQuery = useDebounce(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 오픈 시 input 포커스
  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    } else {
      setQuery("");
      setActiveIdx(-1);
    }
  }, [open]);

  // 필터링 (실제 fetch 연동 시 이 부분을 useQuery로 교체)
  const results =
    debouncedQuery.trim().length < 1
      ? []
      : characters.filter((c) =>
          c.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

  const isLoading = query !== debouncedQuery && query.trim().length > 0;

  const navigate = useCallback(
    (character: CharacterResult) => {
      window.location.href = `/characters/${encodeURIComponent(character.name)}`;
      onClose();
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!results.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => {
          const next = prev + 1 >= results.length ? 0 : prev + 1;
          listRef.current
            ?.querySelectorAll<HTMLButtonElement>("[data-item='true']")
            [next]?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => {
          const next = prev - 1 < 0 ? results.length - 1 : prev - 1;
          listRef.current
            ?.querySelectorAll<HTMLButtonElement>("[data-item='true']")
            [next]?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (e.key === "Enter" && activeIdx >= 0) {
        navigate(results[activeIdx]);
      }
    },
    [results, activeIdx, navigate]
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden max-w-lg border-border/60"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">캐릭터 검색</DialogTitle>

        {/* 검색 입력 */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="캐릭터명 검색..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(-1);
            }}
            onKeyDown={handleKeyDown}
            className="border-0 shadow-none focus-visible:ring-0 h-8 p-0 text-sm bg-transparent"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setActiveIdx(-1); }}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* 결과 영역 */}
        <div
          ref={listRef}
          className="flex flex-col max-h-[360px] overflow-y-auto p-2"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* 초기 상태 */}
          {query.trim().length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">캐릭터명을 입력하세요</p>
              <p className="text-xs text-muted-foreground/60">↑ ↓ 로 선택 · Enter 로 이동</p>
            </div>
          )}

          {/* 로딩 */}
          {isLoading && (
            <div className="flex flex-col gap-1">
              <ResultSkeleton />
              <ResultSkeleton />
              <ResultSkeleton />
            </div>
          )}

          {/* 결과 없음 */}
          {!isLoading && query.trim().length > 0 && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="text-sm font-medium">검색 결과가 없습니다</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">"{query}"</span> 와 일치하는 캐릭터가 없어요
              </p>
            </div>
          )}

          {/* 결과 목록 */}
          {!isLoading &&
            results.map((character, i) => (
              <ResultItem
                key={character.name}
                character={character}
                isActive={i === activeIdx}
                query={debouncedQuery}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => navigate(character)}
              />
            ))}
        </div>

        {/* 하단 힌트 */}
        {results.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 border-t border-border/50 bg-muted/20">
            <span className="text-[11px] text-muted-foreground">
              {results.length}명 검색됨
            </span>
            <span className="text-[11px] text-muted-foreground ml-auto">
              ↑↓ 이동 · Enter 선택
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
