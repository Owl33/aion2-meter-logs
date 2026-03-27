import type { Metadata } from "next";
import UploadClient from "./client";

export const metadata: Metadata = {
  title: "로그 업로드",
  description: "아이온2 DPS 미터기 로그 파일을 업로드하여 공대원별 딜량·힐량을 분석하세요.",
};

export default function Page() {
  return <UploadClient />;
}
