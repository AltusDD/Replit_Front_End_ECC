import React from "react";
import "../../styles/layout-utils.css";
import AssetCard from "@/components/AssetCard";

export default function AssetsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  React.useEffect(() => {
    fetch("/api/assets").then(r => r.json()).then(setItems).catch(() => setItems([]));
  }, []);
  return (
    <div className="page-fill" data-testid="assets-page">
      <div className="p-4 text-2xl font-semibold">Assets</div>
      <div className="fill-scroll p-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((m) => (
          <div key={m.id}>
            <AssetCard
              name={m.name}
              address={m.address}
              city={m.city}
              state={m.state}
              status={m.status}
              unitCount={m.unitCount}
              avgRentCents={m.avgRentCents}
              onOpen={() => console.log("open", m.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}