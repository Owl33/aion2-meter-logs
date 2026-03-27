// app/user/[id]/components/UserProfileCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { fmtDps, fmtNumber } from "@/lib/formatters";
import JobBadge from "@/components/shared/JobBadge";
import PlayerAvatar from "@/components/shared/PlayerAvatar";
import type { UserProfileData } from "../types";

interface UserProfileCardProps {
  profile: UserProfileData;
}

interface StatItem {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}

export default function UserProfileCard({ profile }: UserProfileCardProps) {
  const stats: StatItem[] = [
    { label: "베스트 DPS",  value: fmtDps(profile.bestDps),        highlight: true },
    { label: "평균 DPS",    value: fmtDps(profile.avgDps) },
    { label: "평균 치명타", value: `${profile.avgCritRate.toFixed(1)}%` },
    { label: "총 클리어",   value: `${profile.totalClears}회` },
    { label: "전투력",      value: fmtNumber(profile.combatPower),  mono: true },
  ];

  return (
    <Card className="border-border/50 shadow-none">
      <CardContent className="flex flex-wrap items-center justify-between gap-6 p-5">
        {/* 좌측: 캐릭터 정보 */}
        <div className="flex items-center gap-4">
          <PlayerAvatar name={profile.characterName} jobName={profile.jobName}  />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{profile.characterName}</h1>
              <Badge
                variant="outline"
                className="rounded-full border-0 bg-muted text-[11px] text-muted-foreground"
              >
                {profile.serverName}
              </Badge>
            </div>
            <JobBadge job={profile.jobName} />
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {profile.firstSeen} ~ {profile.lastSeen} 활동
            </p>
          </div>
        </div>

        {/* 우측: 스탯 */}
        <div className="flex flex-wrap items-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="px-5 text-right">
                <p className="mb-1 text-[11px] text-muted-foreground">{stat.label}</p>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    stat.mono && "font-mono text-sm",
                    stat.highlight && "text-primary"
                  )}
                >
                  {stat.value}
                </p>
              </div>
              {i < stats.length - 1 && (
                <Separator orientation="vertical" className="h-8" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
