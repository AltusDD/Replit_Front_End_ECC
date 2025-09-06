// FinancialsAndLeasing.tsx - Genesis v2 specification cash flow + leasing funnel
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { fmtMoney, fmtPct } from '../../../utils/format';

interface FinancialData {
  cashflow90: Array<{
    periodLabel: string;
    income: number;
    expenses: number;
    noi: number;
  }>;
  funnel30: {
    leads: number;
    tours: number;
    applications: number;
    signed: number;
  };
}

interface FinancialsAndLeasingProps {
  financialData: FinancialData;
}

type TimeRange = '30' | '60' | '90';

export function FinancialsAndLeasing({ financialData }: FinancialsAndLeasingProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('90');

  if (!financialData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[var(--panel-elev)] h-6 w-32 rounded animate-pulse"></div>
              <div className="bg-[var(--panel-elev)] h-8 w-20 rounded animate-pulse"></div>
            </div>
            <div className="bg-[var(--panel-elev)] h-[300px] rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  // Filter data based on time range
  const getFilteredData = () => {
    const days = parseInt(timeRange);
    const weeksToShow = Math.ceil(days / 7);
    return financialData.cashflow90.slice(-weeksToShow);
  };

  const filteredData = getFilteredData();

  // Custom tooltip for cash flow chart
  const CashFlowTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-3 shadow-lg">
          <p className="text-[var(--text)] font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${fmtMoney(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Range selector component
  const RangeSelector = ({ value, onChange }: { value: TimeRange; onChange: (v: TimeRange) => void }) => (
    <div className="flex gap-1 bg-[var(--panel-elev)] p-1 rounded-lg">
      {(['30', '60', '90'] as TimeRange[]).map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            value === range
              ? 'bg-[var(--altus-gold)] text-[var(--altus-black)]'
              : 'text-[var(--text-dim)] hover:text-[var(--text)]'
          }`}
        >
          {range} Days
        </button>
      ))}
    </div>
  );

  // Leasing funnel data and calculations
  const funnelSteps = [
    { step: 'Leads', value: financialData.funnel30.leads, color: 'var(--neutral)' },
    { step: 'Tours', value: financialData.funnel30.tours, color: 'var(--warn)' },
    { step: 'Applications', value: financialData.funnel30.applications, color: 'var(--altus-gold)' },
    { step: 'Signed', value: financialData.funnel30.signed, color: 'var(--good)' },
  ];

  // Calculate conversion rates
  const conversions = [
    {
      from: 'Leads',
      to: 'Tours', 
      rate: financialData.funnel30.leads > 0 
        ? (financialData.funnel30.tours / financialData.funnel30.leads) * 100 
        : 0
    },
    {
      from: 'Tours',
      to: 'Apps',
      rate: financialData.funnel30.tours > 0 
        ? (financialData.funnel30.applications / financialData.funnel30.tours) * 100 
        : 0
    },
    {
      from: 'Apps',
      to: 'Signed',
      rate: financialData.funnel30.applications > 0 
        ? (financialData.funnel30.signed / financialData.funnel30.applications) * 100 
        : 0
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cash Flow Chart */}
      <ChartContainer 
        title="Cash Flow (90d)"
        controls={<RangeSelector value={timeRange} onChange={setTimeRange} />}
      >
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis 
              dataKey="periodLabel" 
              tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--line)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--line)' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CashFlowTooltip />} />
            
            {/* Income (green bars) */}
            <Bar 
              dataKey="income" 
              fill="var(--good)" 
              name="Income"
              radius={[2, 2, 0, 0]}
            />
            
            {/* Expenses (neutral bars) */}
            <Bar 
              dataKey="expenses" 
              fill="var(--neutral)" 
              name="Expenses"
              radius={[2, 2, 0, 0]}
            />
            
            {/* NOI (Altus Gold line) */}
            <Line
              type="monotone"
              dataKey="noi"
              stroke="var(--altus-gold)"
              strokeWidth={3}
              dot={{ fill: 'var(--altus-gold)', strokeWidth: 2, r: 4 }}
              name="NOI"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Leasing Funnel */}
      <ChartContainer title="Leasing Funnel (30d)">
        <div className="space-y-4">
          {funnelSteps.map((step, index) => {
            const maxValue = Math.max(...funnelSteps.map(s => s.value));
            const widthPercentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
            const nextStep = funnelSteps[index + 1];
            
            return (
              <div key={step.step} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="text-sm font-medium text-[var(--text)]">
                      {step.step}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--text)]">
                    {step.value}
                  </span>
                </div>

                {/* Horizontal bar */}
                <div className="relative">
                  <div className="w-full h-4 bg-[var(--line)] rounded overflow-hidden">
                    <div 
                      className="h-full rounded transition-all duration-300"
                      style={{ 
                        width: `${widthPercentage}%`, 
                        backgroundColor: step.color 
                      }}
                    />
                  </div>
                  
                  {/* Conversion rate */}
                  {nextStep && (
                    <div className="absolute -bottom-5 left-4 text-xs text-[var(--text-dim)]">
                      {fmtPct(conversions[index]?.rate, 1)} convert
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Overall conversion summary */}
          <div className="pt-4 border-t border-[var(--line)]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-dim)]">Overall Conversion:</span>
              <span className="text-lg font-bold text-[var(--altus-gold)]">
                {fmtPct(
                  financialData.funnel30.leads > 0 
                    ? (financialData.funnel30.signed / financialData.funnel30.leads) * 100 
                    : 0,
                  1
                )}
              </span>
            </div>
          </div>
        </div>
      </ChartContainer>
    </div>
  );
}