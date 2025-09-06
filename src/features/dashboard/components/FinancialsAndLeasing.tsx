// FinancialsAndLeasing.tsx - ComposedChart with NOI line and leasing funnel
import React from 'react';
import { Link } from 'wouter';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { fmtMoney, fmtCompact } from '../../../utils/format';

interface CashflowData {
  periodLabel: string;
  income: number;
  expenses: number;
  noi: number;
}

interface LeasingFunnel {
  leads: number;
  tours: number;
  applications: number;
  signed: number;
}

interface FinancialsAndLeasingProps {
  cashflow90: CashflowData[];
  funnel30: LeasingFunnel;
}

// Custom tooltip for cash flow chart
function CashflowTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  
  const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
  const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
  const noi = payload.find((p: any) => p.dataKey === 'noi')?.value || 0;
  
  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-3 shadow-lg">
      <div className="text-sm font-medium text-[var(--text)] mb-2">{label}</div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--good)]">Income:</span>
          <span className="font-medium">{fmtMoney(income)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--warn)]">Expenses:</span>
          <span className="font-medium">{fmtMoney(expenses)}</span>
        </div>
        <div className="border-t border-[var(--line)] pt-1 mt-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[var(--altus-gold)] font-medium">NOI:</span>
            <span className="font-bold">{fmtMoney(noi)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Funnel bar component
function FunnelBar({ 
  label, 
  value, 
  percentage, 
  color, 
  href 
}: { 
  label: string;
  value: number;
  percentage: number;
  color: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="cursor-pointer group">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--altus-gold)] transition-colors">
            {label}
          </span>
          <span className="text-sm font-bold text-[var(--text)]">{value}</span>
        </div>
        <div className="bg-[var(--line)] rounded-full h-3 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300 group-hover:brightness-110"
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: color 
            }}
          />
        </div>
        <div className="text-xs text-[var(--text-dim)] mt-1">{percentage.toFixed(1)}% conversion</div>
      </div>
    </Link>
  );
}

export function FinancialsAndLeasing({ cashflow90, funnel30 }: FinancialsAndLeasingProps) {
  // Calculate conversion percentages for funnel
  const conversionPercentages = {
    tours: funnel30.leads > 0 ? (funnel30.tours / funnel30.leads) * 100 : 0,
    applications: funnel30.tours > 0 ? (funnel30.applications / funnel30.tours) * 100 : 0,
    signed: funnel30.applications > 0 ? (funnel30.signed / funnel30.applications) * 100 : 0,
  };
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 90-Day Cash Flow Chart */}
      <div className="xl:col-span-2 bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
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
            <span className="text-[var(--text-dim)]">Net Operating Income</span>
          </div>
        </div>
      </div>
      
      {/* 30-Day Leasing Funnel */}
      <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
              Leasing Funnel
            </h3>
            <p className="text-sm text-[var(--text-dim)]">
              30-day lead conversion
            </p>
          </div>
          <Link href="/leasing/analytics">
            <button className="text-xs text-[var(--altus-gold)] hover:underline">
              View Details →
            </button>
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* Leads */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[var(--text)]">Leads</span>
              <span className="text-sm font-bold text-[var(--text)]">{funnel30.leads}</span>
            </div>
            <div className="bg-[var(--good)] h-3 rounded-full"></div>
            <div className="text-xs text-[var(--text-dim)] mt-1">Starting point</div>
          </div>
          
          {/* Tours */}
          <FunnelBar
            label="Tours Scheduled"
            value={funnel30.tours}
            percentage={conversionPercentages.tours}
            color="var(--altus-gold)"
            href="/leasing/tours"
          />
          
          {/* Applications */}
          <FunnelBar
            label="Applications"
            value={funnel30.applications}
            percentage={conversionPercentages.applications}
            color="var(--warn)"
            href="/leasing/applications"
          />
          
          {/* Signed */}
          <FunnelBar
            label="Leases Signed"
            value={funnel30.signed}
            percentage={conversionPercentages.signed}
            color="var(--good)"
            href="/portfolio/leases?status=recent"
          />
        </div>
        
        {/* Overall conversion rate */}
        <div className="mt-6 pt-4 border-t border-[var(--line)]">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--altus-gold)] mb-1">
              {funnel30.leads > 0 ? ((funnel30.signed / funnel30.leads) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-[var(--text-dim)] uppercase tracking-wide">
              Overall Conversion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}