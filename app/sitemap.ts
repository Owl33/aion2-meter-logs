import type { MetadataRoute } from "next";
import rankingsData from "@/data/rankings.json";

const BASE_URL = "https://aionlogs.gg";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/rankings`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/download`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/upload`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // 던전별 랭킹 페이지
  const dungeonPages: MetadataRoute.Sitemap = rankingsData.dungeons.flatMap((dungeon) =>
    dungeon.bosses.map((boss) => ({
      url: `${BASE_URL}/rankings?dungeon=${dungeon.id}&boss=${boss.index}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...dungeonPages];
}
