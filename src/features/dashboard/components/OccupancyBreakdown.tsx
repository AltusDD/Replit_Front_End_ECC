// OccupancyBreakdown.tsx - Genesis specification table with progress bars and live data
import React from 'react';
import { ChartContainer } from './ChartContainer';

interface CityOccupancy {
  city: string;
  properties: number;
  occUnits: number;
  vacUnits: number;
  occPct: number;
}

interface OccupancyBreakdownProps {
  occByCity: CityOccupancy[];
}

export function OccupancyBreakdown({ occByCity }: OccupancyBreakdownProps) {
  const handleCityClick = (cityName: string) => {
    window.open(`/portfolio/properties?filter=city:${encodeURIComponent(cityName)}`, '_blank');
  };

  const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );

  // Calculate totals
  const totals = occByCity.reduce(
    (acc, city) => ({
      properties: acc.properties + city.properties,
      occUnits: acc.occUnits + city.occUnits,
      vacUnits: acc.vacUnits + city.vacUnits,
      totalUnits: acc.totalUnits + city.occUnits + city.vacUnits,
    }),
    { properties: 0, occUnits: 0, vacUnits: 0, totalUnits: 0 }
  );

  const overallOccPct = totals.totalUnits > 0 ? (totals.occUnits / totals.totalUnits) * 100 : 0;

  return (
    <div className="ecc-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="ecc-panel__title text-lg">Occupancy Breakdown</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="text-left py-3 px-2 small-label">Location</th>
              <th className="text-center py-3 px-2 small-label">Properties</th>
              <th className="text-center py-3 px-2 small-label">Occ Units</th>
              <th className="text-center py-3 px-2 small-label">Vac Units</th>
              <th className="text-center py-3 px-2 small-label">Occ %</th>
            </tr>
          </thead>
          <tbody>
            {occByCity.map((city) => (
              <tr 
                key={city.city}
                onClick={() => handleCityClick(city.city)}
                className="border-b border-[var(--line)] hover:bg-[var(--panel-elev)] cursor-pointer transition-colors"
              >
                <td className="py-3 px-2">
                  <div className="number-sm font-medium text-[var(--text)]">
                    {city.city}
                  </div>
                </td>
                <td className="text-center py-3 px-2">
                  <span className="number-sm text-[var(--text)]">
                    {city.properties}
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className="number-sm text-[var(--chart-green)]">
                    {city.occUnits}
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className="number-sm text-[var(--text-dim)]">
                    {city.vacUnits}
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-16">
                      <ProgressBar percentage={city.occPct} />
                    </div>
                    <span className="number-sm font-medium text-[var(--text)] min-w-[3rem]">
                      {city.occPct.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          
          {/* Totals Row */}
          <tfoot>
            <tr className="border-t-2 border-[var(--altus-gold)] bg-[var(--panel-elev)]">
              <td className="py-3 px-2">
                <div className="number-sm font-bold text-[var(--altus-gold)]">
                  Total Portfolio
                </div>
              </td>
              <td className="text-center py-3 px-2">
                <span className="number-sm font-bold text-[var(--altus-gold)]">
                  {totals.properties}
                </span>
              </td>
              <td className="text-center py-3 px-2">
                <span className="number-sm font-bold text-[var(--chart-green)]">
                  {totals.occUnits}
                </span>
              </td>
              <td className="text-center py-3 px-2">
                <span className="number-sm font-bold text-[var(--text-dim)]">
                  {totals.vacUnits}
                </span>
              </td>
              <td className="text-center py-3 px-2">
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-16">
                    <ProgressBar percentage={overallOccPct} />
                  </div>
                  <span className="number-sm font-bold text-[var(--altus-gold)] min-w-[3rem]">
                    {overallOccPct.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Empty State */}
      {occByCity.length === 0 && (
        <div className="text-center py-8">
          <div className="text-[var(--text-dim)] mb-2">📊</div>
          <div className="text-[var(--text-dim)] text-sm">
            No occupancy data available
          </div>
        </div>
      )}
    </div>
  );
}