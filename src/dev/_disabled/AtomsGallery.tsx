import React from 'react';
import { KPI, KPIRow } from '@/components/cardkit/KPI';
import { ActionButton } from '@/components/cardkit/ActionButton';
import { MiniCard } from '@/components/cardkit/MiniCard';

export default function AtomsGallery() {
  const rows = [
    { label: 'Type', value: 'RESIDENTIAL_SINGLE_FAMILY' },
    { label: 'Status', value: 'Active' },
    { label: 'DoorLoop ID', value: '67506d4611d949701aba9927', copy: true },
    { label: 'Owner', value: '—' },
    { label: 'GIS', value: 'Open parcel', href: '#' },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="atoms-gallery">
      <h1 className="text-lg font-semibold">Atoms Gallery</h1>
      
      {/* FieldRows Preview */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">FieldRows</h2>
        <div>Legacy FieldRows removed for CardKit alignment</div>
      </div>

      {/* KPI Preview */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold mt-8">KPI</h2>
        <KPIRow>
          <KPI label="Units" value="178" trendPct={1.2} />
          <KPI label="Active Leases" value="98" />
          <KPI label="Avg Rent" value="$1,245" trendPct={-0.4} />
          <KPI label="Status" value="Active" />
        </KPIRow>
        <KPIRow>
          <KPI label="Loading KPI" loading />
          <KPI label="Loading KPI" loading />
        </KPIRow>
      </div>

      {/* Actions Preview */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold mt-8">ActionButton</h2>
        <div className="flex flex-wrap gap-3">
          <ActionButton label="Edit" icon="✏️" variant="secondary" />
          <ActionButton label="Export PDF" icon="📄" variant="ghost" />
          <ActionButton label="New Work Order" icon="🛠️" />
          <ActionButton label="CoreLogic AVM" icon="📈" comingSoon />
          <ActionButton label="Upload" icon="⬆️" loading />
        </div>
      </div>

      {/* MiniCard Preview */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold mt-8">MiniCard</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <MiniCard title="Unit 101" subtitle="2 bed • 1 bath" meta="Market Rent $1,245" href="#" />
          <MiniCard title="Building A" subtitle="Macon, GA" meta="Class B" countBadge={12} href="#" />
          <MiniCard title="Owner: Altus" meta="Properties: 7 • Units: 178" />
        </div>
      </div>
    </div>
  );
}