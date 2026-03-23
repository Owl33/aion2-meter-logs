"use client";

/**
 * components/home/HeroSection.tsx
 * 검색 버튼 클릭 시 CharacterSearchModal 오픈
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onSearchOpen: () => void;
}

export default function HeroSection({ onSearchOpen }: HeroSectionProps) {
  return (
    <section className="text-center flex flex-col items-center gap-4 py-10">
      <Badge
        variant="outline"
        className="border-[#7C6FE0]/30 text-[#7C6FE0] bg-[#7C6FE0]/8 text-xs px-3"
      >
        아이온2 레이드 로그 분석
      </Badge>

      <h1 className="text-4xl font-bold tracking-tight">
        당신의 딜을 <span className="text-[#7C6FE0]">증명</span>하세요
      </h1>

      <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
        DPS 미터기 로그를 업로드하면 공대원별 딜량·힐량·스킬 기여도를 자동으로 분석해드립니다.
      </p>

      <div className="flex gap-2 mt-1">
        <Button
          variant="outline"
          className="h-10 px-4 gap-2 border-border/60 text-muted-foreground hover:text-foreground"
          onClick={onSearchOpen}
        >
          <Search className="w-4 h-4" />
          캐릭터 검색
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border/60 rounded ml-1">
            ⌘K
          </kbd>
        </Button>
        <Button
          className="h-10 px-6 bg-[#7C6FE0] hover:bg-[#6B5FD0] text-white"
          onClick={() => (window.location.href = "/upload")}
        >
          로그 업로드
        </Button>
      </div>
    </section>
  );
}
