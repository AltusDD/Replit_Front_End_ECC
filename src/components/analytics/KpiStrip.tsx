import React from "react";

export type KpiStripMetric = {
  key: string;
  label: string;
  value: React.ReactNode;
  helper: string;
};

export default function KpiStrip({
  title,
  items,
}: {
  title: string;
  items: KpiStripMetric[];
}) {
  return (
    <section className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(27,31,38,0.98))] p-4 shadow-[0_16px_44px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6b36a]">{title}</div>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a5adba]">{items.length} metrics</div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.key} className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-black/25 p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a5adba]">{item.label}</div>
            <div className="mt-3 text-2xl font-semibold tracking-tight text-white">{item.value}</div>
            <div className="mt-2 text-xs leading-5 text-[#a5adba]">{item.helper}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
