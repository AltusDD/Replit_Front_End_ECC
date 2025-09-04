import React from 'react';
import { PropertyCardDTO } from '../types';

interface DetailsProps {
  data: PropertyCardDTO;
}

export default function Details({ data }: DetailsProps) {
  const sampleDetails = {
    basic: {
      'Property Type': 'Multi-Family',
      'Year Built': '1985',
      'Square Footage': '12,500 sq ft',
      'Lot Size': '0.5 acres',
      'Parking Spaces': '24',
      'Pet Policy': 'Cats & Dogs (under 50lbs)'
    },
    amenities: {
      'Laundry': 'In-unit',
      'HVAC': 'Central Air',
      'Utilities': 'Tenant pays electric',
      'Internet': 'Fiber available',
      'Security': 'Keyless entry',
      'Storage': 'Basement storage units'
    },
    management: {
      'Property Manager': 'Sarah Johnson',
      'Maintenance Vendor': 'ABC Property Services',
      'Landscaping': 'Green Thumb LLC',
      'Insurance Carrier': 'State Farm',
      'Insurance Expiry': 'Dec 31, 2024',
      'Last Inspection': 'Sep 15, 2024'
    }
  };

  const FieldGroup = ({ title, fields }: { title: string; fields: Record<string, string> }) => (
    <div>
      <h3 style={{ 
        fontSize: 'var(--fs-16)', 
        fontWeight: 600, 
        color: 'var(--text)', 
        marginBottom: 'var(--gap-2)',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '8px'
      }}>
        {title}
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 'var(--gap-3)' 
      }}>
        {Object.entries(fields).map(([label, value]) => (
          <div key={label}>
            <div style={{ 
              fontSize: 'var(--fs-12)', 
              color: 'var(--text-muted)', 
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {label}
            </div>
            <div style={{ 
              color: 'var(--text)', 
              fontSize: 'var(--fs-14)',
              fontWeight: 500
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
      <FieldGroup title="Basic Information" fields={sampleDetails.basic} />
      <FieldGroup title="Amenities & Features" fields={sampleDetails.amenities} />
      <FieldGroup title="Management & Services" fields={sampleDetails.management} />
      
      {/* Edit Action */}
      <div style={{
        padding: 'var(--gap-3)',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        borderLeft: '4px solid var(--gold)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ color: 'var(--text)', fontWeight: 600 }}>Property Details</div>
          <div style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-14)' }}>
            Last updated: Nov 15, 2024
          </div>
        </div>
        <button style={{
          background: 'var(--gold)',
          color: 'var(--bg)',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Edit Details
        </button>
      </div>
    </div>
  );
}