"use client";

/**
 * components/charts/DpsLineChart.tsx
 * DPS 타임라인 라인 차트 — ECharts
 */

import { useMemo } from "react";
import EChart from "@/components/charts/EChart";
import { fmtDps } from "@/lib/formatters";

export interface DpsSeriesPoint {
  t: number;
  dps: number;
}

export interface DpsSeries {
  id: number | string;
  label: string;
  color: string;
  data: DpsSeriesPoint[];
  active?: boolean;
}

interface DpsLineChartProps {
  series: DpsSeries[];
  height?: number;
}

export default function DpsLineChart({ series, height = 240 }: DpsLineChartProps) {
  const option = useMemo(() => ({
    animation: false,
    grid: { top: 16, right: 16, bottom: 32, left: 56, containLabel: false },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15,15,20,0.92)",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      textStyle: { color: "rgba(220,220,220,0.9)", fontSize: 12 },
      formatter: (params: any[]) => {
        const t = params[0]?.axisValue ?? "";
        const rows = params
          .filter((p) => p.value != null)
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
          .map(
            (p) =>
              `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
                <span style="flex:1">${p.seriesName}</span>
                <span style="font-weight:600;font-variant-numeric:tabular-nums">${fmtDps(p.value)}</span>
              </div>`
          )
          .join("");
        return `<div style="font-size:11px;color:rgba(150,150,150,0.8);margin-bottom:6px">${t}</div>${rows}`;
      },
    },
    xAxis: {
      type: "category" as const,
      data: series[0]?.data.map((p) => `${p.t}s`) ?? [],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(128,128,128,0.6)",
        fontSize: 11,
        interval: "auto",
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value" as const,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(128,128,128,0.6)",
        fontSize: 11,
        formatter: (v: number) => fmtDps(v),
      },
      splitLine: { lineStyle: { color: "rgba(128,128,128,0.08)" } },
    },
    series: series.map((s) => ({
      name: s.label,
      type: "line" as const,
      data: s.data.map((p) => p.dps),
      smooth: 0.3,
      symbol: "none",
      lineStyle: {
        color: s.color,
        width: s.active !== false ? 2 : 1,
        opacity: s.active !== false ? 1 : 0.25,
      },
      areaStyle: {
        color: s.color,
        opacity: s.active !== false ? 0.08 : 0.02,
      },
      itemStyle: { color: s.color },
    })),
  }), [series]);

  return <EChart option={option} style={{ height }} />;
}
