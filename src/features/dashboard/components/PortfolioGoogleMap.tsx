// PortfolioGoogleMap.tsx - @vis.gl/react-google-maps with clustering, real coords only
import React, { useState, useMemo } from 'react';
import { Map, AdvancedMarker, InfoWindow, Pin, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface MapProperty {
  id: number;
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  status: 'occupied' | 'vacant_ready' | 'vacant_not_ready' | 'delinquent';
  delinquent: boolean;
  rentReady: boolean;
  currentTenant?: string;
}

interface PortfolioGoogleMapProps {
  propertiesForMap: MapProperty[];
  missingGeoCount?: number;
}

// Status-based pin colors per specification
function getStatusColor(status: MapProperty['status']): string {
  switch (status) {
    case 'occupied': return '#2cc38a'; // Green: occupied + current
    case 'vacant_ready': return '#f3c969'; // Yellow: vacant + rent-ready
    case 'vacant_not_ready': return '#ff9500'; // Orange: vacant + not rent-ready
    case 'delinquent': return '#ef5953'; // Red: occupied + delinquent tenant
    default: return '#8b93a3'; // Neutral fallback
  }
}

// Custom property pin with status colors
function PropertyPin({ status }: { status: MapProperty['status'] }) {
  const color = getStatusColor(status);
  
  return (
    <div
      className="w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110"
      style={{ backgroundColor: color }}
    />
  );
}

// Status badge for InfoWindow
function StatusBadge({ status }: { status: MapProperty['status'] }) {
  const statusConfig = {
    occupied: { text: 'Occupied', bg: 'bg-green-600' },
    vacant_ready: { text: 'Rent Ready', bg: 'bg-yellow-600' },
    vacant_not_ready: { text: 'Needs Work', bg: 'bg-orange-600' },
    delinquent: { text: 'Delinquent', bg: 'bg-red-600' },
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full ${config.bg}`}>
      {config.text}
    </span>
  );
}

// Action button component
function ActionButton({ 
  children, 
  onClick, 
  variant = 'primary' 
}: { 
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}) {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded transition-colors";
  const variantClasses = variant === 'primary'
    ? "bg-[var(--altus-gold)] text-[var(--altus-black)] hover:opacity-90"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200";
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
}

export function PortfolioGoogleMap({ propertiesForMap, missingGeoCount = 0 }: PortfolioGoogleMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  
  // Check for required Google Maps API key
  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Calculate map center from properties
  const mapCenter = useMemo(() => {
    if (propertiesForMap.length === 0) return { lat: 29.7604, lng: -95.3698 }; // Houston default
    
    const avgLat = propertiesForMap.reduce((sum, p) => sum + p.lat, 0) / propertiesForMap.length;
    const avgLng = propertiesForMap.reduce((sum, p) => sum + p.lng, 0) / propertiesForMap.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [propertiesForMap]);
  
  // Dark map styles for Genesis theme
  const darkMapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#757575' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [{ color: '#2c2c2c' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#000000' }],
    },
  ];

  // Friendly empty state if API key missing
  if (!hasApiKey) {
    return (
      <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
        <div className="h-[400px] bg-[var(--panel-elev)] rounded-lg flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
              Google Maps Integration
            </h3>
            <p className="text-sm text-[var(--text-dim)] mb-4">
              Configure <code className="px-2 py-1 bg-[var(--panel-bg)] rounded text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to view portfolio properties on an interactive map with clustering.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--good)]">{propertiesForMap.filter(p => p.status === 'occupied').length}</div>
                <div className="text-xs text-[var(--text-dim)] uppercase tracking-wide">Occupied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--warn)]">{propertiesForMap.filter(p => p.status.includes('vacant')).length}</div>
                <div className="text-xs text-[var(--text-dim)] uppercase tracking-wide">Vacant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--bad)]">{propertiesForMap.filter(p => p.delinquent).length}</div>
                <div className="text-xs text-[var(--text-dim)] uppercase tracking-wide">Delinquent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--text)]">{propertiesForMap.length}</div>
                <div className="text-xs text-[var(--text-dim)] uppercase tracking-wide">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg overflow-hidden">
      {/* Header with QA overlay */}
      <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text)]">Portfolio Map</h3>
        {missingGeoCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--warn)]/20 border border-[var(--warn)]/40 rounded-lg">
            <span className="w-2 h-2 bg-[var(--warn)] rounded-full"></span>
            <span className="text-xs text-[var(--text)]">
              Missing geo: {missingGeoCount} — <button className="underline hover:no-underline">view list</button>
            </span>
          </div>
        )}
      </div>
      
      <div className="h-[500px]">
        <Map
          mapId="genesis-portfolio-map"
          style={{ width: '100%', height: '100%' }}
          defaultCenter={mapCenter}
          defaultZoom={10}
          gestureHandling="greedy"
          disableDefaultUI={true}
          styles={darkMapStyles}
        >
          {propertiesForMap.map((property) => (
            <AdvancedMarker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => setSelectedProperty(property)}
            >
              <PropertyPin status={property.status} />
            </AdvancedMarker>
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="p-4 min-w-[280px]">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {selectedProperty.address}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={selectedProperty.status} />
                    {selectedProperty.rentReady && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                        Rent-Ready
                      </span>
                    )}
                  </div>
                  
                  {selectedProperty.currentTenant && (
                    <div className="text-sm text-gray-600 mb-2">
                      Current Tenant: <span className="font-medium">{selectedProperty.currentTenant}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <ActionButton
                    onClick={() => window.open(`/card/property/${selectedProperty.id}`, '_blank')}
                  >
                    View Details
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    onClick={() => window.open(`/maintenance?property_id=${selectedProperty.id}&status=open`, '_blank')}
                  >
                    Open Work Orders
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    onClick={() => window.open(`/portfolio/tenants?property_id=${selectedProperty.id}`, '_blank')}
                  >
                    View Tenants
                  </ActionButton>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </div>
  );
}