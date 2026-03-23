"use client";

import { useMemo } from "react";
import EChart from "@/components/charts/EChart";
import { fmtDps } from "@/lib/formatters";

export interface BoxPlotItem {
  label: string;
  color: string;
  min: number;
  q1?: number;
  median: number;
  q3?: number;
  max: number;
  outliers?: number[];
}

interface BoxPlotChartProps {
  items: BoxPlotItem[];
  height?: number;
}

export default function BoxPlotChart({ items, height = 320 }: BoxPlotChartProps) {
  const option = useMemo(() => {
    // data item에 직접 itemStyle을 넣는 방식
    // { value: [...], itemStyle: { color, borderColor } }
    const boxData = items.map((item) => ({
      value: [
        item.min,
        item.q1      ?? item.min    + (item.median - item.min)    * 0.5,
        item.median,
        item.q3      ?? item.median + (item.max    - item.median) * 0.5,
        item.max,
      ],
      itemStyle: {
        color:       item.color,
        borderColor: item.color,
        borderWidth: 2,
      },
    }));

    // 이상치: [카테고리 인덱스, 값]
    const outlierData: [number, number][] = [];
    items.forEach((item, idx) => {
      item.outliers?.forEach((v) => outlierData.push([idx, v]));
    });

    return {
      animation: false,
      grid: { top: 16, right: 40, bottom: 32, left: 16, containLabel: true },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15,15,20,0.94)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        textStyle: { color: "rgba(220,220,220,0.9)", fontSize: 12 },
        formatter: (params: any) => {
          if (params.seriesType === "scatter") {
            const idx  = params.value[0] as number;
            const val  = params.value[1] as number;
            const item = items[idx];
            if (!item) return "";
            return `<div style="font-size:11px;padding:2px 4px">
              <b style="color:${item.color}">${item.label}</b> 이상치<br/>
              <span style="font-variant-numeric:tabular-nums">${fmtDps(val)}</span>
            </div>`;
          }

          const idx  = params.dataIndex as number;
          const item = items[idx];
          if (!item) return "";
          const [min, q1, median, q3, max] = params.value as number[];
          return `
            <div style="font-size:11px;min-width:150px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${item.color}"></span>
                <span style="font-weight:700;font-size:13px;color:white">${item.label}</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <div style="display:flex;justify-content:space-between;gap:20px;color:rgba(200,200,200,0.8)">
                  <span>최고</span><span style="font-weight:600;font-variant-numeric:tabular-nums">${fmtDps(max)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:20px;color:rgba(200,200,200,0.8)">
                  <span>Q3</span><span style="font-variant-numeric:tabular-nums">${fmtDps(q3)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:20px;color:white">
                  <span style="font-weight:700">평균</span><span style="font-weight:700;font-variant-numeric:tabular-nums">${fmtDps(median)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:20px;color:rgba(200,200,200,0.8)">
                  <span>Q1</span><span style="font-variant-numeric:tabular-nums">${fmtDps(q1)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;gap:20px;color:rgba(200,200,200,0.8)">
                  <span>최저</span><span style="font-weight:600;font-variant-numeric:tabular-nums">${fmtDps(min)}</span>
                </div>
              </div>
            </div>`;
        },
      },
      xAxis: {
        type: "value" as const,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "rgba(128,128,128,0.55)",
          fontSize: 11,
          formatter: (v: number) => fmtDps(v),
        },
        splitLine: {
          lineStyle: { color: "rgba(128,128,128,0.1)", type: "dashed" },
        },
      },
      yAxis: {
        type: "category" as const,
        data: items.map((i) => i.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: (_value: string, index: number) => {
            const item = items[index];
            if (!item) return _value;
            return `{c${index}|${item.label}}`;
          },
          rich: Object.fromEntries(
            items.map((item, i) => [
              `c${i}`,
              { color: item.color, fontWeight: "bold", fontSize: 12 },
            ])
          ),
          margin: 14,
        },
        splitLine: { show: false },
      },
      series: [
        {
          name: "DPS 분포",
          type: "boxplot" as const,
          data: boxData,
          // series 레벨 emphasis — data item itemStyle은 emphasis 미지원이므로 여기서 처리
          emphasis: {
            itemStyle: {
              borderWidth: 2.5,
              shadowBlur: 3,
              shadowColor: "rgba(0,0,0,0.15)",
            },
          },
          boxWidth: ["20%", "45%"],
        },
        ...(outlierData.length > 0
          ? [{
              name: "이상치",
              type: "scatter" as const,
              data: outlierData,
              encode: { x: 1, y: 0 },
              symbolSize: 7,
              itemStyle: {
                color: (param: any) => items[param.value[0]]?.color ?? "#7C6FE0",
                opacity: 0.9,
              },
            }]
          : []),
      ],
    };
  }, [items]);

  return <EChart option={option} style={{ height }} />;
}
