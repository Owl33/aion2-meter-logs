"use client";

/**
 * components/upload/UploadPage.tsx
 */

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const DUNGEONS = [
  {
    id: "choeol-4",
    name: "초월 4단",
    bosses: ["가라앉은 에몬", "붉은 눈의 카르테", "심연의 군주 바라투스"],
  },
  {
    id: "seongyeok-1",
    name: "성역 1",
    bosses: ["성역의 파수꾼", "타락한 빛의 사도", "성역의 지배자 아엘리아"],
  },
  {
    id: "seongyeok-2",
    name: "성역 2",
    bosses: ["어둠의 전령 세이론", "혼돈의 화신 말라크", "성역의 파괴자 이그레인"],
  },
  {
    id: "muui-yoram",
    name: "무의 요람",
    bosses: ["허공의 감시자", "요람의 수호자 네라스", "무의 화신 칼리아스"],
  },
  {
    id: "dratamar",
    name: "드라타마의 둥지",
    bosses: ["둥지의 파수꾼 그라울", "불꽃의 지배자 이그니스", "드라타마"],
  },
];

type UploadState = "idle" | "dragging" | "selected" | "uploading" | "done" | "error";

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dungeonId, setDungeonId] = useState("");
  const [bossIndex, setBossIndex] = useState("");
  const [characterName, setCharacterName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedDungeon = DUNGEONS.find((d) => d.id === dungeonId);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setUploadState("selected");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("idle");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("dragging");
  };

  const handleDragLeave = () => setUploadState("idle");

  const handleSubmit = () => {
    if (!selectedFile || !dungeonId || !bossIndex) return;
    setUploadState("uploading");
    // 실제 fetch 연동 시 여기서 API 호출
    setTimeout(() => setUploadState("done"), 1500);
  };

  const isValid = selectedFile && dungeonId && bossIndex;

  return (
    <div className="max-w-[560px] mx-auto px-5 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">로그 업로드</h1>
        <p className="text-sm text-muted-foreground mt-1">
          DPS 미터기에서 내보낸 로그 파일을 업로드하면 자동으로 분석됩니다.
        </p>
      </div>

      <Card className="border-border/50 shadow-none">
        <CardContent className="p-5 flex flex-col gap-5">
          {/* 드롭존 */}
          <div
            className={cn(
              "border-[1.5px] border-dashed rounded-xl p-10 text-center cursor-pointer transition-all",
              uploadState === "dragging"
                ? "border-[#7C6FE0] bg-[#7C6FE0]/5"
                : uploadState === "selected"
                ? "border-[#7C6FE0]/60 bg-[#7C6FE0]/3"
                : "border-border/60 hover:border-[#7C6FE0]/50 hover:bg-muted/30"
            )}
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".log,.txt,.json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#7C6FE0]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#7C6FE0]" fill="none" viewBox="0 0 20 20">
                    <path d="M4 4h8l4 4v8a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M12 4v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB · 클릭하여 변경
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 20 20">
                    <path d="M10 13V7M7 10l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 14a3 3 0 010-6h.5A5 5 0 0114.5 5H15a3 3 0 010 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-xs text-muted-foreground">.log · .txt · .json · 최대 50MB</p>
              </div>
            )}
          </div>

          <Separator />

          {/* 던전 / 보스 선택 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">던전</Label>
              <Select value={dungeonId} onValueChange={(v) => { setDungeonId(v); setBossIndex(""); }}>
                <SelectTrigger className="h-9 border-border/60 text-sm">
                  <SelectValue placeholder="던전 선택" />
                </SelectTrigger>
                <SelectContent>
                  {DUNGEONS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">네임드</Label>
              <Select value={bossIndex} onValueChange={setBossIndex} disabled={!dungeonId}>
                <SelectTrigger className="h-9 border-border/60 text-sm">
                  <SelectValue placeholder="네임드 선택" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDungeon?.bosses.map((boss, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1}네임드 — {boss}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 캐릭터명 */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">
              업로더 캐릭터명 <span className="text-muted-foreground font-normal">(선택)</span>
            </Label>
            <Input
              placeholder="캐릭터명 입력..."
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="h-9 border-border/60 text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              입력 시 캐릭터 페이지에 기록이 연동됩니다.
            </p>
          </div>

          {/* 안내 */}
          <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border/40">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7C6FE0] mt-1.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              업로드된 로그는 공개 랭킹에 반영됩니다. 개인 정보는 포함되지 않으며 언제든지 삭제를 요청할 수 있습니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          {uploadState === "done" ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 20 20">
                  <path d="M5 10l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-semibold">업로드 완료!</p>
              <Button variant="outline" size="sm" onClick={() => { setUploadState("idle"); setSelectedFile(null); }}>
                다른 로그 업로드
              </Button>
            </div>
          ) : (
            <Button
              className="h-10 bg-[#7C6FE0] hover:bg-[#6B5FD0] text-white"
              disabled={!isValid || uploadState === "uploading"}
              onClick={handleSubmit}
            >
              {uploadState === "uploading" ? "분석 중..." : "분석 시작"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
