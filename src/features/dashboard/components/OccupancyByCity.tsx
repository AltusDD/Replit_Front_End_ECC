// OccupancyByCity.tsx - Sortable table with drillable rows and progress bars
import React, { useState } from 'react';
import { Link } from 'wouter';
import { fmtPct } from '../../../utils/format';

interface CityOccupancyData {
  city: string;
  properties: number;
  occupiedUnits: number;
  totalUnits: number;
  occupancy: number;
}

interface OccupancyByCityProps {
  occupancy30: {
    byCity: CityOccupancyData[];
  };
}

type SortField = 'city' | 'properties' | 'occupancy' | 'totalUnits';
type SortDirection = 'asc' | 'desc';

// Progress bar component
function OccupancyProgressBar({ occupancy }: { occupancy: number }) {
  const getColor = (pct: number) => {
    if (pct >= 95) return 'var(--good)';
    if (pct >= 85) return 'var(--altus-gold)';
    if (pct >= 70) return 'var(--warn)';
    return 'var(--bad)';
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[var(--line)] rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min(occupancy, 100)}%`,
            backgroundColor: getColor(occupancy)
          }}
        />
      </div>
      <span className="text-sm font-medium text-[var(--text)] min-w-[3rem] text-right">
        {fmtPct(occupancy)}
      </span>
    </div>
  );
}

// Sort icon component
function SortIcon({ field, currentField, direction }: { 
  field: SortField; 
  currentField: SortField; 
  direction: SortDirection; 
}) {
  if (field !== currentField) {
    return <span className="text-[var(--text-dim)] opacity-50">↕</span>;
  }
  
  return (
    <span className="text-[var(--altus-gold)]">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

export function OccupancyByCity({ occupancy30 }: OccupancyByCityProps) {
  const [sortField, setSortField] = useState<SortField>('occupancy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'city' ? 'asc' : 'desc');
    }
  };
  
  // Sort data
  const sortedData = [...occupancy30.byCity].sort((a, b) => {
    let valueA: number | string;
    let valueB: number | string;
    
    switch (sortField) {
      case 'city':
        valueA = a.city.toLowerCase();
        valueB = b.city.toLowerCase();
        break;
      case 'properties':
        valueA = a.properties;
        valueB = b.properties;
        break;
      case 'occupancy':
        valueA = a.occupancy;
        valueB = b.occupancy;
        break;
      case 'totalUnits':
        valueA = a.totalUnits;
        valueB = b.totalUnits;
        break;
      default:
        return 0;
    }
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    }
  });
  
  // Calculate totals
  const totals = occupancy30.byCity.reduce((acc, city) => ({
    properties: acc.properties + city.properties,
    occupiedUnits: acc.occupiedUnits + city.occupiedUnits,
    totalUnits: acc.totalUnits + city.totalUnits,
  }), { properties: 0, occupiedUnits: 0, totalUnits: 0 });
  
  const overallOccupancy = totals.totalUnits > 0 
    ? (totals.occupiedUnits / totals.totalUnits) * 100 
    : 0;
  
  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
            Occupancy by City
          </h3>
          <p className="text-sm text-[var(--text-dim)]">
            Portfolio performance across markets
          </p>
        </div>
        <Link href="/analytics/occupancy">
          <button className="text-xs text-[var(--altus-gold)] hover:underline">
            View Analytics →
          </button>
        </Link>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-[var(--line)]">
        <table className="w-full">
          <thead className="bg-[var(--panel-elev)]">
            <tr>
              <th className="text-left px-4 py-3 border-b border-[var(--line)]">
                <button 
                  onClick={() => handleSort('city')}
                  className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] uppercase tracking-wide hover:text-[var(--altus-gold)] transition-colors"
                >
                  City
                  <SortIcon field="city" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="text-right px-4 py-3 border-b border-[var(--line)]">
                <button 
                  onClick={() => handleSort('properties')}
                  className="flex items-center justify-end gap-2 text-xs font-semibold text-[var(--text)] uppercase tracking-wide hover:text-[var(--altus-gold)] transition-colors"
                >
                  Properties
                  <SortIcon field="properties" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="text-right px-4 py-3 border-b border-[var(--line)]">
                <button 
                  onClick={() => handleSort('totalUnits')}
                  className="flex items-center justify-end gap-2 text-xs font-semibold text-[var(--text)] uppercase tracking-wide hover:text-[var(--altus-gold)] transition-colors"
                >
                  Units
                  <SortIcon field="totalUnits" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="text-right px-4 py-3 border-b border-[var(--line)]">
                <button 
                  onClick={() => handleSort('occupancy')}
                  className="flex items-center justify-end gap-2 text-xs font-semibold text-[var(--text)] uppercase tracking-wide hover:text-[var(--altus-gold)] transition-colors"
                >
                  Occupancy
                  <SortIcon field="occupancy" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((city, index) => (
              <tr 
                key={city.city}
                className={`${
                  index % 2 === 0 ? 'bg-[var(--panel-bg)]' : 'bg-[var(--panel-elev)]'
                } hover:bg-[var(--panel-elev-hover)] transition-colors`}
              >
                <td className="px-4 py-3 border-b border-[var(--line)]">
                  <Link href={`/portfolio/properties?city=${encodeURIComponent(city.city)}`}>
                    <button className="text-sm font-medium text-[var(--text)] hover:text-[var(--altus-gold)] transition-colors text-left">
                      {city.city}
                    </button>
                  </Link>
                </td>
                <td className="px-4 py-3 border-b border-[var(--line)] text-right">
                  <span className="text-sm text-[var(--text)]">
                    {city.properties}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-[var(--line)] text-right">
                  <div className="text-sm text-[var(--text)]">
                    <span className="font-medium">{city.occupiedUnits}</span>
                    <span className="text-[var(--text-dim)]"> / {city.totalUnits}</span>
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-[var(--line)]">
                  <OccupancyProgressBar occupancy={city.occupancy} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[var(--panel-elev)] border-t-2 border-[var(--altus-gold)]">
            <tr>
              <td className="px-4 py-3 font-semibold text-[var(--text)]">
                Portfolio Total
              </td>
              <td className="px-4 py-3 text-right font-semibold text-[var(--text)]">
                {totals.properties}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-[var(--text)]">
                <span>{totals.occupiedUnits}</span>
                <span className="text-[var(--text-dim)]"> / {totals.totalUnits}</span>
              </td>
              <td className="px-4 py-3">
                <OccupancyProgressBar occupancy={overallOccupancy} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}