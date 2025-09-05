// FinancialSnapshot.tsx - Genesis specification with live data and range control
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
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { fmtMoney } from '../../../utils/format';

interface FinancialSnapshotProps {
  incomeVsExpenses: Array<{ month: string; income: number; expenses: number }>;
  valueVsDebt: Array<{ quarter: string; value: number; debt: number }>;
}

export function FinancialSnapshot({ incomeVsExpenses, valueVsDebt }: FinancialSnapshotProps) {
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '12M'>('6M');

  // Filter data based on time range
  const getFilteredIncomeData = () => {
    const months = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;
    return incomeVsExpenses.slice(-months);
  };

  const getFilteredValueData = () => {
    const quarters = timeRange === '3M' ? 1 : timeRange === '6M' ? 2 : 4;
    return valueVsDebt.slice(-quarters);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--panel-bg)] border border-[var(--line)] rounded-lg p-3 shadow-lg">
          <p className="text-[var(--text)] font-medium">{label}</p>
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

  const RangeSelector = () => (
    <div className="flex gap-1 bg-[var(--panel-elev)] p-1 rounded-lg">
      {['3M', '6M', '12M'].map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range as any)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            timeRange === range
              ? 'bg-[var(--altus-gold)] text-[var(--altus-black)]'
              : 'text-[var(--text-dim)] hover:text-[var(--text)]'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );

  return (
    <div className="financial-grid">
      {/* Income vs Expenses */}
      <div className="ecc-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="ecc-panel__title text-lg">Income vs Expenses</h3>
          <RangeSelector />
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getFilteredIncomeData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--line)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--line)' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: 'var(--text)' }} />
              <Bar 
                dataKey="income" 
                fill="var(--chart-green)" 
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill="var(--chart-gray)" 
                name="Expenses"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Portfolio Value vs Debt */}
      <div className="ecc-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="ecc-panel__title text-lg">Portfolio Value vs Debt</h3>
          <RangeSelector />
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getFilteredValueData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--altus-gold)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--altus-gold)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-red)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--chart-red)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis 
                dataKey="quarter" 
                tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--line)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--line)' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: 'var(--text)' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--altus-gold)"
                strokeWidth={2}
                fill="url(#colorValue)"
                name="Portfolio Value"
              />
              <Area
                type="monotone"
                dataKey="debt"
                stroke="var(--chart-red)"
                strokeWidth={2}
                fill="url(#colorDebt)"
                name="Debt"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}