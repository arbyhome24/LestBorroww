import { CurrencyCode } from '../types';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromIDR: number; // 1 IDR = ? Foreign
  locale: string;
  fractionDigits: number;
}

/**
 * Exchange Rate Configuration Table (Base: IDR)
 * Easily updatable in a single place with automatic fallback
 */
export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    rateFromIDR: 1,
    locale: 'id-ID',
    fractionDigits: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromIDR: 1 / 15850,
    locale: 'en-US',
    fractionDigits: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateFromIDR: 1 / 17200,
    locale: 'de-DE',
    fractionDigits: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateFromIDR: 1 / 20100,
    locale: 'en-GB',
    fractionDigits: 2,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    rateFromIDR: 1 / 11800,
    locale: 'en-SG',
    fractionDigits: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    rateFromIDR: 1 / 105,
    locale: 'ja-JP',
    fractionDigits: 0,
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    rateFromIDR: 1 / 2200,
    locale: 'zh-CN',
    fractionDigits: 2,
  },
  THB: {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    rateFromIDR: 1 / 460,
    locale: 'th-TH',
    fractionDigits: 0,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rateFromIDR: 1 / 188,
    locale: 'en-IN',
    fractionDigits: 0,
  },
  VND: {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    rateFromIDR: 1 / 0.62,
    locale: 'vi-VN',
    fractionDigits: 0,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    rateFromIDR: 1 / 4315,
    locale: 'ar-AE',
    fractionDigits: 2,
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    rateFromIDR: 1 / 11.5,
    locale: 'ko-KR',
    fractionDigits: 0,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateFromIDR: 1 / 10300,
    locale: 'en-AU',
    fractionDigits: 2,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    rateFromIDR: 1 / 11400,
    locale: 'en-CA',
    fractionDigits: 2,
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    rateFromIDR: 1 / 3450,
    locale: 'ms-MY',
    fractionDigits: 2,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    name: 'Saudi Riyal',
    rateFromIDR: 1 / 4220,
    locale: 'ar-SA',
    fractionDigits: 2,
  },
};

/**
 * Converts a base IDR amount to target currency and returns formatted string
 * Uses Intl.NumberFormat with relevant country locale and fallbacks.
 */
export function formatCurrency(
  amountIDR: number,
  currencyCode: CurrencyCode = 'IDR'
): string {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.IDR;
  const rate = config.rateFromIDR && !isNaN(config.rateFromIDR) ? config.rateFromIDR : 1;
  const converted = amountIDR * rate;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: config.fractionDigits,
      maximumFractionDigits: config.fractionDigits,
    }).format(converted);
  } catch {
    try {
      const formattedNum = converted.toLocaleString(config.locale || 'en-US', {
        minimumFractionDigits: config.fractionDigits,
        maximumFractionDigits: config.fractionDigits,
      });
      return `${config.symbol} ${formattedNum}`;
    } catch {
      return `${config.symbol} ${converted.toFixed(config.fractionDigits)}`;
    }
  }
}

/**
 * Formats distance with unit based on currency/region
 */
export function formatDistance(distanceKm: number, currencyCode: CurrencyCode = 'IDR'): string {
  if (currencyCode === 'USD' || currencyCode === 'GBP') {
    const miles = distanceKm * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
