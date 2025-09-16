import React, { useState } from "react";
import { Block } from "./Skeleton";

export type Tab = { key: string; label: string; render: () => React.ReactNode };

export default function Tabs({ tabs, defaultKey }: { tabs: Tab[]; defaultKey?: string }) {
  const [active, setActive] = useState(defaultKey ?? tabs[0]?.key);
  const current = tabs.find(t => t.key === active);

  return (
    <div>
      <div role="tablist" aria-label="Card Tabs" className="ecc-object" style={{ padding: 8, marginBottom: 12 }}>
        {tabs.map(t => (
          <button key={t.key} role="tab" aria-selected={active === t.key} onClick={() => setActive(t.key)} style={{ marginRight: 8 }}>
            {t.label}
          </button>
        ))}
      </div>
      <section className="ecc-object">
        {current ? current.render() : <Block h={120} />}
      </section>
    </div>
  );
}