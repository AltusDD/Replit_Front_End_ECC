// PortfolioMap.tsx - Genesis specification with clustering and live data
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ActionButton } from './ActionButton';

interface PropertyData {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  units: number;
  occPct: number;
  active: boolean;
}

interface PortfolioMapProps {
  properties: PropertyData[];
}

// Enhanced property status calculation
function getPropertyStatus(property: PropertyData): 'occupied' | 'vacant' | 'mixed' {
  if (property.occPct >= 90) return 'occupied';
  if (property.occPct <= 10) return 'vacant';
  return 'mixed';
}

function MapContent({ properties }: PortfolioMapProps) {
  // Fix Leaflet default markers in React
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const [selectedCity, setSelectedCity] = useState<string>('all');
  
  // Get unique cities
  const cities = useMemo(() => {
    if (!properties || !Array.isArray(properties)) return ['all'];
    const citySet = new Set(properties.map(p => p.city).filter(Boolean));
    return ['all', ...Array.from(citySet).sort()];
  }, [properties]);

  // Generate coordinates for properties (since live API doesn't have lat/lng yet)
  const propertiesWithCoords = useMemo(() => {
    return properties.map(property => {
      // City center coordinates for Texas cities
      const cityCoords: Record<string, [number, number]> = {
        'Austin': [30.2672, -97.7431],
        'Dallas': [32.7767, -96.7970],
        'Houston': [29.7604, -95.3698],
        'San Antonio': [29.4241, -98.4936],
        'Fort Worth': [32.7555, -97.3308],
        'El Paso': [31.7619, -106.4850],
        'Arlington': [32.7357, -97.1081],
        'Corpus Christi': [27.8006, -97.3964],
        'Plano': [33.0198, -96.6989],
        'Lubbock': [33.5779, -101.8552],
      };

      const baseCoords = cityCoords[property.city] || [29.7604, -95.3698]; // Default to Houston
      
      // Add small random offset for clustering
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      
      return {
        ...property,
        lat: baseCoords[0] + latOffset,
        lng: baseCoords[1] + lngOffset,
      };
    });
  }, [properties]);

  // Filter properties by selected city
  const filteredProperties = useMemo(() => {
    return selectedCity === 'all' 
      ? propertiesWithCoords 
      : propertiesWithCoords.filter(p => p.city === selectedCity);
  }, [propertiesWithCoords, selectedCity]);

  // Calculate map bounds
  const bounds = useMemo(() => {
    if (filteredProperties.length === 0) return undefined;
    
    const lats = filteredProperties.map(p => p.lat);
    const lngs = filteredProperties.map(p => p.lng);
    
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ] as [[number, number], [number, number]];
  }, [filteredProperties]);

  // Create custom icons based on occupancy
  const createIcon = (occPct: number) => {
    let color = '#31c48d'; // Green for occupied
    if (occPct < 90 && occPct > 10) color = '#f3c969'; // Yellow for mixed
    if (occPct <= 10) color = '#ef5953'; // Red for vacant
    
    return L.divIcon({
      html: `<div style="
        width: 16px; 
        height: 16px; 
        background: ${color}; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      className: 'custom-div-icon',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  const center: [number, number] = bounds 
    ? [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
    : [29.7604, -95.3698]; // Default to Houston

  return (
    <div>
      <div className="mb-4">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-[var(--panel-elev)] text-[var(--text)] border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--altus-gold)] focus:border-transparent"
        >
          <option value="all">All Cities ({properties.length} properties)</option>
          {cities.slice(1).map(city => {
            const count = properties.filter(p => p.city === city).length;
            return (
              <option key={city} value={city}>
                {city} ({count} properties)
              </option>
            );
          })}
        </select>
      </div>
      
      <div className="portfolio-map">
        {filteredProperties.length === 0 ? (
          <div className="w-full h-full bg-[var(--panel-elev)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-[var(--text)] mb-2">🏢</div>
              <div className="text-[var(--text-dim)] text-sm">
                No properties to display
              </div>
            </div>
          </div>
        ) : (
          <MapContainer
            center={center}
            zoom={10}
            bounds={bounds}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {filteredProperties.map((property) => (
              <Marker
                key={property.id}
                position={[property.lat, property.lng]}
                icon={createIcon(property.occPct)}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-semibold text-black mb-1">
                      {property.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {property.city}, {property.state} {property.zip}
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Occupancy</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-full bg-green-500 rounded" 
                            style={{ width: `${property.occPct}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{property.occPct.toFixed(1)}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(property.units * property.occPct / 100)} of {property.units} units
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <ActionButton
                        size="sm"
                        onClick={() => window.open(`/portfolio/properties?focus=${property.id}`, '_blank')}
                      >
                        View Property
                      </ActionButton>
                      <ActionButton
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(`/maintenance?property=${property.id}`, '_blank')}
                      >
                        Work Orders
                      </ActionButton>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export function PortfolioMap({ properties }: PortfolioMapProps) {
  return (
    <Suspense fallback={
      <div className="portfolio-map bg-[var(--panel-elev)] flex items-center justify-center">
        <div className="text-[var(--text-dim)]">Loading map...</div>
      </div>
    }>
      <MapContent properties={properties} />
    </Suspense>
  );
}