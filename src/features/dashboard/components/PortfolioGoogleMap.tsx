// Genesis Grade Portfolio Google Map - Interactive Property Visualization

import React, { useState, useMemo, useCallback } from 'react';
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import type { MapProperty } from '../hooks/useDashboardData';
import { ActionButton } from './ActionButton';

interface PortfolioGoogleMapProps {
  propertiesForMap: MapProperty[];
}

// Custom Property Pin Component
function PropertyPin({ status }: { status: MapProperty['status'] }) {
  const statusClasses = {
    'occupied': 'map-pin--occupied',
    'vacant': 'map-pin--vacant',
    'delinquent': 'map-pin--delinquent',
    'rent-ready': 'map-pin--rent-ready'
  };

  return (
    <div className={`map-pin ${statusClasses[status]}`}>
      <div className="w-2 h-2 rounded-full bg-white"></div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: MapProperty['status'] }) {
  const statusConfig = {
    'occupied': { label: 'Occupied', class: 'status-badge--occupied' },
    'vacant': { label: 'Vacant', class: 'status-badge--vacant' },
    'delinquent': { label: 'Delinquent', class: 'status-badge--delinquent' },
    'rent-ready': { label: 'Rent Ready', class: 'status-badge--rent-ready' }
  };

  const config = statusConfig[status];

  return (
    <span className={`map-info-window__status ${config.class}`}>
      {config.label}
    </span>
  );
}

// Info Window Content Component
function PropertyInfoWindow({ property, onClose }: { property: MapProperty; onClose: () => void }) {
  return (
    <div className="map-info-window">
      <div className="map-info-window__title">
        {property.address}
      </div>
      
      <div className="mb-3">
        <StatusBadge status={property.status} />
        {property.rentReady && (
          <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            Market Ready
          </span>
        )}
      </div>
      
      {property.currentTenant && (
        <div className="text-sm text-[var(--text-dim)] mb-3">
          Current Tenant: <span className="font-medium text-[var(--text)]">{property.currentTenant}</span>
        </div>
      )}
      
      <div className="flex gap-2 flex-wrap">
        <ActionButton
          variant="primary"
          size="small"
          href={`/card/property/${property.id}`}
        >
          View Details
        </ActionButton>
        <ActionButton
          variant="secondary"
          size="small"
          href={`/portfolio/units?property_id=${property.id}`}
        >
          View Units
        </ActionButton>
        <ActionButton
          variant="secondary"
          size="small"
          href={`/maintenance/new?property_id=${property.id}`}
        >
          New Work Order
        </ActionButton>
      </div>
    </div>
  );
}

export function PortfolioGoogleMap({ propertiesForMap }: PortfolioGoogleMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Check for API key
  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (!propertiesForMap.length) {
      return { lat: 33.7490, lng: -84.3880 }; // Default to Atlanta
    }
    
    const avgLat = propertiesForMap.reduce((sum, p) => sum + p.lat, 0) / propertiesForMap.length;
    const avgLng = propertiesForMap.reduce((sum, p) => sum + p.lng, 0) / propertiesForMap.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [propertiesForMap]);

  // Dark theme map styles for Genesis
  const darkMapStyles = useMemo(() => [
    { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
    {
      featureType: 'administrative.land_parcel',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'administrative.neighborhood',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#2d2d2d' }]
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#3a3a3a' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'road.local',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#0d1421' }]
    }
  ], []);

  const handleMarkerClick = useCallback((property: MapProperty) => {
    setSelectedProperty(property);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Loading state
  if (!propertiesForMap?.length) {
    return (
      <div className="ecc-panel p-6">
        <div className="portfolio-map flex items-center justify-center bg-[var(--panel-elev)] rounded-lg">
          <div className="text-center">
            <div className="text-[var(--text-dim)] mb-2">Loading portfolio map...</div>
            <div className="skeleton h-4 w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // API key missing state
  if (!hasApiKey) {
    return (
      <div className="ecc-panel p-6">
        <div className="portfolio-map flex items-center justify-center bg-[var(--panel-elev)] rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-[var(--text)] mb-2">
              Portfolio Map Integration
            </div>
            <div className="text-sm text-[var(--text-dim)] mb-4">
              Google Maps API key required to display interactive property locations
            </div>
            <ActionButton variant="primary" href="/system/settings">
              Configure API Key
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ecc-panel p-6" data-testid="portfolio-google-map">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="ecc-panel__title">
            Portfolio Map
          </h2>
          <p className="ecc-panel__subtitle">
            {propertiesForMap.length} properties with real-time status
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full map-pin--occupied"></div>
            <span className="text-[var(--text-dim)]">Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full map-pin--rent-ready"></div>
            <span className="text-[var(--text-dim)]">Rent Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full map-pin--vacant"></div>
            <span className="text-[var(--text-dim)]">Vacant</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full map-pin--delinquent"></div>
            <span className="text-[var(--text-dim)]">Delinquent</span>
          </div>
        </div>
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
          onLoad={setMapInstance}
        >
          {propertiesForMap.map((property) => (
            <AdvancedMarker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => handleMarkerClick(property)}
            >
              <PropertyPin status={property.status} />
            </AdvancedMarker>
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
              onCloseClick={handleInfoWindowClose}
              maxWidth={300}
            >
              <PropertyInfoWindow 
                property={selectedProperty} 
                onClose={handleInfoWindowClose}
              />
            </InfoWindow>
          )}
        </Map>
      </div>
    </div>
  );
}