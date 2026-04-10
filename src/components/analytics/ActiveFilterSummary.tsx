import React from "react";

export type ActiveFilterSummaryItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export default function ActiveFilterSummary({
  title,
  items,
}: {
  title: string;
  items: ActiveFilterSummaryItem[];
}) {
  return (
    <section className="rounded-2xl border border-[rgba(214,179,106,0.24)] bg-[linear-gradient(135deg,rgba(214,179,106,0.14),rgba(27,31,38,0.96)_30%,rgba(11,14,18,1))] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6b36a]">{title}</div>
          <div className="mt-2 text-sm text-[#d7dbe3]">Visible active scope for the current ECC surface.</div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d6b36a]">{items.length} filters</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <div key={item.key} className="rounded-full border border-[rgba(255,255,255,0.08)] bg-black/35 px-3 py-2 text-xs text-white">
            <span className="font-bold uppercase tracking-[0.16em] text-[#d6b36a]">{item.label}</span>
            <span className="ml-2 text-[#d7dbe3]">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
