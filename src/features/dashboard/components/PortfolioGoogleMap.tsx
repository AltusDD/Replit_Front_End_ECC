// Portfolio Google Map - @vis.gl implementation with status pins

import { useState, useMemo } from 'react';
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { DashboardData } from '../hooks/useDashboardData';

interface PortfolioGoogleMapProps {
  propertiesForMap: DashboardData['propertiesForMap'];
  missingGeoCount?: number;
}

// Property pin component with status colors
function PropertyPin({ status }: { status: 'occupied' | 'vacant' | 'delinquent' }) {
  const statusConfig = {
    occupied: { bg: 'bg-[var(--good)]', border: 'border-[var(--good)]' },
    vacant: { bg: 'bg-[var(--warn)]', border: 'border-[var(--warn)]' },
    delinquent: { bg: 'bg-[var(--bad)]', border: 'border-[var(--bad)]' },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`w-4 h-4 rounded-full ${config.bg} border-2 border-white shadow-lg`} />
  );
}

// Status badge component
function StatusBadge({ status }: { status: 'occupied' | 'vacant' | 'delinquent' }) {
  const statusConfig = {
    occupied: { bg: 'bg-[var(--good)]', text: 'Occupied' },
    vacant: { bg: 'bg-[var(--warn)]', text: 'Vacant' },
    delinquent: { bg: 'bg-[var(--bad)]', text: 'Delinquent' },
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
  // Handle loading state
  if (!propertiesForMap || propertiesForMap.length === 0) {
    return (
      <div className="ecc-panel p-6">
        <div className="portfolio-map bg-[var(--panel-elev)] rounded-lg flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-[var(--text-dim)]">Loading map data...</div>
          </div>
        </div>
      </div>
    );
  }
  const [selectedProperty, setSelectedProperty] = useState<DashboardData['propertiesForMap'][0] | null>(null);
  
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

  // Friendly state if API key missing
  if (!hasApiKey) {
    return (
      <div className="portfolio-map ecc-panel p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2 font-medium">Google Maps Integration</div>
          <div className="text-sm text-[var(--text-dim)]">
            Set <code>VITE_GOOGLE_MAPS_API_KEY</code> to render the live portfolio map with clustering.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ecc-panel p-6" data-testid="portfolio-google-map">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="ecc-panel__title text-lg mb-1">
            Portfolio Map
          </h2>
          <p className="text-sm text-[var(--text-dim)]">
            {propertiesForMap.length} properties with coordinates
          </p>
        </div>
        
        {missingGeoCount > 0 && (
          <div className="text-xs">
            <span className="inline-flex items-center px-2 py-1 bg-[var(--altus-gold)] text-[var(--altus-black)] rounded-md font-medium">
              Missing geo: {missingGeoCount} — <button className="underline hover:no-underline">view list</button>
            </span>
          </div>
        )}
      </div>
      
      <div className="portfolio-map">
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
                    onClick={() => window.open(`/portfolio/units?property_id=${selectedProperty.id}`, '_blank')}
                  >
                    View Unit(s)
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    onClick={() => window.open(`/maintenance/new?property_id=${selectedProperty.id}`, '_blank')}
                  >
                    New WO
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