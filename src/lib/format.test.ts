import { formatNumber, formatPercent, formatCurrencyFromCents, BLANK } from './format';

describe('formatNumber', () => {
  it('handles null and undefined', () => {
    expect(formatNumber(null)).toBe(BLANK);
    expect(formatNumber(undefined)).toBe(BLANK);
  });

  it('handles NaN and Infinity', () => {
    expect(formatNumber(NaN)).toBe(BLANK);
    expect(formatNumber(Infinity)).toBe(BLANK);
    expect(formatNumber(-Infinity)).toBe(BLANK);
  });

  it('formats numbers with default 0 decimals', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(-1234)).toBe('-1,234');
  });

  it('formats numbers with specified decimals', () => {
    expect(formatNumber(42.567, { decimals: 2 })).toBe('42.57');
    expect(formatNumber(42, { decimals: 2 })).toBe('42.00');
    expect(formatNumber(1234.5, { decimals: 1 })).toBe('1,234.5');
  });

  it('clamps decimals to 0-3 range', () => {
    expect(formatNumber(42.123456, { decimals: -1 })).toBe('42');
    expect(formatNumber(42.123456, { decimals: 5 })).toBe('42.123');
  });

  it('handles stringy numbers', () => {
    expect(formatNumber('123')).toBe('123');
    expect(formatNumber('123.45', { decimals: 2 })).toBe('123.45');
    expect(formatNumber('not-a-number')).toBe(BLANK);
  });

  it('handles large numbers', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(-1000000)).toBe('-1,000,000');
  });
});

describe('formatPercent', () => {
  it('handles null and undefined', () => {
    expect(formatPercent(null)).toBe(BLANK);
    expect(formatPercent(undefined)).toBe(BLANK);
  });

  it('handles NaN and Infinity', () => {
    expect(formatPercent(NaN)).toBe(BLANK);
    expect(formatPercent(Infinity)).toBe(BLANK);
    expect(formatPercent(-Infinity)).toBe(BLANK);
  });

  it('formats fractions with default basis', () => {
    expect(formatPercent(0)).toBe('0.0%');
    expect(formatPercent(0.5)).toBe('50.0%');
    expect(formatPercent(1)).toBe('100.0%');
    expect(formatPercent(0.123)).toBe('12.3%');
  });

  it('formats percents with percent basis', () => {
    expect(formatPercent(0, { basis: 'percent' })).toBe('0.0%');
    expect(formatPercent(50, { basis: 'percent' })).toBe('50.0%');
    expect(formatPercent(100, { basis: 'percent' })).toBe('100.0%');
    expect(formatPercent(12.3, { basis: 'percent' })).toBe('12.3%');
  });

  it('formats with custom decimals', () => {
    expect(formatPercent(0.1234, { decimals: 0 })).toBe('12%');
    expect(formatPercent(0.1234, { decimals: 2 })).toBe('12.34%');
    expect(formatPercent(0.1234, { decimals: 3 })).toBe('12.340%');
  });

  it('clamps decimals to 0-3 range', () => {
    expect(formatPercent(0.1234, { decimals: -1 })).toBe('12%');
    expect(formatPercent(0.1234, { decimals: 5 })).toBe('12.340%');
  });

  it('handles stringy numbers', () => {
    expect(formatPercent('0.5')).toBe('50.0%');
    expect(formatPercent('not-a-number')).toBe(BLANK);
  });

  it('handles basis behavior correctly', () => {
    // Same input, different basis should give different results
    expect(formatPercent(50, { basis: 'fraction' })).toBe('5,000.0%');
    expect(formatPercent(50, { basis: 'percent' })).toBe('50.0%');
  });
});

describe('formatCurrencyFromCents', () => {
  it('handles null and undefined', () => {
    expect(formatCurrencyFromCents(null)).toBe(BLANK);
    expect(formatCurrencyFromCents(undefined)).toBe(BLANK);
  });

  it('handles NaN and Infinity', () => {
    expect(formatCurrencyFromCents(NaN)).toBe(BLANK);
    expect(formatCurrencyFromCents(Infinity)).toBe(BLANK);
    expect(formatCurrencyFromCents(-Infinity)).toBe(BLANK);
  });

  it('formats integer cents to currency', () => {
    expect(formatCurrencyFromCents(0)).toBe('$0.00');
    expect(formatCurrencyFromCents(100)).toBe('$1.00');
    expect(formatCurrencyFromCents(1234)).toBe('$12.34');
    expect(formatCurrencyFromCents(123456)).toBe('$1,234.56');
  });

  it('handles negative values', () => {
    expect(formatCurrencyFromCents(-100)).toBe('-$1.00');
    expect(formatCurrencyFromCents(-1234)).toBe('-$12.34');
  });

  it('handles numeric strings', () => {
    expect(formatCurrencyFromCents('100')).toBe('$1.00');
    expect(formatCurrencyFromCents('1234')).toBe('$12.34');
    expect(formatCurrencyFromCents('-100')).toBe('-$1.00');
  });

  it('handles decimal strings (coerces to number)', () => {
    expect(formatCurrencyFromCents('100.5')).toBe('$1.01');
    expect(formatCurrencyFromCents('123.7')).toBe('$1.24');
  });

  it('rejects non-numeric strings', () => {
    expect(formatCurrencyFromCents('not-a-number')).toBe(BLANK);
    expect(formatCurrencyFromCents('$100')).toBe(BLANK);
    expect(formatCurrencyFromCents('abc123')).toBe(BLANK);
    expect(formatCurrencyFromCents('')).toBe(BLANK);
    expect(formatCurrencyFromCents('   ')).toBe(BLANK);
  });

  it('handles different currencies', () => {
    expect(formatCurrencyFromCents(100, { currency: 'EUR' })).toBe('€1.00');
    expect(formatCurrencyFromCents(100, { currency: 'GBP' })).toBe('£1.00');
  });

  it('handles large amounts', () => {
    expect(formatCurrencyFromCents(100000000)).toBe('$1,000,000.00');
    expect(formatCurrencyFromCents(-100000000)).toBe('-$1,000,000.00');
  });
});

describe('BLANK constant', () => {
  it('is the em dash character', () => {
    expect(BLANK).toBe('—');
  });
});