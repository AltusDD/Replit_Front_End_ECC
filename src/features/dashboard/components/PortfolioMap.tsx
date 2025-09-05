// src/features/dashboard/components/PortfolioMap.tsx
import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import type { DashboardProperty } from '../api/mock-data';

// Import Leaflet components and CSS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PortfolioMapProps {
  properties: DashboardProperty[];
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
    const citySet = new Set(properties.map(p => p.city));
    return ['all', ...Array.from(citySet)];
  }, [properties]);

  // Filter properties by selected city and valid coordinates
  const filteredProperties = useMemo(() => {
    const filtered = selectedCity === 'all' 
      ? properties 
      : properties.filter(p => p.city === selectedCity);
    
    // Only include properties with valid coordinates
    return filtered.filter(p => 
      p.lat && p.lng && 
      !isNaN(p.lat) && !isNaN(p.lng) &&
      p.lat !== 0 && p.lng !== 0
    );
  }, [properties, selectedCity]);

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

  // Create custom icons for different statuses
  const createIcon = (status: DashboardProperty['status']) => {
    const colors = {
      occupied: '#1f6f4a', // green
      vacant: '#f59e0b',   // yellow
      delinquent: '#80343a' // red
    };
    
    return L.divIcon({
      html: `<div style="
        width: 14px; 
        height: 14px; 
        background: ${colors[status]}; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      className: 'custom-div-icon',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const getStatusLabel = (status: DashboardProperty['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const center: [number, number] = bounds 
    ? [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
    : [41.8781, -87.6298]; // Default to Chicago

  return (
    <div>
      <div className="mb-4">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-[var(--altus-grey-700)] text-[var(--altus-text)] border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--altus-gold)] focus:border-transparent"
          data-testid="city-filter"
        >
          <option value="all">All Cities</option>
          {cities.slice(1).map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      
      <div className="portfolio-map">
        {filteredProperties.length === 0 ? (
          <div className="w-full h-full bg-[var(--altus-grey-700)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-[var(--altus-text)] mb-2">📍</div>
              <div className="text-[var(--altus-muted)] text-sm">
                {selectedCity === 'all' ? 'No properties with coordinates' : `No properties in ${selectedCity} with coordinates`}
              </div>
            </div>
          </div>
        ) : (
          <MapContainer
            center={center}
            zoom={10}
            bounds={bounds}
            className="w-full h-full"
            data-testid="portfolio-map"
          >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={createIcon(property.status)}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-semibold text-black">
                    {property.address1}
                  </div>
                  <div className="text-sm text-gray-600">
                    {property.city}, {property.state} {property.zip}
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded text-white ${
                      property.status === 'occupied' ? 'bg-green-600' :
                      property.status === 'vacant' ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </div>
                  {property.status === 'occupied' && property.currentRent > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      Rent: ${property.currentRent.toLocaleString()}
                    </div>
                  )}
                  <a 
                    href={`/portfolio/properties?id=${property.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 block"
                    data-testid={`property-link-${property.id}`}
                  >
                    View Details
                  </a>
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
      <div className="portfolio-map bg-[var(--altus-grey-700)] flex items-center justify-center">
        <div className="text-[var(--altus-muted)]">Loading map...</div>
      </div>
    }>
      <MapContent properties={properties} />
    </Suspense>
  );
}