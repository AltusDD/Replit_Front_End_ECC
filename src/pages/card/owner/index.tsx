import React, { useState } from 'react';
import { useParams } from 'wouter';
import Breadcrumbs from '../../../components/layout/Breadcrumbs';
import { TransferStepper } from '../../../features/ownerTransfer/components/TransferStepper';
import { useCollection } from '../../../features/data/useCollection';

export default function OwnerCardPage() {
  const { id = '' } = useParams();
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Fetch owner summary and their properties
  const ownerSummary = useCollection(`/api/owners/${id}/summary`);
  const ownerProperties = useCollection(`/api/owners/${id}/properties?limit=200`);
  
  const owner = ownerSummary.data?.owner;
  const propertyCount = ownerSummary.data?.counts?.properties || 0;
  const properties = ownerProperties.data?.properties || [];

  const breadcrumbs = [
    { label: 'Portfolio', href: '/portfolio/owners' },
    { label: 'Owners', href: '/portfolio/owners' },
    { label: `Owner ${id}` }
  ];

  return (
    <div className="ecc-page">
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Owner Card Header */}
      <div style={{
        background: 'var(--panel-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-4)',
        marginBottom: 'var(--gap-3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: 'var(--gap-2)' }}>👑</div>
            <h1 style={{ color: 'var(--text)', marginBottom: '8px', fontSize: '2em' }}>
              Owner Card
            </h1>
            <p style={{ color: 'var(--text-subtle)', fontSize: '1.2em' }}>
              {owner?.display_name || owner?.company_name || [owner?.first_name, owner?.last_name].filter(Boolean).join(' ') || `Owner ${id}`}
            </p>
            <p style={{ color: 'var(--text-dim)', marginTop: 'var(--gap-2)' }}>
              {propertyCount} Properties • Active Owner
            </p>
          </div>
          
          {/* Transfer Ownership Button */}
          <button
            onClick={() => setShowTransferModal(true)}
            style={{
              padding: 'var(--gap-2) var(--gap-4)',
              backgroundColor: 'var(--altus-gold)',
              color: 'var(--altus-black)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--gap-1)'
            }}
          >
            🔄 Transfer Ownership
          </button>
        </div>
      </div>

      {/* Owner Details */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--gap-3)',
        marginBottom: 'var(--gap-3)'
      }}>
        {/* Basic Information */}
        <div style={{
          background: 'var(--panel-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--gap-4)'
        }}>
          <h2 style={{ color: 'var(--text)', marginBottom: 'var(--gap-3)' }}>
            Basic Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-2)' }}>
            <div>
              <strong style={{ color: 'var(--text)' }}>Company:</strong>
              <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>{owner?.company_name || 'N/A'}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>Contact:</strong>
              <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>{owner?.email || 'N/A'}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>Phone:</strong>
              <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>{owner?.phone || 'N/A'}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>Status:</strong>
              <span style={{ 
                color: 'var(--good)', 
                marginLeft: 'var(--gap-1)',
                padding: '2px 8px',
                backgroundColor: 'rgba(47, 199, 141, 0.1)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9em'
              }}>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div style={{
          background: 'var(--panel-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--gap-4)'
        }}>
          <h2 style={{ color: 'var(--text)', marginBottom: 'var(--gap-3)' }}>
            Portfolio Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-2)' }}>
            <div style={{ textAlign: 'center', padding: 'var(--gap-2)' }}>
              <div style={{ fontSize: '2em', color: 'var(--altus-gold)' }}>
                {propertyCount}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>Properties</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--gap-2)' }}>
              <div style={{ fontSize: '2em', color: 'var(--good)' }}>
                {properties.reduce((sum, p) => sum + (p.units || 0), 0)}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>Total Units</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--gap-2)' }}>
              <div style={{ fontSize: '2em', color: 'var(--warn)' }}>
                —
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>Avg Occupancy</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--gap-2)' }}>
              <div style={{ fontSize: '2em', color: 'var(--neutral)' }}>
                —
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>Net Worth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List Preview */}
      <div style={{
        background: 'var(--panel-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-3)' }}>
          <h2 style={{ color: 'var(--text)' }}>Properties</h2>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>
            {properties.length} properties
          </span>
        </div>
        
        {properties.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: 'var(--gap-4)' }}>
            No properties found for this owner.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--gap-2)' }}>
            {properties.slice(0, 5).map((property, index) => (
              <div 
                key={property.id || index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--gap-2)',
                  backgroundColor: 'var(--panel-elev)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--text)' }}>
                    {property.name || `Property ${property.id}`}
                  </strong>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9em', marginTop: '4px' }}>
                    {[property.city, property.state].filter(Boolean).join(', ')} • {property.units || 0} units
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    color: 'var(--neutral)',
                    fontWeight: 'bold'
                  }}>
                    —
                  </span>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8em', marginTop: '2px' }}>
                    Occupancy
                  </p>
                </div>
              </div>
            ))}
            
            {properties.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: 'var(--gap-2)' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>
                  + {properties.length - 5} more properties
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transfer Stepper Modal */}
      <TransferStepper
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        propertyIds={properties.map(p => p.id).filter(id => typeof id === 'number')}
      />
    </div>
  );
}