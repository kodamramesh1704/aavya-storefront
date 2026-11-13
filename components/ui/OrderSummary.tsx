'use client';
import Image from 'next/image';
import type { CartLine } from '@/types';
import type { computeTotals } from '@/store';
import { useMoney } from './Price';

type Totals = ReturnType<typeof computeTotals>;

export function SummaryRows({ t, shippingLabel }: { t: Totals; shippingLabel?: string }) {
  const money = useMoney();
  const savings = t.mrp - t.subtotal;
  return (
    <div>
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between"><dt>Subtotal (MRP)</dt><dd>{money(t.mrp)}</dd></div>
      {savings > 0 && <div className="flex justify-between text-success"><dt>Discount on MRP</dt><dd>−{money(savings)}</dd></div>}
      {t.discount > 0 && <div className="flex justify-between text-success"><dt>Coupon ({t.couponApplied})</dt><dd>−{money(t.discount)}</dd></div>}
      <div className="flex justify-between"><dt>{shippingLabel ?? 'Shipping'}</dt><dd>{t.shipping ? money(t.shipping) : 'Free'}</dd></div>
      {t.gift > 0 && <div className="flex justify-between"><dt>Gift wrap</dt><dd>{money(t.gift)}</dd></div>}
      {t.paymentFee > 0 && <div className="flex justify-between"><dt>COD fee</dt><dd>{money(t.paymentFee)}</dd></div>}
      <div className="flex justify-between border-t border-line pt-3 text-base font-medium"><dt>Total</dt><dd>{money(t.total)}</dd></div>
    </dl>
    <p className="mt-2 text-xs text-muted">Inclusive of GST ({money(t.gst)})</p>
    </div>
  );
}

export function SummaryLines({ lines }: { lines: CartLine[] }) {
  const money = useMoney();
  return (
    <ul className="space-y-4">
      {lines.map((l) => (
        <li key={l.key} className="flex gap-3">
          <span className="relative h-20 w-16 shrink-0 bg-line/40">
            <Image src={l.image} alt="" fill sizes="64px" className="object-cover" />
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-muted px-1 text-[11px] text-white">{l.qty}<span className="sr-only"> items</span></span>
          </span>
          <span className="flex-1 text-sm"><span className="block leading-snug">{l.name}</span><span className="text-xs text-muted">{l.size} · {l.color}</span></span>
          <span className="text-sm">{money(l.price * l.qty)}</span>
        </li>
      ))}
    </ul>
  );
}
