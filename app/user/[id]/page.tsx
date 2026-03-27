// app/user/[id]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import userProfile from "@/data/userProfile.json";
import UserClient from "./client";

/**
 * 실제 fetch 연동 시:
 *   const profile = await fetchUserProfile(decodeURIComponent(params.id));
 *   if (!profile) notFound();
 */

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const name = decodeURIComponent(params.id);
  const profile = userProfile; // mock

  return {
    title: `${profile.characterName} — ${profile.jobName} | AionLogs`,
    description: `${profile.serverName} 서버 · ${profile.jobName} · 베스트 DPS ${(profile.bestDps / 1000).toFixed(1)}k · 총 클리어 ${profile.totalClears}회`,
    openGraph: {
      title: `${profile.characterName} 캐릭터 정보 | AionLogs`,
      description: `베스트 DPS: ${(profile.bestDps / 1000).toFixed(1)}k · 평균 치명타: ${profile.avgCritRate.toFixed(1)}%`,
    },
  };
}

export default function UserPage({ params }: { params: { id: string } }) {
  // mock 단계: 항상 고정 데이터 반환
  // 실제: const profile = await fetchUserProfile(decodeURIComponent(params.id));
  const profile = userProfile;

  return <UserClient profile={profile} />;
}
