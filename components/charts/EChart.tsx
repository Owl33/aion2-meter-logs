"use client";

/**
 * components/charts/EChart.tsx
 *
 * ECharts 공통 래퍼 컴포넌트
 * - echarts-for-react를 dynamic import로 SSR 방지
 * - 모든 차트 컴포넌트는 이걸 통해서 사용
 *
 * 사용법:
 *   import EChart from "@/components/charts/EChart";
 *   <EChart option={...} style={{ height: 240 }} />
 */

import dynamic from "next/dynamic";
import type { EChartsOption, EChartsReactProps } from "echarts-for-react";

// SSR 방지 — window 객체 접근 문제 해결
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-muted/20 rounded-lg animate-pulse"
      style={{ height: "100%", minHeight: 80 }}
    />
  ),
});

interface EChartProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  onEvents?: Record<string, (params: any) => void>;
}

export default function EChart({ option, style, className, onEvents }: EChartProps) {
  return (
    <ReactECharts
      option={option}
      style={{ width: "100%", height: 300, ...style }}
      className={className}
      notMerge
      lazyUpdate
      onEvents={onEvents}
      opts={{ renderer: "canvas" }}
    />
  );
}
