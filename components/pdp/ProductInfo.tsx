'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { brand } from '@/brand.config';
import type { Product } from '@/types';
import { checkPincode, type PincodeResult } from '@/lib/pincode';
import { useAddToBag } from '@/lib/useAddToBag';
import { useRecent, useUI } from '@/store';
import { Price, useMoney } from '../ui/Price';
import { QtyStepper } from '../ui/QtyStepper';
import { WishlistButton } from '../ui/WishlistButton';
import { Accordion } from '../ui/Accordion';
import { Dialog } from '../ui/Dialog';
import { Icon, SocialIcon } from '../ui/Icon';
import { cx } from '@/lib/format';

const SIZE_CHART = [
  // size, bust, waist, hip, shoulder (inches)
  ['XS', 32, 26, 35, 13.5], ['S', 34, 28, 37, 14], ['M', 36, 30, 39, 14.5], ['L', 38, 32, 41, 15], ['XL', 40, 34, 43, 15.5], ['XXL', 42, 36, 45, 16],
] as const;

function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const f = (n: number) => (unit === 'in' ? n : Math.round(n * 2.54));
  return (
    <Dialog open={open} onClose={onClose} title="Size Guide" variant="right" className="max-w-xl">
      <div className="space-y-6 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">Body measurements</p>
          <div role="group" aria-label="Units" className="flex border border-line">
            {(['in', 'cm'] as const).map((u) => <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)} className={cx('h-9 px-4 text-sm', unit === u && 'bg-ink text-bg')}>{u === 'in' ? 'Inches' : 'Cm'}</button>)}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm">
            <caption className="sr-only">Size chart in {unit === 'in' ? 'inches' : 'centimetres'}</caption>
            <thead><tr className="border-b border-ink">{['Size', 'Bust', 'Waist', 'Hip', 'Shoulder'].map((h) => <th key={h} scope="col" className="py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>{SIZE_CHART.map(([s, ...m]) => <tr key={s} className="border-b border-line"><th scope="row" className="py-3 font-medium">{s}</th>{m.map((v, i) => <td key={i}>{f(v)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <div className="relative aspect-[3/4] bg-line/40"><Image src="/placeholder/size-guide.webp" alt="Illustration showing where to measure bust, waist and hip" fill sizes="120px" className="object-cover" /></div>
          <div className="text-sm text-muted">
            <p className="mb-2 font-medium text-ink">How to measure</p>
            <ul className="space-y-1.5">
              <li><strong className="text-ink">Bust:</strong> around the fullest part, tape level.</li>
              <li><strong className="text-ink">Waist:</strong> around the natural waistline.</li>
              <li><strong className="text-ink">Hip:</strong> around the fullest part of the hips.</li>
              <li><strong className="text-ink">Between sizes?</strong> Choose the larger size.</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted">Need help? <a href={`https://wa.me/${brand.contact.whatsapp}`} className="link" target="_blank" rel="noopener noreferrer">Chat with a stylist on WhatsApp</a>.</p>
      </div>
    </Dialog>
  );
}

function PincodeCheck() {
  const [pin, setPin] = useState('');
  const [res, setRes] = useState<PincodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { try { const p = localStorage.getItem('av-pin'); if (p) setPin(p); } catch {} }, []);
  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await checkPincode(pin.trim());
    setRes(r); setLoading(false);
    if (r.ok) try { localStorage.setItem('av-pin', pin.trim()); } catch {}
  };
  return (
    <form onSubmit={check} className="space-y-2" noValidate>
      <label htmlFor="pdp-pin" className="flex items-center gap-2 text-sm font-medium"><Icon name="pin" size={18} /> Check delivery</label>
      <div className="flex">
        <input id="pdp-pin" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setRes(null); }} placeholder="Enter pincode" className="input h-11 flex-1" aria-describedby="pin-result" aria-invalid={res?.ok === false} />
        <button type="submit" className="h-11 border border-l-0 border-ink px-5 text-sm font-medium uppercase tracking-wide" disabled={loading}>{loading ? 'Checking…' : 'Check'}</button>
      </div>
      <div id="pin-result" aria-live="polite" className="text-sm">
        {res?.ok === false && <p className="text-sale">{res.error}</p>}
        {res?.ok && (
          <ul className="space-y-1 pt-1">
            <li className="flex gap-2"><Icon name="truck" size={18} className="text-success" />Delivery by <strong>{res.date}</strong>{res.city && <> to {res.city}</>}</li>
            <li className="flex gap-2"><Icon name={res.cod ? 'check' : 'close'} size={18} className={res.cod ? 'text-success' : 'text-sale'} />{res.cod ? 'Cash on Delivery available' : 'Cash on Delivery not available for this pincode'}</li>
            <li className="flex gap-2"><Icon name="return" size={18} className="text-success" />15-day easy returns</li>
          </ul>
        )}
      </div>
    </form>
  );
}

export function ProductInfo({ product: p }: { product: Product }) {
  const [color, setColor] = useState(p.colors[0].name);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [stickyBar, setStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLFieldSetElement>(null);
  const addToBag = useAddToBag();
  const router = useRouter();
  const toast = useUI((s) => s.showToast);
  const pushRecent = useRecent((s) => s.push);
  const money = useMoney();
  const isApparel = p.sizes.length > 1;
  const stock = size ? p.stock[size] ?? 0 : 0;
  const soldOut = p.sizes.every((s) => !p.stock[s]);

  useEffect(() => { pushRecent(p.id); }, [p.id, pushRecent]);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStickyBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const requireSize = () => {
    if (size) return true;
    setSizeError(true);
    sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    sizeRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();
    return false;
  };
  const onAdd = () => { if (requireSize()) addToBag(p, size!, color, qty); };
  const onBuy = () => { if (requireSize()) { addToBag(p, size!, color, qty, false); router.push('/checkout'); } };
  const share = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { toast('Could not copy link'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-md">{p.name}</h1>
        <p className="mt-1 text-xs text-muted">SKU: {p.sku}</p>
        <div className="mt-4"><Price price={p.price} compareAtPrice={p.compareAtPrice} size="lg" /></div>
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
      </div>

      {/* Colour */}
      <fieldset>
        <legend className="mb-3 text-sm"><span className="font-medium">Colour:</span> {color}</legend>
        <div className="flex flex-wrap gap-3">
          {p.colors.map((c) => (
            <label key={c.name} className="cursor-pointer" title={c.name}>
              <input type="radio" name="color" value={c.name} checked={color === c.name} onChange={() => setColor(c.name)} className="peer sr-only" />
              <span className="block h-9 w-9 rounded-full ring-1 ring-ink/20 ring-offset-2 ring-offset-bg peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary" style={{ background: c.hex }} />
              <span className="sr-only">{c.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Size */}
      <fieldset ref={sizeRef} aria-describedby={sizeError ? 'size-error' : undefined}>
        <div className="mb-3 flex items-center justify-between">
          <legend className="text-sm"><span className="font-medium">Size:</span> {size ?? (isApparel ? 'Select a size' : '')}</legend>
          {isApparel && <button type="button" onClick={() => setGuide(true)} className="flex items-center gap-1 text-sm underline underline-offset-4"><Icon name="tag" size={16} /> Size Guide</button>}
        </div>
        <div className="flex flex-wrap gap-2">
          {p.sizes.map((s) => {
            const out = !p.stock[s];
            return (
              <label key={s} className={cx('relative', out ? 'cursor-not-allowed' : 'cursor-pointer')}>
                <input type="radio" name="size" value={s} checked={size === s} disabled={out} onChange={() => { setSize(s); setSizeError(false); setQty(1); }} className="peer sr-only" />
                <span className={cx('grid h-12 min-w-12 place-items-center border px-3 text-sm transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary',
                  out ? 'border-line text-muted/60 line-through' : size === s ? 'border-ink bg-ink text-bg' : 'border-line hover:border-ink')}>{s}</span>
                {out && <span className="sr-only"> (sold out)</span>}
              </label>
            );
          })}
        </div>
        <div aria-live="polite" className="mt-2 min-h-5 text-sm">
          {sizeError && <p id="size-error" className="text-sale">Please select a size to continue.</p>}
          {!sizeError && size && stock > 0 && stock <= 2 && <p className="font-medium text-sale">Only {stock} left in this size</p>}
        </div>
      </fieldset>

      {/* CTAs */}
      <div ref={ctaRef} className="space-y-3">
        <div className="flex gap-3">
          <QtyStepper value={qty} onChange={setQty} max={Math.max(1, Math.min(stock || 5, 5))} />
          <button type="button" onClick={onAdd} disabled={soldOut} className="btn-primary flex-1">{soldOut ? 'Sold out' : 'Add to Bag'}</button>
          <WishlistButton id={p.id} name={p.name} className="h-12 w-12 shrink-0 border border-line hover:border-ink" />
        </div>
        {!soldOut && <button type="button" onClick={onBuy} className="btn-outline w-full">Buy Now</button>}
      </div>

      <div className="border-y border-line py-5"><PincodeCheck /></div>

      {/* Offers */}
      <details className="group rounded border border-dashed border-accent/60 bg-surface p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2"><Icon name="tag" size={18} className="text-accent" /> Offers available ({Object.keys(brand.coupons).length + brand.bankOffers.length})</span>
          <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-3 space-y-2 text-sm">
          {Object.entries(brand.coupons).map(([code, c]) => <li key={code}>Use <strong className="font-medium tracking-wide">{code}</strong>: {c.label}</li>)}
          {brand.bankOffers.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </details>

      {/* Accordions */}
      <div className="border-t border-line">
        <Accordion headingLevel={2} title="Product Details" defaultOpen>
          <p className="mb-3">{p.description}</p>
          <ul className="list-disc space-y-1 pl-5">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
        </Accordion>
        <Accordion headingLevel={2} title="Fabric & Care">
          <p className="mb-2"><strong className="text-ink">Fabric:</strong> {p.fabric}</p>
          <ul className="list-disc space-y-1 pl-5">{p.care.map((d) => <li key={d}>{d}</li>)}</ul>
        </Accordion>
        <Accordion headingLevel={2} title="Shipping & Returns">
          <p>Free shipping on orders above {money(brand.shipping.freeThreshold)}. Ships in 2–3 business days. Returns and exchanges within 15 days of delivery, except customised and sale accessories. <Link href="/policies/returns" className="link">Read the full policy</Link>.</p>
        </Accordion>
        <Accordion headingLevel={2} title="Disclaimer">
          <p>Each piece is handcrafted, so slight variations in colour, print and embroidery are part of its character, not a defect. Colours may look slightly different depending on your screen.</p>
        </Accordion>
      </div>

      {/* Share */}
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">Share:</span>
        <a href={`https://wa.me/?text=${encodeURIComponent(p.name + ' ' + brand.url + '/products/' + p.slug)}`} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink" aria-label="Share on WhatsApp (opens in a new tab)"><SocialIcon name="whatsapp" size={18} /></a>
        <button type="button" onClick={share} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink" aria-label="Copy link"><Icon name="copy" size={18} /></button>
      </div>

      <SizeGuide open={guide} onClose={() => setGuide(false)} />

      {/* Mobile sticky add-to-bag */}
      <div className={cx('fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface p-3 transition-transform duration-300 lg:hidden', stickyBar ? 'translate-y-0' : 'translate-y-full')} aria-hidden={!stickyBar}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{p.name}</p>
            <p className="text-sm font-medium">{money(p.price)}{size && <span className="font-normal text-muted"> · {size}</span>}</p>
          </div>
          <button type="button" tabIndex={stickyBar ? 0 : -1} onClick={onAdd} disabled={soldOut} className="btn-primary h-11 shrink-0 px-5">{size ? 'Add to Bag' : 'Select Size'}</button>
        </div>
      </div>
    </div>
  );
}
