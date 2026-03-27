"use client"

/**
 * components/home/HeroSection.tsx
 * 검색 버튼 클릭 시 CharacterSearchModal 오픈
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface HeroSectionProps {
  onSearchOpen: () => void
}

export default function HeroSection({ onSearchOpen }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center gap-4 py-10 text-center">
      <Badge
        variant="outline"
        className="border-primary/30 bg-primary/8 px-3 text-xs text-primary"
      >
        아이온2 레이드 로그 분석
      </Badge>

      <h1 className="text-4xl font-bold tracking-tight">
        당신의 딜을 <span className="text-primary">증명</span>하세요
      </h1>

      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        DPS 미터기 로그를 업로드하면 공대원별 딜량·힐량·스킬 기여도를 자동으로
        분석해드립니다.
      </p>

      <div className="mt-1 flex gap-2">
        <Button
          variant="outline"
          className="h-10 gap-2 border-border/60 px-4 text-muted-foreground hover:text-foreground"
          onClick={onSearchOpen}
        >
          <Search className="h-4 w-4" />
          캐릭터 검색
          <kbd className="ml-1 hidden items-center rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
            ⌘K
          </kbd>
        </Button>
        <Button
          className="h-10 bg-primary px-6 text-white hover:bg-[#6B5FD0]"
          onClick={() => (window.location.href = "/upload")}
        >
          로그 업로드
        </Button>
      </div>
    </section>
  )
}
