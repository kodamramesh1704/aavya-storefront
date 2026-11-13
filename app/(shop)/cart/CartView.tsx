'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { brand } from '@/brand.config';
import { CATEGORIES } from '@/lib/catalog';
import { computeTotals, GIFT_WRAP_FEE, useCart, useHydrated, useUI, useWishlist } from '@/store';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { useMoney } from '@/components/ui/Price';
import { SummaryRows } from '@/components/ui/OrderSummary';
import { FreeShippingMeter } from '@/components/layout/Overlays';
import { Icon } from '@/components/ui/Icon';

export function CouponField() {
  const { coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (coupon)
    return (
      <div className="flex items-center justify-between border border-dashed border-success bg-success/5 px-4 py-3 text-sm" role="status">
        <span><Icon name="check" size={16} className="mr-1 inline text-success" /><strong>{coupon}</strong> applied</span>
        <button type="button" onClick={() => { removeCoupon(); setMsg(null); }} className="underline underline-offset-4">Remove</button>
      </div>
    );
  return (
    <form onSubmit={(e) => { e.preventDefault(); const r = applyCoupon(code); setMsg({ ok: r.ok, text: r.message }); if (r.ok) setCode(''); }} noValidate>
      <label htmlFor="coupon" className="label">Coupon code</label>
      <div className="flex">
        <input id="coupon" value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setMsg(null); }} placeholder="e.g. WELCOME10" className="input h-11 flex-1 uppercase" aria-describedby="coupon-msg" aria-invalid={msg?.ok === false} autoComplete="off" />
        <button type="submit" disabled={!code.trim()} className="h-11 border border-l-0 border-ink px-5 text-sm font-medium uppercase tracking-wide disabled:opacity-50">Apply</button>
      </div>
      <p id="coupon-msg" aria-live="polite" className={`mt-2 text-sm ${msg?.ok ? 'text-success' : 'text-sale'}`}>{msg?.text}</p>
      <p className="text-xs text-muted">Try {Object.keys(brand.coupons).join(' or ')}</p>
    </form>
  );
}

export function CartView() {
  const h = useHydrated();
  const { lines, setQty, remove, coupon, giftWrap, giftMessage, setGift } = useCart();
  const toggleWish = useWishlist((s) => s.toggle);
  const hasWish = useWishlist((s) => s.has);
  const toast = useUI((s) => s.showToast);
  const money = useMoney();
  if (!h) return <div className="h-96" />;
  const t = computeTotals(lines, coupon, giftWrap);

  if (!lines.length)
    return (
      <div className="grid place-items-center gap-4 py-16 text-center">
        <Icon name="bag" size={48} strokeWidth={1} />
        <h1 className="text-display-lg">Your bag is empty</h1>
        <p className="text-muted">Looks like you haven’t added anything yet.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {CATEGORIES.slice(0, 6).map((c) => <Link key={c.slug} href={`/collections/${c.slug}`} className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink">{c.name}</Link>)}
        </div>
        <Link href="/collections/new-arrivals" className="btn-primary mt-4">Shop New Arrivals</Link>
      </div>
    );

  return (
    <>
      <h1 className="pb-6 text-display-lg">Your Bag <span className="font-sans text-lg text-muted">({lines.reduce((s, l) => s + l.qty, 0)} items)</span></h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-6 bg-surface p-4"><FreeShippingMeter amount={t.subtotal - t.discount} /></div>
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-6">
                <Link href={`/products/${l.slug}`} className="relative h-36 w-28 shrink-0 bg-line/40 md:h-44 md:w-32"><Image src={l.image} alt={l.name} fill sizes="128px" className="object-cover" /></Link>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex justify-between gap-4">
                    <Link href={`/products/${l.slug}`} className="hover:underline">{l.name}</Link>
                    <p className="shrink-0 text-right font-medium">{money(l.price * l.qty)}{l.compareAtPrice && <s className="block text-xs font-normal text-muted">{money(l.compareAtPrice * l.qty)}</s>}</p>
                  </div>
                  <p className="text-sm text-muted">Size: {l.size} · Colour: {l.color}</p>
                  {l.maxQty <= 2 && <p className="text-xs font-medium text-sale">Only {l.maxQty} left</p>}
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-3">
                    <QtyStepper small value={l.qty} max={l.maxQty} onChange={(n) => setQty(l.key, n)} label={`Quantity for ${l.name}`} />
                    <button type="button" onClick={() => { if (!hasWish(l.productId)) toggleWish(l.productId); remove(l.key); toast('Moved to wishlist'); }} className="text-sm underline underline-offset-4">Move to wishlist<span className="sr-only">: {l.name}</span></button>
                    <button type="button" onClick={() => remove(l.key)} className="text-sm underline underline-offset-4">Remove<span className="sr-only"> {l.name}</span></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 border border-line bg-surface p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={giftWrap} onChange={(e) => setGift(e.target.checked)} className="mt-1 h-4 w-4 accent-[rgb(var(--c-primary))]" />
              <span><span className="flex items-center gap-2 font-medium"><Icon name="gift" size={18} /> Gift wrap this order (+{money(GIFT_WRAP_FEE)})</span><span className="text-sm text-muted">Hand-wrapped in reusable fabric with a handwritten note. Prices are hidden on the invoice.</span></span>
            </label>
            {giftWrap && (
              <div className="mt-4">
                <label htmlFor="gift-msg" className="label">Gift message (optional)</label>
                <textarea id="gift-msg" maxLength={200} rows={3} value={giftMessage} onChange={(e) => setGift(true, e.target.value)} className="input h-auto py-3" aria-describedby="gift-count" />
                <p id="gift-count" className="mt-1 text-right text-xs text-muted">{giftMessage.length}/200</p>
              </div>
            )}
          </div>
        </div>
        <aside aria-labelledby="sum-h" className="lg:sticky lg:top-36 lg:self-start">
          <div className="space-y-6 bg-surface p-6">
            <h2 id="sum-h" className="text-2xl">Order Summary</h2>
            <CouponField />
            <SummaryRows t={t} />
            <Link href="/checkout" className="btn-primary w-full">Proceed to Checkout</Link>
            <p className="flex items-center justify-center gap-2 text-xs text-muted"><Icon name="lock" size={14} /> Secure checkout · Easy 15-day returns</p>
          </div>
        </aside>
      </div>
    </>
  );
}
