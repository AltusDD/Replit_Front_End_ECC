// src/features/dashboard/components/LeasingFunnel.tsx
import React from 'react';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { ActionButton } from './ActionButton';

interface LeasingFunnelProps {
  funnel: {
    applications: number;
    screenings: number;
    leases: number;
  };
}

export function LeasingFunnel({ funnel }: LeasingFunnelProps) {
  const funnelData = [
    { name: 'Applications', value: funnel.applications, fill: 'var(--altus-gold)' },
    { name: 'Screenings', value: funnel.screenings, fill: '#f59e0b' },
    { name: 'Leases Signed', value: funnel.leases, fill: 'var(--altus-good)' },
  ];

  const conversionRates = {
    screenings: funnel.applications > 0 ? (funnel.screenings / funnel.applications) * 100 : 0,
    leases: funnel.screenings > 0 ? (funnel.leases / funnel.screenings) * 100 : 0,
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--altus-grey-700)] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-[var(--altus-text)] font-medium">{data.name}</p>
          <p className="text-[var(--altus-muted)] text-sm">{data.value} total</p>
        </div>
      );
    }
    return null;
  };

  const handleStepClick = (stepName: string) => {
    const routes = {
      'Applications': '/leasing/applications',
      'Screenings': '/leasing/screenings',
      'Leases Signed': '/leasing/signed',
    };
    console.info('Navigate to', routes[stepName as keyof typeof routes]);
  };

  return (
    <ChartContainer title="Leasing Funnel (Last 90 Days)">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={250}>
            <FunnelChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive={true}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={2}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Stats and Actions */}
        <div className="space-y-4">
          {/* Funnel Steps */}
          <div className="space-y-3">
            {funnelData.map((step, index) => (
              <div key={step.name} className="flex items-center justify-between p-3 bg-[var(--altus-grey-700)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: step.fill }}
                  />
                  <div>
                    <div className="text-sm font-medium text-[var(--altus-text)]">
                      {step.name}
                    </div>
                    <div className="text-xs text-[var(--altus-muted)]">
                      {step.value} total
                    </div>
                  </div>
                </div>
                <ActionButton
                  size="sm"
                  onClick={() => handleStepClick(step.name)}
                  data-testid={`funnel-${step.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  View
                </ActionButton>
              </div>
            ))}
          </div>

          {/* Conversion Rates */}
          <div className="bg-[var(--altus-grey-700)] rounded-lg p-4">
            <h5 className="text-sm font-semibold text-[var(--altus-text)] mb-3">
              Conversion Rates
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--altus-muted)]">App → Screening:</span>
                <span className="text-[var(--altus-text)]">
                  {conversionRates.screenings.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--altus-muted)]">Screen → Lease:</span>
                <span className="text-[var(--altus-text)]">
                  {conversionRates.leases.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-600">
                <span className="text-[var(--altus-muted)]">Overall:</span>
                <span className="text-[var(--altus-text)]">
                  {funnel.applications > 0 ? ((funnel.leases / funnel.applications) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}