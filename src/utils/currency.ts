/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Currency utilities for Ashta Gupta Photography Portfolio
 * Default Currency: INR (₹ - Indian Rupee)
 */

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateToInr: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', rateToInr: 1 },
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rateToInr: 86.5 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rateToInr: 91.2 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', rateToInr: 109.5 },
};

/**
 * Converts legacy price values (< 10,000) that were originally stored in USD to INR
 */
export function normalizeToINR(amount: number): number {
  if (amount > 0 && amount < 10000) {
    return Math.round(amount * 85);
  }
  return amount;
}

/**
 * Formats an amount using the Indian numbering system in INR (default)
 */
export function formatINR(amount: number): string {
  const inr = normalizeToINR(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inr);
}

/**
 * Formats an amount in any selected currency with INR as default
 */
export function formatPrice(amount: number, currency: CurrencyCode = 'INR'): string {
  const inr = normalizeToINR(amount);

  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(inr);
  }

  const converted = inr / CURRENCIES[currency].rateToInr;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(converted);
}
