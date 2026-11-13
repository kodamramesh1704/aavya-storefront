import { brand, type CurrencyCode } from '@/brand.config';

export function formatPrice(inr: number, currency: CurrencyCode = 'INR') {
  const value = inr * brand.currency.rates[currency];
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(value);
}
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
