// OccupancyByCity.tsx - Genesis v2 specification table with gold progress bars
import React, { useState } from 'react';
import { fmtPct } from '../../../utils/format';

interface CityOccupancyData {
  city: string;
  properties: number;
  occUnits: number;
  vacUnits: number;
  occPct: number;
}

interface OccupancyByCityProps {
  occByCity: CityOccupancyData[];
}

type SortField = 'city' | 'properties' | 'occUnits' | 'vacUnits' | 'occPct';
type SortDirection = 'asc' | 'desc';

export function OccupancyByCity({ occByCity }: OccupancyByCityProps) {
  const [sortField, setSortField] = useState<SortField>('occPct');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  if (!occByCity) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
          Occupancy by City
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-[var(--panel-elev)] rounded-lg">
              <div className="bg-[var(--panel-bg)] h-4 w-20 rounded animate-pulse"></div>
              <div className="bg-[var(--panel-bg)] h-4 w-16 rounded animate-pulse"></div>
              <div className="bg-[var(--panel-bg)] h-4 w-24 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...occByCity].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }
    
    return ((aValue as number) - (bValue as number)) * modifier;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-[var(--text-dim)]">⇅</span>;
    return sortDirection === 'asc' ? 
      <span className="text-[var(--altus-gold)]">↑</span> : 
      <span className="text-[var(--altus-gold)]">↓</span>;
  };

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--line)]">
        <h3 className="text-lg font-semibold text-[var(--text)]">
          Occupancy by City
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--panel-elev)]">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-[var(--text)] uppercase tracking-wider cursor-pointer hover:bg-[var(--line)] transition-colors"
                onClick={() => handleSort('city')}
              >
                <div className="flex items-center gap-2">
                  City
                  <SortIcon field="city" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-[var(--text)] uppercase tracking-wider cursor-pointer hover:bg-[var(--line)] transition-colors"
                onClick={() => handleSort('properties')}
              >
                <div className="flex items-center justify-end gap-2">
                  # Properties
                  <SortIcon field="properties" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-[var(--text)] uppercase tracking-wider cursor-pointer hover:bg-[var(--line)] transition-colors"
                onClick={() => handleSort('occUnits')}
              >
                <div className="flex items-center justify-end gap-2">
                  Occ Units
                  <SortIcon field="occUnits" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-[var(--text)] uppercase tracking-wider cursor-pointer hover:bg-[var(--line)] transition-colors"
                onClick={() => handleSort('vacUnits')}
              >
                <div className="flex items-center justify-end gap-2">
                  Vac Units
                  <SortIcon field="vacUnits" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-[var(--text)] uppercase tracking-wider cursor-pointer hover:bg-[var(--line)] transition-colors"
                onClick={() => handleSort('occPct')}
              >
                <div className="flex items-center justify-end gap-2">
                  Occ %
                  <SortIcon field="occPct" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {sortedData.map((city, index) => (
              <tr 
                key={city.city} 
                className={`hover:bg-[var(--panel-elev)] cursor-pointer transition-colors ${
                  index % 2 === 0 ? 'bg-[var(--panel-bg)]' : 'bg-[var(--panel-elev)]'
                }`}
                onClick={() => window.open(`/portfolio/properties?city=${encodeURIComponent(city.city)}`, '_blank')}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[var(--text)]">
                    {city.city}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-[var(--text)]">
                    {city.properties}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-[var(--text)]">
                    {city.occUnits}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-[var(--text)]">
                    {city.vacUnits}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="flex-1 max-w-[100px]">
                      <div className="flex items-center">
                        <div className="flex-1 bg-[var(--line)] rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.max(0, city.occPct))}%`,
                              backgroundColor: 'var(--altus-gold)'
                            }}
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium text-[var(--text)] min-w-[45px]">
                          {fmtPct(city.occPct, 1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[var(--text-dim)]">
              No city data available
            </div>
          </div>
        )}
      </div>
    </div>
  );
}