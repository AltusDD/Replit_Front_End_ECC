import React, { useState } from 'react';
import { useParams } from 'wouter';
import Breadcrumbs from '../../../components/layout/Breadcrumbs';
import { TransferStepper } from '../../../features/ownerTransfer/components/TransferStepper';
import { useCollection } from '../../../features/data/useCollection';

export default function OwnerCardPage() {
  const { id = '' } = useParams();
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Fetch owner data and their properties
  const properties = useCollection(`/api/portfolio/properties`);
  
  // Filter properties owned by this owner (when we have proper owner_id linking)
  const ownerProperties = properties.data?.filter(p => 
    // For now, we'll show all properties - in real implementation, 
    // this would filter by owner_id
    true
  ) || [];

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
              Owner ID: {id}
            </p>
            <p style={{ color: 'var(--text-dim)', marginTop: 'var(--gap-2)' }}>
              {ownerProperties.length} Properties • Active Owner
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
              <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Sample Company LLC</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>Contact:</strong>
              <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>owner@example.com</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>Phone:</strong>
              <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>(555) 123-4567</p>
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
                {ownerProperties.length}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>Properties</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--gap-2)' }}>
              <div style={{ fontSize: '2em', color: 'var(--good)' }}>
                {ownerProperties.reduce((sum, p) => sum + (p.units || 0), 0)}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>Total Units</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--gap-2)' }}>
              <div style={{ fontSize: '2em', color: 'var(--warn)' }}>
                {Math.round(ownerProperties.reduce((sum, p) => sum + (p.occPct || 0), 0) / Math.max(ownerProperties.length, 1))}%
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
            {ownerProperties.length} properties
          </span>
        </div>
        
        {ownerProperties.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: 'var(--gap-4)' }}>
            No properties found for this owner.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--gap-2)' }}>
            {ownerProperties.slice(0, 5).map((property, index) => (
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
                    {property.city}, {property.state} • {property.units || 0} units
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    color: property.occPct >= 90 ? 'var(--good)' : property.occPct >= 70 ? 'var(--warn)' : 'var(--bad)',
                    fontWeight: 'bold'
                  }}>
                    {property.occPct || 0}%
                  </span>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8em', marginTop: '2px' }}>
                    Occupancy
                  </p>
                </div>
              </div>
            ))}
            
            {ownerProperties.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: 'var(--gap-2)' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.9em' }}>
                  + {ownerProperties.length - 5} more properties
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
        propertyIds={ownerProperties.map(p => p.id).filter(id => typeof id === 'number')}
      />
    </div>
  );
}