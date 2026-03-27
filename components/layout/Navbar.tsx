"use client"

/**
 * components/layout/Navbar.tsx
 */

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import CharacterSearchModal from "@/components/search/CharacterSearchModal"

const LINKS = [
  { label: "홈", href: "/" },
  { label: "랭킹", href: "/rankings" },
  { label: "다운로드", href: "/download" },
  { label: "공지", href: "/news" },
] as const

export default function Navbar() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  // Cmd/Ctrl + K 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-[52px] items-center gap-0 border-b border-border/50 bg-background/90 px-5 backdrop-blur-md">
        {/* 로고 */}
        <a
          href="/"
          className="mr-7 shrink-0 text-base font-bold tracking-tight"
        >
          Aion<span className="text-primary">Logs</span>
        </a>

        {/* 네비 링크 */}
        <div className="flex flex-1 items-center gap-1">
          {LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* 검색 버튼 */}
        <button
          onClick={() => setSearchOpen(true)}
          className={cn(
            "flex h-8 items-center gap-2 rounded-lg border border-border/60 px-3",
            "bg-muted/50 transition-colors hover:bg-muted",
            "text-sm text-muted-foreground"
          )}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">캐릭터 검색</span>
          <kbd className="ml-1 hidden items-center rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
            ⌘K
          </kbd>
        </button>

        {/* 업로드 버튼 */}
        <Button
          size="sm"
          className="ml-2 h-8 shrink-0 bg-primary px-4 text-xs font-semibold text-white hover:bg-[#6B5FD0]"
          onClick={() => (window.location.href = "/upload")}
        >
          로그 업로드
        </Button>
      </nav>

      {/* 검색 모달 */}
      <CharacterSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  )
}
