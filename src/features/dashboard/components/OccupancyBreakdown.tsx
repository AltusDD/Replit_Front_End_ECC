// src/features/dashboard/components/OccupancyBreakdown.tsx
import React from 'react';
import { useLocation } from 'wouter';
import { ChartContainer } from './ChartContainer';
import type { DashboardProperty } from '../api/mock-data';

interface OccupancyBreakdownProps {
  properties: DashboardProperty[];
}

interface CityData {
  city: string;
  totalProperties: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalUnits: number;
  occupancyPct: number;
}

export function OccupancyBreakdown({ properties }: OccupancyBreakdownProps) {
  const [, navigate] = useLocation();

  // Group properties by city and calculate occupancy
  const cityData = React.useMemo(() => {
    const grouped = properties.reduce((acc, property) => {
      if (!acc[property.city]) {
        acc[property.city] = {
          city: property.city,
          totalProperties: 0,
          occupiedUnits: 0,
          vacantUnits: 0,
          totalUnits: 0,
        };
      }

      const cityStats = acc[property.city];
      cityStats.totalProperties += 1;
      cityStats.totalUnits += property.units;

      if (property.status === 'occupied') {
        cityStats.occupiedUnits += property.units;
      } else {
        cityStats.vacantUnits += property.units;
      }

      return acc;
    }, {} as Record<string, Omit<CityData, 'occupancyPct'>>);

    // Calculate occupancy percentages and sort by city name
    return Object.values(grouped)
      .map(city => ({
        ...city,
        occupancyPct: city.totalUnits > 0 ? (city.occupiedUnits / city.totalUnits) * 100 : 0,
      }))
      .sort((a, b) => a.city.localeCompare(b.city));
  }, [properties]);

  const handleCityClick = (cityName: string) => {
    navigate(`/portfolio/properties?city=${encodeURIComponent(cityName)}`);
  };

  const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="progress">
      <div 
        className="progress__fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  return (
    <ChartContainer title="Occupancy Breakdown by City">
      <div className="overflow-x-auto">
        <table className="occupancy-table">
          <thead>
            <tr>
              <th>Location</th>
              <th className="text-center"># Properties</th>
              <th className="text-center">Occupied Units</th>
              <th className="text-center">Vacant Units</th>
              <th className="text-center">Occupancy %</th>
            </tr>
          </thead>
          <tbody>
            {cityData.map((city) => (
              <tr 
                key={city.city}
                onClick={() => handleCityClick(city.city)}
                className="cursor-pointer"
                data-testid={`city-row-${city.city.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <td>
                  <div className="font-medium text-[var(--altus-text)]">
                    {city.city}
                  </div>
                </td>
                <td className="text-center text-[var(--altus-text)]">
                  {city.totalProperties}
                </td>
                <td className="text-center text-[var(--altus-text)]">
                  {city.occupiedUnits}
                </td>
                <td className="text-center text-[var(--altus-text)]">
                  {city.vacantUnits}
                </td>
                <td className="text-center">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <ProgressBar percentage={city.occupancyPct} />
                    </div>
                    <span className="text-sm font-medium text-[var(--altus-text)] min-w-[3rem]">
                      {city.occupancyPct.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {cityData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-[var(--altus-muted)] py-8">
                  No property data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-[var(--altus-grey-700)] rounded-lg">
          <div className="text-lg font-bold text-[var(--altus-text)]">
            {cityData.length}
          </div>
          <div className="text-xs text-[var(--altus-muted)] uppercase tracking-wide">
            Cities
          </div>
        </div>
        <div className="text-center p-3 bg-[var(--altus-grey-700)] rounded-lg">
          <div className="text-lg font-bold text-[var(--altus-text)]">
            {cityData.reduce((sum, city) => sum + city.totalProperties, 0)}
          </div>
          <div className="text-xs text-[var(--altus-muted)] uppercase tracking-wide">
            Properties
          </div>
        </div>
        <div className="text-center p-3 bg-[var(--altus-grey-700)] rounded-lg">
          <div className="text-lg font-bold text-[var(--altus-text)]">
            {cityData.reduce((sum, city) => sum + city.totalUnits, 0)}
          </div>
          <div className="text-xs text-[var(--altus-muted)] uppercase tracking-wide">
            Total Units
          </div>
        </div>
        <div className="text-center p-3 bg-[var(--altus-grey-700)] rounded-lg">
          <div className="text-lg font-bold text-[var(--altus-text)]">
            {cityData.reduce((sum, city) => sum + city.occupiedUnits, 0)}
          </div>
          <div className="text-xs text-[var(--altus-muted)] uppercase tracking-wide">
            Occupied
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}