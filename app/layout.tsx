import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aionlogs.gg"),
  title: {
    template: "%s | AionLogs",
    default: "AionLogs — 아이온2 레이드 로그 분석",
  },
  description:
    "아이온2 DPS 미터기 로그를 업로드하고 공대원별 딜량·힐량·스킬 분석을 확인하세요.",
  keywords: ["아이온2", "DPS", "레이드", "로그", "파싱", "미터기"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "AionLogs",
    title: "AionLogs — 아이온2 레이드 로그 분석",
    description: "아이온2 DPS 미터기 로그를 업로드하고 공대원별 딜량·힐량·스킬 분석을 확인하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AionLogs — 아이온2 레이드 로그 분석",
    description: "아이온2 DPS 미터기 로그를 업로드하고 공대원별 딜량·힐량·스킬 분석을 확인하세요.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <div className="min-h-[calc(100vh-52px)]">{children}</div>
      </body>
    </html>
  );
}
