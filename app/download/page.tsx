import type { Metadata } from "next";
import downloadData from "@/data/download.json";
import DownloadPage from "@/components/download/DownloadPage";

export const metadata: Metadata = {
  title: "다운로드",
  description: "아이온2 전용 DPS 미터기를 다운로드하고 AionLogs와 연동하세요.",
};

export default function Page() {
  return <DownloadPage data={downloadData} />;
}
