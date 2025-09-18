import { BLANK, formatCurrencyFromCents } from "@/lib/format";

type Props = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  status?: string;
  photoUrl?: string;
  unitCount?: number;
  avgRentCents?: number;
  onOpen?: () => void;
};

export default function AssetCard(p: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 grid grid-cols-[96px,1fr,auto] gap-4">
      <img
        src={p.photoUrl ?? "/placeholder-asset.jpg"}
        alt={p.name}
        className="h-24 w-24 rounded-xl object-cover bg-zinc-800"
      />
      <div className="min-w-0">
        <div className="font-semibold truncate">{p.name}</div>
        <div className="text-sm text-zinc-400 truncate">
          {p.address ?? BLANK}{p.city ? `, ${p.city}` : ""}{p.state ? `, ${p.state}` : ""}
        </div>
        <div className="mt-2 flex gap-3 text-sm">
          <span className="rounded-md bg-zinc-800/60 px-2 py-0.5">{p.status ?? "Unknown"}</span>
          <span className="rounded-md bg-zinc-800/60 px-2 py-0.5">{p.unitCount ?? 0} units</span>
          <span className="rounded-md bg-zinc-800/60 px-2 py-0.5">
            {p.avgRentCents != null ? formatCurrencyFromCents(p.avgRentCents) : BLANK} avg rent
          </span>
        </div>
      </div>
      <div className="flex items-start">
        <button
          onClick={p.onOpen}
          className="rounded-xl border border-zinc-700 px-3 py-2 hover:bg-zinc-800"
        >
          Open
        </button>
      </div>
    </div>
  );
}
