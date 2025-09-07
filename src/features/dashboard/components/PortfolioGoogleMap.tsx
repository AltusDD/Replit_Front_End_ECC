// Genesis Grade Portfolio Google Map - Interactive Property Visualization

import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useDashboardData, type MapDataProperty } from '../hooks/useDashboardData';

// Pin colors based on property status
const getPinColor = (status: MapDataProperty['status']): string => {
  switch (status) {
    case 'occupied-current': return '#2fc78d'; // --good
    case 'vacant-ready': return '#f3c969'; // --warn
    case 'vacant-down': return '#ef5953'; // --bad
    case 'delinquent': return '#ef5953'; // --bad
    default: return '#8a93a1'; // --neutral
  }
};

// Custom Pin Component
function PropertyPin({ status }: { status: MapDataProperty['status'] }) {
  const color = getPinColor(status);
  
  return (
    <div 
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}
    />
  );
}

export function PortfolioGoogleMap() {
  const { mapData } = useDashboardData();
  
  // Check for Google Maps API key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="map-fallback">
        <div className="map-fallback__icon">🗺️</div>
        <div className="map-fallback__title">Google Maps API Key is not configured.</div>
        <div className="map-fallback__subtitle">
          Configure your API key to view the interactive property map.
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 41.8781, lng: -87.6298 }}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {mapData.map((property) => (
            <AdvancedMarker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
            >
              <PropertyPin status={property.status} />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}