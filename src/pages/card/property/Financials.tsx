import React, { useState } from 'react';
import { PropertyCardDTO } from '../types';

interface FinancialsProps {
  data: PropertyCardDTO;
}

export default function Financials({ data }: FinancialsProps) {
  const [dateFilter, setDateFilter] = useState('last30');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample ledger data
  const ledgerEntries = [
    { id: '1', date: '2024-01-01', type: 'Rent', description: 'Unit 101 - January Rent', amount: 1200, balance: 1200 },
    { id: '2', date: '2024-01-01', type: 'Rent', description: 'Unit 102 - January Rent', amount: 1350, balance: 2550 },
    { id: '3', date: '2024-01-05', type: 'Expense', description: 'Plumbing Repair - Unit 101', amount: -150, balance: 2400 },
    { id: '4', date: '2024-01-15', type: 'Fee', description: 'Late Fee - Unit 103', amount: 50, balance: 2450 }
  ];

  const summary = {
    totalRent: 12600,
    totalExpenses: -2400,
    netIncome: 10200,
    occupancyRate: 92
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--gap-3)' }}>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--success)' }}>
            ${summary.totalRent.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Total Rent Collected</div>
        </div>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--danger)' }}>
            ${Math.abs(summary.totalExpenses).toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Total Expenses</div>
        </div>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--gold)' }}>
            ${summary.netIncome.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Net Income</div>
        </div>
        <div style={{
          padding: 'var(--gap-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'var(--fs-22)', fontWeight: 700, color: 'var(--info)' }}>
            {summary.occupancyRate}%
          </div>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-subtle)' }}>Occupancy Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--gap-3)', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: 'var(--fs-14)', color: 'var(--text-subtle)', marginRight: '8px' }}>
            Date Range:
          </label>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              color: 'var(--text)'
            }}
          >
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 'var(--fs-14)', color: 'var(--text-subtle)', marginRight: '8px' }}>
            Type:
          </label>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              color: 'var(--text)'
            }}
          >
            <option value="all">All Types</option>
            <option value="rent">Rent</option>
            <option value="expense">Expenses</option>
            <option value="fee">Fees</option>
          </select>
        </div>
        <button style={{
          background: 'var(--gold)',
          color: 'var(--bg)',
          border: 'none',
          padding: '6px 16px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer',
          marginLeft: 'auto'
        }}>
          Record Payment
        </button>
      </div>

      {/* Ledger Table */}
      <div style={{
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                DATE
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                TYPE
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                DESCRIPTION
              </th>
              <th style={{ padding: '12px', textAlign: 'right', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                AMOUNT
              </th>
              <th style={{ padding: '12px', textAlign: 'right', color: 'var(--text-subtle)', fontSize: 'var(--fs-12)' }}>
                BALANCE
              </th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry, index) => (
              <tr key={entry.id} style={{ 
                borderBottom: index < ledgerEntries.length - 1 ? '1px solid var(--border)' : 'none' 
              }}>
                <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: entry.type === 'Rent' ? 'var(--success)' : 
                               entry.type === 'Expense' ? 'var(--danger)' : 'var(--warning)',
                    color: 'var(--bg)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--fs-12)',
                    fontWeight: 600
                  }}>
                    {entry.type}
                  </span>
                </td>
                <td style={{ padding: '12px', color: 'var(--text)', fontSize: 'var(--fs-14)' }}>
                  {entry.description}
                </td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600,
                  color: entry.amount >= 0 ? 'var(--success)' : 'var(--danger)'
                }}>
                  {entry.amount >= 0 ? '+' : ''}${Math.abs(entry.amount).toLocaleString()}
                </td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'var(--text)', 
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600
                }}>
                  ${entry.balance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}