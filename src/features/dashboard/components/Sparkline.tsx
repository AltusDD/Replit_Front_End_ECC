import React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis, XAxis } from "recharts";

type Pt = { date: string; value: number };

export function Sparkline({ data }: { data?: Pt[] }) {
  const safe = Array.isArray(data) && data.length ? data : [];
  return (
    <div className="ecc-object p-4 rounded-2xl">
      <div className="text-sm opacity-80 mb-2">Occupancy (last 30d)</div>
      <div style={{ width: "100%", height: 120 }}>
        <ResponsiveContainer>
          <LineChart data={safe}>
            <XAxis dataKey="date" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
            <Line type="monotone" dataKey="value" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}