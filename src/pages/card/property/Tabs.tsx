import {} from '@/lib/ecc-resolvers';
import React from 'react';

export type TabKey = 'overview'|'details'|'financials'|'legal'|'files'|'linked'|'activity';

export interface TabDef {
  key: TabKey;
  label: string;
  content: React.ReactNode;
}

export default function PropertyTabs({
  tabs,
  defaultKey = 'overview',
}: {
  tabs: TabDef[];
  defaultKey?: TabKey;
}) {
  const [active, setActive] = React.useState<TabKey>(defaultKey);
  return (
    <div className="ecc-object ecc-section">
      <nav className="flex flex-wrap gap-2 mb-3">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-3 py-1.5 rounded ${active === t.key ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setActive(t.key)}
            aria-current={active === t.key ? 'page' : undefined}
            data-testid={`tab-${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="ecc-divider" />
      <div>{tabs.find(t => t.key === active)?.content}</div>
    </div>
  );
}