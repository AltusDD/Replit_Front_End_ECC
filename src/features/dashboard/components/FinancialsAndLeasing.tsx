// Financials & Leasing - ComposedChart with actionable insights

import { useState } from 'react';
import { Link } from 'wouter';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { fmtMoney, fmtCompact } from '@/utils/format';
import type { DashboardData } from '../hooks/useDashboardData';

interface FinancialsAndLeasingProps {
  cashflow90: DashboardData['cashflow90'];
  leasingFunnel30: DashboardData['leasingFunnel30'];
}

// Custom tooltip for cashflow chart
function CashflowTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;
  
  const income = payload.find(p => p.dataKey === 'income')?.value || 0;
  const expenses = payload.find(p => p.dataKey === 'expenses')?.value || 0;
  const noi = payload.find(p => p.dataKey === 'noi')?.value || 0;
  
  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-3 shadow-lg">
      <div className="text-sm font-medium text-[var(--text)] mb-2">{label}</div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--good)] rounded"></div>
            Income
          </span>
          <span className="font-medium text-[var(--text)]">{fmtMoney(income)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--warn)] rounded"></div>
            Expenses
          </span>
          <span className="font-medium text-[var(--text)]">{fmtMoney(expenses)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[var(--altus-gold)] rounded"></div>
            NOI
          </span>
          <span className="font-medium text-[var(--altus-gold)]">{fmtMoney(noi)}</span>
        </div>
      </div>
    </div>
  );
}

// Range toggle component
function RangeToggle({ 
  options, 
  selected, 
  onChange 
}: { 
  options: Array<{ value: string; label: string }>; 
  selected: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-[var(--panel-elev)] rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            selected === option.value
              ? 'bg-[var(--altus-gold)] text-[var(--altus-black)]'
              : 'text-[var(--text-dim)] hover:text-[var(--text)]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Leasing funnel component
function LeasingFunnel({ funnel }: { funnel: DashboardData['leasingFunnel30'] }) {
  const stages = [
    { key: 'leads', label: 'Leads', value: funnel.leads },
    { key: 'tours', label: 'Tours', value: funnel.tours },
    { key: 'applications', label: 'Applications', value: funnel.applications },
    { key: 'approved', label: 'Approved', value: funnel.approved },
    { key: 'signed', label: 'Signed', value: funnel.signed },
  ];
  
  const maxValue = Math.max(...stages.map(s => s.value)) || 1;
  
  return (
    <div className="space-y-3">
      {stages.map((stage, index) => {
        const percentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
        const conversionRate = index > 0 ? 
          (stages[index - 1].value > 0 ? (stage.value / stages[index - 1].value) * 100 : 0) : 
          100;
        
        return (
          <div key={stage.key} className="flex items-center gap-4">
            <div className="w-20 text-sm text-[var(--text-dim)] text-right">
              {stage.label}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-[var(--text)]">
                  {stage.value}
                </div>
                {index > 0 && (
                  <div className="text-xs text-[var(--text-dim)]">
                    {conversionRate.toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="h-2 bg-[var(--line)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--altus-gold)] transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FinancialsAndLeasing({ cashflow90, leasingFunnel30 }: FinancialsAndLeasingProps) {
  const [selectedRange, setSelectedRange] = useState('30');
  
  const rangeOptions = [
    { value: '30', label: '30d' },
    { value: '60', label: '60d' },
    { value: '90', label: '90d' },
  ];
  
  return (
    <div className="financial-grid" data-testid="financials-and-leasing">
      {/* Cash Flow Chart */}
      <div className="ecc-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="ecc-panel__title text-lg mb-1">
              90-Day Cash Flow
            </h3>
            <p className="text-sm text-[var(--text-dim)]">
              Weekly income, expenses, and net operating income trend
            </p>
          </div>
          <Link href="/accounting?range=90d">
            <button className="text-xs text-[var(--altus-gold)] hover:underline">
              View Details →
            </button>
          </Link>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cashflow90}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--line)"
                opacity={0.5}
              />
              <XAxis 
                dataKey="periodLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-dim)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-dim)' }}
                tickFormatter={(value) => fmtCompact(value)}
              />
              <Tooltip content={<CashflowTooltip />} />
              
              {/* Income bars */}
              <Bar 
                dataKey="income"
                fill="var(--good)"
                opacity={0.8}
                radius={[2, 2, 0, 0]}
              />
              
              {/* Expense bars */}
              <Bar 
                dataKey="expenses"
                fill="var(--warn)"
                opacity={0.8}
                radius={[2, 2, 0, 0]}
              />
              
              {/* NOI line */}
              <Line 
                type="monotone"
                dataKey="noi"
                stroke="var(--altus-gold)"
                strokeWidth={3}
                dot={{ fill: 'var(--altus-gold)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--altus-gold)', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--good)] rounded"></div>
            <span className="text-[var(--text-dim)]">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--warn)] rounded"></div>
            <span className="text-[var(--text-dim)]">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[var(--altus-gold)] rounded"></div>
            <span className="text-[var(--text-dim)]">NOI</span>
          </div>
        </div>
      </div>

      {/* Leasing Funnel */}
      <div className="ecc-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="ecc-panel__title text-lg mb-1">
              Leasing Funnel
            </h3>
            <p className="text-sm text-[var(--text-dim)]">
              Lead conversion and pipeline performance
            </p>
          </div>
          <RangeToggle
            options={rangeOptions}
            selected={selectedRange}
            onChange={setSelectedRange}
          />
        </div>
        
        <div className="mb-6">
          <LeasingFunnel funnel={leasingFunnel30} />
        </div>
        
        {/* CTAs */}
        <div className="flex gap-3">
          <Link href="/portfolio/units?status=vacant" className="flex-1">
            <button className="w-full px-4 py-2 text-sm font-medium bg-[var(--altus-gold)] text-[var(--altus-black)] rounded-lg hover:opacity-90 transition-opacity">
              View Vacants
            </button>
          </Link>
          <Link href="/leases?status=pending" className="flex-1">
            <button className="w-full px-4 py-2 text-sm font-medium bg-[var(--panel-elev)] text-[var(--text)] border border-[var(--line)] rounded-lg hover:bg-[var(--panel-bg)] transition-colors">
              View Applications
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}