// Dashboard-scoped formatting utilities - Genesis specification

import { format } from 'date-fns';

/**
 * Format currency values with thousands separators
 * @param n - Number value (in dollars, not cents)
 * @param decimals - 0 for integers ($1,268) or 2 for precise ($85,086.19)
 */
export function fmtMoney(n: number, decimals: 0 | 2 = 0): string {
  if (isNaN(n)) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Format percentage values with specified decimals
 * @param n - Number value as decimal (0.942 -> 94.2%)
 * @param decimals - Number of decimal places (default 1)
 */
export function fmtPct(n: number, decimals: number = 1): string {
  if (isNaN(n)) return '0%';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Format ISO date string to "Mon D, YYYY" format
 * @param iso - ISO date string
 */
export function fmtDate(iso: string): string {
  if (!iso) return 'Unknown Date';
  
  try {
    const date = new Date(iso);
    return format(date, 'MMM d, yyyy'); // Sep 4, 2025
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Clamp number to 0..1 range
 * @param n - Number to clamp
 */
export function clamp01(n: number): number {
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/**
 * Format large numbers with K/M suffixes
 * @param n - Number to format
 */
export function fmtCompact(n: number): string {
  if (isNaN(n)) return '0';
  
  const absN = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  
  if (absN >= 1000000) {
    return `${sign}${(absN / 1000000).toFixed(1)}M`;
  } else if (absN >= 1000) {
    return `${sign}${(absN / 1000).toFixed(1)}K`;
  } else {
    return `${sign}${absN.toLocaleString()}`;
  }
}

/**
 * Format number of days in human-friendly way
 * @param days - Number of days
 */
export function fmtDays(days: number): string {
  if (isNaN(days)) return '0 days';
  
  const absdays = Math.abs(days);
  if (absdays === 1) return '1 day';
  return `${Math.round(absdays)} days`;
}