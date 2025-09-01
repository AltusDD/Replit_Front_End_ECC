// src/components/data/Sparkline.tsx
import React from "react";

type Props = { data: number[]; width?: number; height?: number; ariaLabel?: string };

export default function Sparkline({ data, width = 120, height = 36, ariaLabel = "trend" }: Props) {
  if (!data || data.length === 0) {
    return <div style={{ width, height }} aria-label={ariaLabel} />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const pts = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label={ariaLabel}>
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
    </svg>
  );
}
