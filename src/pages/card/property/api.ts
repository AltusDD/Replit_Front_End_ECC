import useSWR from 'swr';
import { PropertyCardDTO } from '../types';
import useCollection from '../../../features/data/useCollection';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// For now, use collection hooks to build the DTO
// Later this can be replaced with direct API calls
export function usePropertyCard(id: string) {
  const properties = useCollection<any>('/api/portfolio/properties');
  const units = useCollection<any>('/api/portfolio/units');
  const leases = useCollection<any>('/api/portfolio/leases');
  const tenants = useCollection<any>('/api/portfolio/tenants');
  const owners = useCollection<any>('/api/portfolio/owners');

  const data = React.useMemo(() => {
    if (!properties.data || !id) return null;
    
    const property = properties.data.find(p => p.id === id);
    if (!property) return null;

    // Build DTO from collection data
    const propertyUnits = (units.data || []).filter(u => u.property_id === id);
    const activeLeases = (leases.data || []).filter(l => 
      String(l.status).toLowerCase() === 'active' && 
      propertyUnits.some(u => u.id === l.unit_id)
    );
    const propertyTenants = (tenants.data || []).filter(t => 
      activeLeases.some(l => l.tenant_id === t.id)
    );
    const propertyOwner = owners.data?.find(o => o.id === property.owner_id);

    const occupancy = propertyUnits.length > 0 
      ? (activeLeases.length / propertyUnits.length) * 100 
      : 0;

    const dto: PropertyCardDTO = {
      id: property.id,
      title: property.name || property.address_line1 || 'Property',
      address: {
        line1: property.address_line1 || '',
        city: property.address_city || '',
        state: property.address_state || '',
        zip: property.address_zip || ''
      },
      status: determinePropertyStatus(property, activeLeases, propertyUnits),
      badges: [property.type || 'Property', property.class || 'Residential'],
      kpis: [
        { label: 'Occupancy', value: `${occupancy.toFixed(1)}%`, deltaPct: 0 },
        { label: 'Units', value: propertyUnits.length },
        { label: 'Delinquency', value: '0%' }, // TODO: calculate from ledger
        { label: 'Open WOs', value: 0 }, // TODO: integrate work orders
        { label: 'TTM NOI', value: '$0' } // TODO: calculate from financials
      ],
      linked: {
        units: propertyUnits.length,
        leases: activeLeases.length,
        tenants: propertyTenants.length,
        owner: propertyOwner ? { id: propertyOwner.id, name: propertyOwner.name } : undefined
      },
      insights: [
        'Property performing well with strong occupancy',
        'Regular maintenance needed for HVAC systems'
      ]
    };

    return dto;
  }, [properties.data, units.data, leases.data, tenants.data, owners.data, id]);

  return {
    data,
    isLoading: properties.loading || units.loading || leases.loading,
    error: properties.error || units.error || leases.error
  };
}

function determinePropertyStatus(property: any, activeLeases: any[], units: any[]): PropertyCardDTO['status'] {
  const status: PropertyCardDTO['status'] = [];
  
  if (property.active !== false) status.push('Active');
  if (units.length === 0 || activeLeases.length === 0) status.push('Vacant');
  // TODO: Add other status calculations based on business logic
  
  return status;
}

// Import React for useMemo
import React from 'react';