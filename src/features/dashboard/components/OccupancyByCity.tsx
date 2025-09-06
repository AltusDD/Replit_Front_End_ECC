// Occupancy by City - sortable table with progress bars

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { fmtPct } from '@/utils/format';
import type { DashboardData } from '../hooks/useDashboardData';

interface OccupancyByCityProps {
  occupancyData: DashboardData['occupancy30']['byCity'];
}

type SortField = 'city' | 'properties' | 'occupiedUnits' | 'totalUnits' | 'occupancy';
type SortDirection = 'asc' | 'desc';

// Sort icon component
function SortIcon({ direction }: { direction?: SortDirection }) {
  if (!direction) {
    return <span className="text-[var(--text-dim)] ml-1">↕</span>;
  }
  return (
    <span className="text-[var(--altus-gold)] ml-1">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

// Progress bar component
function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full bg-[var(--line)] rounded-full h-2">
      <div 
        className="bg-[var(--altus-gold)] h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
}

// Table row component
function CityRow({ 
  city, 
  properties, 
  occupiedUnits, 
  totalUnits, 
  occupancy,
  onClick
}: {
  city: string;
  properties: number;
  occupiedUnits: number;
  totalUnits: number;
  occupancy: number;
  onClick: () => void;
}) {
  return (
    <tr 
      className="border-b border-[var(--line)] hover:bg-[var(--panel-elev)] cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="py-3 px-4 text-sm font-medium text-[var(--text)]">
        {city}
      </td>
      <td className="py-3 px-4 text-sm text-[var(--text)] text-right">
        {properties}
      </td>
      <td className="py-3 px-4 text-sm text-[var(--text)] text-right">
        {occupiedUnits}
      </td>
      <td className="py-3 px-4 text-sm text-[var(--text)] text-right">
        {totalUnits - occupiedUnits}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm font-medium text-[var(--text)] min-w-[60px]">
            {fmtPct(occupancy)}
          </span>
          <div className="w-20">
            <ProgressBar percentage={occupancy} />
          </div>
        </div>
      </td>
    </tr>
  );
}

export function OccupancyByCity({ occupancyData }: OccupancyByCityProps) {
  const [sortField, setSortField] = useState<SortField>('occupancy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  // Handle column sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = occupancyData.filter(city => 
      city.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort data
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === 'city') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
    
    // Limit to top 10 unless showing all
    if (!showAll) {
      filtered = filtered.slice(0, 10);
    }
    
    return filtered;
  }, [occupancyData, sortField, sortDirection, searchTerm, showAll]);
  
  // Handle city row click
  const handleCityClick = (cityName: string) => {
    window.open(`/portfolio/properties?city=${encodeURIComponent(cityName)}`, '_blank');
  };
  
  return (
    <div className="ecc-panel p-6" data-testid="occupancy-by-city">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="ecc-panel__title text-lg mb-1">
            Occupancy by City
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            Portfolio performance across markets
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 text-sm bg-[var(--panel-elev)] border border-[var(--line)] rounded-lg text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--altus-gold)]"
            />
          </div>
          
          {/* Show all toggle */}
          {!showAll && occupancyData.length > 10 && (
            <button
              onClick={() => setShowAll(true)}
              className="px-3 py-2 text-xs text-[var(--altus-gold)] border border-[var(--altus-gold)]/40 rounded-lg hover:bg-[var(--altus-gold)]/10 transition-colors"
            >
              Show All ({occupancyData.length})
            </button>
          )}
        </div>
      </div>
      
      {processedData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏙️</div>
          <h3 className="text-lg font-medium text-[var(--text)] mb-2">
            No Cities Found
          </h3>
          <p className="text-sm text-[var(--text-dim)]">
            {searchTerm ? 'Try adjusting your search terms.' : 'No occupancy data available.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th 
                  className="py-3 px-4 text-left text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort('city')}
                >
                  City
                  <SortIcon direction={sortField === 'city' ? sortDirection : undefined} />
                </th>
                <th 
                  className="py-3 px-4 text-right text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort('properties')}
                >
                  # Properties
                  <SortIcon direction={sortField === 'properties' ? sortDirection : undefined} />
                </th>
                <th 
                  className="py-3 px-4 text-right text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort('occupiedUnits')}
                >
                  Occupied Units
                  <SortIcon direction={sortField === 'occupiedUnits' ? sortDirection : undefined} />
                </th>
                <th 
                  className="py-3 px-4 text-right text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort('totalUnits')}
                >
                  Vacant Units
                  <SortIcon direction={sortField === 'totalUnits' ? sortDirection : undefined} />
                </th>
                <th 
                  className="py-3 px-4 text-right text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider cursor-pointer hover:text-[var(--text)]"
                  onClick={() => handleSort('occupancy')}
                >
                  Occupancy %
                  <SortIcon direction={sortField === 'occupancy' ? sortDirection : undefined} />
                </th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((city) => (
                <CityRow
                  key={city.city}
                  city={city.city}
                  properties={city.properties}
                  occupiedUnits={city.occupiedUnits}
                  totalUnits={city.totalUnits}
                  occupancy={city.occupancy}
                  onClick={() => handleCityClick(city.city)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showAll && processedData.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="px-3 py-2 text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            Show Top 10 Only
          </button>
        </div>
      )}
    </div>
  );
}