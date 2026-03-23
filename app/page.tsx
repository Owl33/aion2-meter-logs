import type { Metadata } from "next";
import homeData from "@/data/home.json";
import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "AionLogs — 아이온2 레이드 로그 분석",
  description:
    "아이온2 DPS 미터기 로그를 업로드하고 공대원별 딜량·힐량·스킬 분석을 확인하세요.",
};

export default function Page() {
  return <HomePage data={homeData} />;
}
