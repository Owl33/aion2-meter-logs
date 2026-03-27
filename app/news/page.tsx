import type { Metadata } from "next";
import newsData from "@/data/news.json";
import NewsClient, { NewsData } from "./client";

export const metadata: Metadata = {
  title: "공지 및 업데이트",
  description: "AionLogs 서비스 업데이트와 주요 공지사항을 확인하세요.",
};

export default function NewsPage() {
  return <NewsClient data={newsData as NewsData} />;
}
