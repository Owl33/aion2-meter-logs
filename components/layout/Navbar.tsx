"use client";

/**
 * components/layout/Navbar.tsx
 */

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import CharacterSearchModal from "@/components/search/CharacterSearchModal";

const LINKS = [
  { label: "홈", href: "/" },
  { label: "랭킹", href: "/rankings" },
  { label: "다운로드", href: "/download" },
  { label: "공지", href: "/news" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd/Ctrl + K 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 h-[52px] flex items-center px-5 gap-0 border-b border-border/50 bg-background/90 backdrop-blur-md">
        {/* 로고 */}
        <a href="/" className="text-base font-bold tracking-tight mr-7 shrink-0">
          Aion<span className="text-[#7C6FE0]">Logs</span>
        </a>

        {/* 네비 링크 */}
        <div className="flex items-center gap-1 flex-1">
          {LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* 검색 버튼 */}
        <button
          onClick={() => setSearchOpen(true)}
          className={cn(
            "flex items-center gap-2 h-8 px-3 rounded-lg border border-border/60",
            "bg-muted/50 hover:bg-muted transition-colors",
            "text-sm text-muted-foreground"
          )}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">캐릭터 검색</span>
          <kbd className="hidden sm:inline-flex items-center ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border/60 rounded">
            ⌘K
          </kbd>
        </button>

        {/* 업로드 버튼 */}
        <Button
          size="sm"
          className="ml-2 h-8 px-4 text-xs font-semibold bg-[#7C6FE0] hover:bg-[#6B5FD0] text-white shrink-0"
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
  );
}
