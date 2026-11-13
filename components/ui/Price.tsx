'use client';
import { formatPrice, cx } from '@/lib/format';
import { useCurrency, useHydrated } from '@/store';
import { discountPct } from '@/lib/product-utils';

export function useMoney() {
  const currency = useCurrency((s) => s.currency);
  const h = useHydrated();
  return (inr: number) => formatPrice(inr, h ? currency : 'INR');
}

export function Price({ price, compareAtPrice, size = 'md', className }: { price: number; compareAtPrice: number | null; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const money = useMoney();
  const pct = discountPct({ price, compareAtPrice });
  return (
    <p className={cx('flex flex-wrap items-baseline gap-x-2', size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-[15px]', className)}>
      <span className="font-medium">{pct ? <span className="sr-only">Sale price </span> : null}{money(price)}</span>
      {pct > 0 && (
        <>
          <s className="text-muted text-[0.9em]"><span className="sr-only">Original price </span>{money(compareAtPrice!)}</s>
          <span className="text-sale font-medium text-[0.9em]">({pct}% off)</span>
        </>
      )}
    </p>
  );
}
