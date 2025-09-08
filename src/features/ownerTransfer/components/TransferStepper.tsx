// Owner Transfer Stepper Modal - Multi-step ownership transfer workflow
import React, { useState, useEffect } from 'react';
import { useOwnerTransfer } from '../hooks/useOwnerTransfer';
import { useCollection } from '../../data/useCollection';
import type { Owner, Property } from '../../../../shared/schema';

interface TransferStepperProps {
  isOpen: boolean;
  onClose: () => void;
  propertyIds?: number[]; // Pre-selected properties (optional)
}

type Step = 'select-owner' | 'set-date' | 'confirm-entities' | 'manage-workflow';

interface TransferFormData {
  propertyIds: number[];
  newOwnerId: number;
  effectiveDate: string;
  notes: string;
}

export function TransferStepper({ isOpen, onClose, propertyIds = [] }: TransferStepperProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select-owner');
  const [formData, setFormData] = useState<TransferFormData>({
    propertyIds: propertyIds,
    newOwnerId: 0,
    effectiveDate: '',
    notes: '',
  });
  const [transferId, setTransferId] = useState<number | null>(null);
  const [transferStatus, setTransferStatus] = useState<string>('PENDING_ACCOUNTING');

  const ownerTransfer = useOwnerTransfer();
  const owners = useCollection<Owner>('/api/portfolio/owners');
  const properties = useCollection<Property>('/api/portfolio/properties');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('select-owner');
      setFormData({
        propertyIds: propertyIds,
        newOwnerId: 0,
        effectiveDate: new Date().toISOString().split('T')[0], // Today's date
        notes: '',
      });
      setTransferId(null);
      setTransferStatus('PENDING_ACCOUNTING');
    }
  }, [isOpen, propertyIds]);

  const selectedProperties = properties.data?.filter(p => 
    formData.propertyIds.includes(p.id)
  ) || [];

  const selectedOwner = owners.data?.find(o => o.id === formData.newOwnerId);

  const handleNext = async () => {
    switch (currentStep) {
      case 'select-owner':
        if (formData.newOwnerId && formData.effectiveDate) {
          setCurrentStep('set-date');
        }
        break;
      case 'set-date':
        setCurrentStep('confirm-entities');
        break;
      case 'confirm-entities':
        // Initiate transfer
        const result = await ownerTransfer.initiateTransfer({
          propertyIds: formData.propertyIds,
          newOwnerId: formData.newOwnerId,
          effectiveDate: formData.effectiveDate,
          notes: formData.notes,
        });
        
        if (result) {
          setTransferId(result.transferId);
          setCurrentStep('manage-workflow');
        }
        break;
    }
  };

  const handleApproveAccounting = async () => {
    if (!transferId) return;
    
    const success = await ownerTransfer.approveAccounting({ transferId });
    if (success) {
      setTransferStatus('APPROVED_ACCOUNTING');
    }
  };

  const handleAuthorizeExecution = async () => {
    if (!transferId) return;
    
    const success = await ownerTransfer.authorizeExecution({ transferId });
    if (success) {
      setTransferStatus('READY_EXECUTION');
    }
  };

  const handleExecuteTransfer = async (dryRun: boolean = true) => {
    if (!transferId) return;
    
    const result = await ownerTransfer.executeTransfer({ transferId, dryRun });
    if (result) {
      if (!dryRun && result.applied) {
        setTransferStatus('COMPLETE');
      }
      // Show execution summary
      alert(`Transfer ${dryRun ? 'dry run' : 'execution'} completed:\n${result.summary?.operations?.join('\n')}`);
    }
  };

  const handleDownloadReport = async () => {
    if (!transferId) return;
    await ownerTransfer.downloadReport(transferId);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--text)', marginBottom: 0 }}>
            Transfer Property Ownership
          </h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-dim)', 
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Progress Steps */}
        <div className="transfer-progress">
          {[
            { key: 'select-owner', label: '1. Select Owner' },
            { key: 'set-date', label: '2. Set Date' },
            { key: 'confirm-entities', label: '3. Confirm' },
            { key: 'manage-workflow', label: '4. Workflow' },
          ].map((step) => (
            <div 
              key={step.key}
              className={`progress-step ${currentStep === step.key ? 'active' : ''}`}
            >
              {step.label}
            </div>
          ))}
        </div>

        <div className="modal-body">
          {currentStep === 'select-owner' && (
            <div className="step-content">
              <h3 style={{ color: 'var(--text)', marginBottom: 'var(--gap-3)' }}>
                Select New Owner
              </h3>
              
              <div className="form-group">
                <label style={{ color: 'var(--text)', display: 'block', marginBottom: 'var(--gap-1)' }}>
                  New Owner *
                </label>
                <select
                  value={formData.newOwnerId}
                  onChange={(e) => setFormData({ ...formData, newOwnerId: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: 'var(--gap-2)',
                    backgroundColor: 'var(--panel-elev)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text)',
                  }}
                >
                  <option value={0}>Select an owner...</option>
                  {owners.data?.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.company || owner.name || `Owner ${owner.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginTop: 'var(--gap-3)' }}>
                <label style={{ color: 'var(--text)', display: 'block', marginBottom: 'var(--gap-1)' }}>
                  Effective Date *
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--gap-2)',
                    backgroundColor: 'var(--panel-elev)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text)',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginTop: 'var(--gap-3)' }}>
                <label style={{ color: 'var(--text)', display: 'block', marginBottom: 'var(--gap-1)' }}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes about this transfer..."
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: 'var(--gap-2)',
                    backgroundColor: 'var(--panel-elev)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text)',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ marginTop: 'var(--gap-3)', padding: 'var(--gap-2)', backgroundColor: 'var(--panel-elev)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--text)' }}>
                  Selected Properties: {formData.propertyIds.length}
                </strong>
                {formData.propertyIds.length === 0 && (
                  <p style={{ color: 'var(--warn)', marginTop: 'var(--gap-1)' }}>
                    No properties selected. Please select at least one property.
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 'set-date' && (
            <div className="step-content">
              <h3 style={{ color: 'var(--text)', marginBottom: 'var(--gap-3)' }}>
                Transfer Summary
              </h3>
              
              <div style={{ 
                backgroundColor: 'var(--panel-elev)', 
                padding: 'var(--gap-3)', 
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--gap-3)'
              }}>
                <div style={{ marginBottom: 'var(--gap-2)' }}>
                  <strong style={{ color: 'var(--text)' }}>New Owner:</strong>
                  <p style={{ color: 'var(--text-dim)', marginTop: 'var(--gap-1)' }}>
                    {selectedOwner?.company || selectedOwner?.name || 'Unknown'}
                  </p>
                </div>
                
                <div style={{ marginBottom: 'var(--gap-2)' }}>
                  <strong style={{ color: 'var(--text)' }}>Effective Date:</strong>
                  <p style={{ color: 'var(--text-dim)', marginTop: 'var(--gap-1)' }}>
                    {formData.effectiveDate}
                  </p>
                </div>
                
                <div style={{ marginBottom: 'var(--gap-2)' }}>
                  <strong style={{ color: 'var(--text)' }}>Properties:</strong>
                  <p style={{ color: 'var(--text-dim)', marginTop: 'var(--gap-1)' }}>
                    {formData.propertyIds.length} selected
                  </p>
                </div>

                {formData.notes && (
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Notes:</strong>
                    <p style={{ color: 'var(--text-dim)', marginTop: 'var(--gap-1)' }}>
                      {formData.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 'confirm-entities' && (
            <div className="step-content">
              <h3 style={{ color: 'var(--text)', marginBottom: 'var(--gap-3)' }}>
                Confirm Entity Tree
              </h3>
              
              <div style={{ 
                backgroundColor: 'var(--panel-elev)', 
                padding: 'var(--gap-3)', 
                borderRadius: 'var(--radius-md)',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {selectedProperties.map((property) => (
                  <div key={property.id} style={{ marginBottom: 'var(--gap-2)' }}>
                    <div style={{ color: 'var(--text)', fontWeight: 'bold' }}>
                      📍 {property.name || `Property ${property.id}`}
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9em', marginLeft: 'var(--gap-2)' }}>
                      • {property.units || 0} units
                      <br />
                      • Location: {property.city}, {property.state}
                      <br />
                      • Type: {property.type || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: 'var(--gap-3)', 
                padding: 'var(--gap-2)', 
                backgroundColor: 'var(--warn)', 
                color: 'var(--altus-black)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9em'
              }}>
                ⚠️ This will create immutable snapshots of all related entities (properties, units, leases, tenants, work orders) and generate an accounting report for review.
              </div>
            </div>
          )}

          {currentStep === 'manage-workflow' && (
            <div className="step-content">
              <h3 style={{ color: 'var(--text)', marginBottom: 'var(--gap-3)' }}>
                Transfer Workflow
              </h3>

              {transferId && (
                <div style={{ 
                  backgroundColor: 'var(--panel-elev)', 
                  padding: 'var(--gap-3)', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--gap-3)'
                }}>
                  <div style={{ marginBottom: 'var(--gap-2)' }}>
                    <strong style={{ color: 'var(--text)' }}>Transfer ID:</strong>
                    <span style={{ color: 'var(--text-dim)', marginLeft: 'var(--gap-1)' }}>
                      {transferId}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--gap-2)' }}>
                    <strong style={{ color: 'var(--text)' }}>Status:</strong>
                    <span 
                      style={{ 
                        color: transferStatus === 'COMPLETE' ? 'var(--good)' : 'var(--warn)',
                        marginLeft: 'var(--gap-1)',
                        fontWeight: 'bold'
                      }}
                    >
                      {transferStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--gap-2)', flexWrap: 'wrap', marginTop: 'var(--gap-3)' }}>
                    <button
                      onClick={handleDownloadReport}
                      disabled={ownerTransfer.loading}
                      style={{
                        padding: 'var(--gap-2) var(--gap-3)',
                        backgroundColor: 'var(--altus-gold)',
                        color: 'var(--altus-black)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '0.9em'
                      }}
                    >
                      📊 Download Report
                    </button>

                    {transferStatus === 'PENDING_ACCOUNTING' && (
                      <button
                        onClick={handleApproveAccounting}
                        disabled={ownerTransfer.loading}
                        style={{
                          padding: 'var(--gap-2) var(--gap-3)',
                          backgroundColor: 'var(--good)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '0.9em'
                        }}
                      >
                        ✅ Mark Approved
                      </button>
                    )}

                    {transferStatus === 'APPROVED_ACCOUNTING' && ownerTransfer.canAuthorize && (
                      <button
                        onClick={handleAuthorizeExecution}
                        disabled={ownerTransfer.loading}
                        style={{
                          padding: 'var(--gap-2) var(--gap-3)',
                          backgroundColor: 'var(--warn)',
                          color: 'var(--altus-black)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '0.9em'
                        }}
                      >
                        🔑 Authorize Execution
                      </button>
                    )}

                    {transferStatus === 'READY_EXECUTION' && ownerTransfer.canAuthorize && (
                      <>
                        <button
                          onClick={() => handleExecuteTransfer(true)}
                          disabled={ownerTransfer.loading}
                          style={{
                            padding: 'var(--gap-2) var(--gap-3)',
                            backgroundColor: 'var(--neutral)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '0.9em'
                          }}
                        >
                          🧪 Dry Run
                        </button>
                        
                        <button
                          onClick={() => handleExecuteTransfer(false)}
                          disabled={ownerTransfer.loading}
                          style={{
                            padding: 'var(--gap-2) var(--gap-3)',
                            backgroundColor: 'var(--bad)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '0.9em'
                          }}
                        >
                          🚀 Execute Transfer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {ownerTransfer.error && (
                <div style={{ 
                  padding: 'var(--gap-2)', 
                  backgroundColor: 'var(--bad)', 
                  color: 'white', 
                  borderRadius: 'var(--radius-md)',
                  marginTop: 'var(--gap-2)'
                }}>
                  Error: {ownerTransfer.error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={onClose}
              style={{
                padding: 'var(--gap-2) var(--gap-3)',
                backgroundColor: 'transparent',
                color: 'var(--text-dim)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Close
            </button>

            <div style={{ display: 'flex', gap: 'var(--gap-2)' }}>
              {currentStep !== 'select-owner' && currentStep !== 'manage-workflow' && (
                <button 
                  onClick={() => {
                    const steps: Step[] = ['select-owner', 'set-date', 'confirm-entities', 'manage-workflow'];
                    const currentIndex = steps.indexOf(currentStep);
                    if (currentIndex > 0) {
                      setCurrentStep(steps[currentIndex - 1]);
                    }
                  }}
                  style={{
                    padding: 'var(--gap-2) var(--gap-3)',
                    backgroundColor: 'var(--panel-elev)',
                    color: 'var(--text)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
              )}

              {currentStep !== 'manage-workflow' && (
                <button 
                  onClick={handleNext}
                  disabled={
                    ownerTransfer.loading ||
                    (currentStep === 'select-owner' && (!formData.newOwnerId || !formData.effectiveDate)) ||
                    formData.propertyIds.length === 0
                  }
                  style={{
                    padding: 'var(--gap-2) var(--gap-3)',
                    backgroundColor: 'var(--altus-gold)',
                    color: 'var(--altus-black)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    opacity: (ownerTransfer.loading || 
                              (currentStep === 'select-owner' && (!formData.newOwnerId || !formData.effectiveDate)) ||
                              formData.propertyIds.length === 0) ? 0.5 : 1
                  }}
                >
                  {ownerTransfer.loading ? 'Loading...' : 
                   currentStep === 'confirm-entities' ? 'Initiate Transfer' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--panel-bg);
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--gap-4);
          border-bottom: 1px solid var(--line);
        }

        .modal-body {
          padding: var(--gap-4);
          overflow-y: auto;
          flex: 1;
        }

        .modal-footer {
          padding: var(--gap-4);
          border-top: 1px solid var(--line);
        }

        .transfer-progress {
          display: flex;
          padding: var(--gap-3) var(--gap-4);
          border-bottom: 1px solid var(--line);
          background: var(--panel-elev);
        }

        .progress-step {
          flex: 1;
          text-align: center;
          padding: var(--gap-2);
          color: var(--text-dim);
          font-size: 0.9em;
          position: relative;
        }

        .progress-step.active {
          color: var(--altus-gold);
          font-weight: bold;
        }

        .progress-step:not(:last-child)::after {
          content: '→';
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
        }

        .step-content {
          min-height: 300px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}