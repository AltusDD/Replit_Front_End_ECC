// PortfolioGoogleMap.tsx - Genesis specification with Google Maps API and clustering
import React, { useState, useMemo } from 'react';
import { Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { ActionButton } from './ActionButton';

interface MapProperty {
  id: string;
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
}

// Custom house SVG icon for properties
function HouseIcon({ status }: { status: MapProperty['status'] }) {
  const colors = {
    occupied: '#31c48d',          // Green
    vacant_ready: '#f3c969',      // Yellow  
    vacant_not_ready: '#ff8c42',  // Orange
    delinquent: '#ef5953',        // Red
  };
  
  const color = colors[status];
  
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2L2 8v13a1 1 0 001 1h5v-7h8v7h5a1 1 0 001-1V8l-10-6z" 
        fill={color}
        stroke="white"
        strokeWidth="1.5"
      />
      <path 
        d="M9 13h6v8H9v-8z" 
        fill={color}
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
}

// Status badge component
function StatusBadge({ status }: { status: MapProperty['status'] }) {
  const statusConfig = {
    occupied: { label: 'Occupied', bg: 'bg-green-600', text: 'Current' },
    vacant_ready: { label: 'Vacant - Ready', bg: 'bg-yellow-600', text: 'Rent Ready' },
    vacant_not_ready: { label: 'Vacant - Not Ready', bg: 'bg-orange-600', text: 'Needs Work' },
    delinquent: { label: 'Occupied - Delinquent', bg: 'bg-red-600', text: 'Past Due' },
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full ${config.bg}`}>
      {config.text}
    </span>
  );
}

export function PortfolioGoogleMap({ propertiesForMap }: PortfolioGoogleMapProps) {
  if (!propertiesForMap || propertiesForMap.length === 0) {
    return (
      <div className="h-[500px] bg-[var(--panel-bg)] rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            No Properties Found
          </h3>
          <p className="text-sm text-[var(--text-dim)]">
            Portfolio data is loading or no properties are available.
          </p>
        </div>
      </div>
    );
  }
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  
  // Check for Google Maps API key
  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Calculate map center
  const mapCenter = useMemo(() => {
    if (propertiesForMap.length === 0) return { lat: 29.7604, lng: -95.3698 }; // Houston default
    
    const avgLat = propertiesForMap.reduce((sum, p) => sum + p.lat, 0) / propertiesForMap.length;
    const avgLng = propertiesForMap.reduce((sum, p) => sum + p.lng, 0) / propertiesForMap.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [propertiesForMap]);
  
  // Dark map theme
  const mapStyles = [
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

  // Fallback for missing API key
  if (!hasApiKey) {
    return (
      <div className="ecc-panel p-6">
        <div className="h-[400px] bg-[var(--panel-elev)] rounded-lg flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="ecc-panel__title mb-2">
              Google Maps Integration
            </h3>
            <p className="text-sm text-[var(--text-dim)] mb-4">
              Configure <code className="px-2 py-1 bg-[var(--panel-bg)] rounded text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to view portfolio properties on an interactive map.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="number-lg text-[var(--good)]">{propertiesForMap.filter(p => p.status === 'occupied').length}</div>
                <div className="small-label">Occupied</div>
              </div>
              <div className="text-center">
                <div className="number-lg text-[var(--warn)]">{propertiesForMap.filter(p => p.status.includes('vacant')).length}</div>
                <div className="small-label">Vacant</div>
              </div>
              <div className="text-center">
                <div className="number-lg text-[var(--bad)]">{propertiesForMap.filter(p => p.delinquent).length}</div>
                <div className="small-label">Delinquent</div>
              </div>
              <div className="text-center">
                <div className="number-lg text-[var(--text)]">{propertiesForMap.length}</div>
                <div className="small-label">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ecc-panel overflow-hidden">
      <div className="h-[500px] rounded-lg overflow-hidden">
        <Map
          mapId="genesis-portfolio-map"
          style={{ width: '100%', height: '100%' }}
          defaultCenter={mapCenter}
          defaultZoom={10}
          gestureHandling="greedy"
          disableDefaultUI={true}
          styles={mapStyles}
          backgroundColor="var(--panel-bg)"
        >
        {propertiesForMap.map((property) => (
          <AdvancedMarker
            key={property.id}
            position={{ lat: property.lat, lng: property.lng }}
            onClick={() => setSelectedProperty(property)}
          >
            <Pin background="transparent" borderColor="transparent">
              <HouseIcon status={property.status} />
            </Pin>
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
                </div>
                
                {selectedProperty.currentTenant && (
                  <div className="text-sm text-gray-600 mb-2">
                    Current Tenant: <span className="font-medium">{selectedProperty.currentTenant}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <ActionButton
                  size="sm"
                  onClick={() => window.open(`/portfolio/properties?focus=${selectedProperty.id}`, '_blank')}
                >
                  View Property
                </ActionButton>
                <ActionButton
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(`/construction?property=${selectedProperty.id}`, '_blank')}
                >
                  Work Orders
                </ActionButton>
                {selectedProperty.delinquent && (
                  <ActionButton
                    size="sm"
                    variant="danger"
                    onClick={() => window.open(`/accounting?property=${selectedProperty.id}`, '_blank')}
                  >
                    View Ledger
                  </ActionButton>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
        </Map>
      </div>
    </div>
  );
}