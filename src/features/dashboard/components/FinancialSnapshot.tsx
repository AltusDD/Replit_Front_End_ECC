// src/features/dashboard/components/FinancialSnapshot.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ChartContainer } from './ChartContainer';

interface FinancialSnapshotProps {
  series: {
    months: Array<{ label: string; income: number; expenses: number; occupancyPct: number }>;
    quarters: Array<{ label: string; value: number; debt: number }>;
  };
}

export function FinancialSnapshot({ series }: FinancialSnapshotProps) {
  // Format currency for tooltips
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Transform data for charts
  const incomeExpenseData = series.months.slice(-6).map(month => ({
    month: month.month ? new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short' }) : 'Unknown',
    income: month.income / 100, // Convert cents to dollars
    expenses: month.expenses / 100,
  }));

  const portfolioValueData = series.quarters.map(quarter => ({
    quarter: quarter.quarter,
    value: quarter.value / 100, // Convert cents to dollars
    debt: quarter.debt / 100,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--altus-grey-700)] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-[var(--altus-text)] font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value * 100)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--altus-grey-700)] border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-[var(--altus-text)] font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value * 100)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income vs Expenses */}
      <ChartContainer title="Income vs Expenses (Last 6 Months)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeExpenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'var(--altus-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--altus-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: 'var(--altus-text)' }}
            />
            <Bar 
              dataKey="income" 
              fill="var(--altus-good)" 
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill="var(--altus-muted)" 
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Portfolio Value vs Debt */}
      <ChartContainer title="Portfolio Value vs Debt (Quarterly)">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioValueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--altus-gold)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--altus-gold)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="quarter" 
              tick={{ fill: 'var(--altus-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--altus-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <Legend wrapperStyle={{ color: 'var(--altus-text)' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--altus-gold)"
              strokeWidth={2}
              fill="url(#colorValue)"
              name="Portfolio Value"
            />
            <Line
              type="monotone"
              dataKey="debt"
              stroke="#f87171"
              strokeWidth={2}
              dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }}
              name="Debt"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}