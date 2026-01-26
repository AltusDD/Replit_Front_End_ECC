import React from "react";

type AssetCardProps = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  status?: string;
  photoUrl?: string;
  unitCount?: number;        // default 0
  avgRentCents?: number;     // integer cents; format currency
  onOpen?: () => void;
};

function fmtCurrency(cents?: number) {
  if (typeof cents !== "number" || Number.isNaN(cents)) return "BLANK";
  const dollars = cents / 100;
  return dollars.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
function safeNum(n?: number) {
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
}
function locationText(addr?: string, city?: string, state?: string) {
  const parts = [addr, [city, state].filter(Boolean).join(", ")].filter(Boolean);
  return parts.length ? parts.join(" • ") : "BLANK";
}

export default function AssetCard(props: AssetCardProps) {
  const { name, address, city, state, status, unitCount, avgRentCents, onOpen } = props;
  return (
    <div className="rounded-xl border border-white/10 p-4 bg-black/20">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-lg font-semibold truncate" data-testid="assetcard-name">
            {name}
          </div>
          <div className="text-sm text-zinc-400 truncate" data-testid="assetcard-location">
            {locationText(address, city, state)}
          </div>
        </div>
        <button
          type="button"
          className="text-xs px-2 py-1 rounded-md border border-white/10 hover:bg-white/10"
          onClick={onOpen}
          data-testid="assetcard-open"
          aria-label="Open"
        >
          Open
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-white/5 p-2">
          <div className="text-zinc-400">Status</div>
          <div data-testid="assetcard-status">{status || "BLANK"}</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2">
          <div className="text-zinc-400">Units</div>
          <div data-testid="assetcard-unitcount">{safeNum(unitCount) ?? "BLANK"}</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2">
          <div className="text-zinc-400">Avg Rent</div>
          <div data-testid="assetcard-avgrent">{fmtCurrency(avgRentCents)}</div>
        </div>
      </div>
    </div>
  );
}
