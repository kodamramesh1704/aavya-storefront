'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { brand } from '@/brand.config';
import { NAV } from '@/lib/catalog';
import { computeTotals, useCart, useHydrated, useUI } from '@/store';
import type { Product } from '@/types';
import { Dialog } from '../ui/Dialog';
import { Icon, SocialIcon } from '../ui/Icon';
import { Accordion } from '../ui/Accordion';
import { QtyStepper } from '../ui/QtyStepper';
import { useMoney } from '../ui/Price';
import { CurrencySelect } from './Header';

// ------------------------- Mobile menu -------------------------
export function MobileMenu() {
  const open = useUI((s) => s.menuOpen);
  const set = useUI((s) => s.set);
  const close = () => set({ menuOpen: false });
  return (
    <Dialog open={open} onClose={close} title="Menu" variant="left">
      <nav aria-label="Mobile" className="px-5">
        {NAV.map((item) =>
          item.columns ? (
            <Accordion key={item.label} title={<span className="uppercase tracking-wider text-sm">{item.label}</span>}>
              <Link href={item.href} onClick={close} className="mb-3 block font-medium text-ink">View all {item.label}</Link>
              {item.columns.map((c) => (
                <div key={c.title} className="mb-4">
                  <p className="eyebrow mb-2">{c.title}</p>
                  <ul className="space-y-2">{c.links.map((l) => <li key={l.href}><Link href={l.href} onClick={close} className="block py-1 text-ink">{l.label}</Link></li>)}</ul>
                </div>
              ))}
            </Accordion>
          ) : (
            <Link key={item.label} href={item.href} onClick={close} className={`block border-b border-line py-4 text-sm uppercase tracking-wider font-medium ${item.highlight ? 'text-sale' : ''}`}>{item.label}</Link>
          )
        )}
        <div className="space-y-1 py-6 text-sm">
          <Link href="/account" onClick={close} className="flex items-center gap-3 py-2"><Icon name="user" size={20} /> My Account</Link>
          <Link href="/track-order" onClick={close} className="flex items-center gap-3 py-2"><Icon name="truck" size={20} /> Track Order</Link>
          <Link href="/contact" onClick={close} className="flex items-center gap-3 py-2"><Icon name="phone" size={20} /> Contact Us</Link>
          <div className="flex items-center gap-3 py-2"><span className="w-5" /> <CurrencySelect /></div>
        </div>
      </nav>
    </Dialog>
  );
}

// ------------------------- Search -------------------------
const TRENDING = ['Chanderi kurta', 'Lehenga', 'Silk saree', 'Co-ord set', 'Block print'];
export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const set = useUI((s) => s.set);
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const money = useMoney();
  const close = () => set({ searchOpen: false });

  useEffect(() => { if (open) try { setRecent(JSON.parse(localStorage.getItem('av-recent-search') || '[]')); } catch {} }, [open]);
  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(() => fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal }).then((r) => r.json()).then(setResults).catch(() => {}), 180);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r !== t)].slice(0, 5);
    try { localStorage.setItem('av-recent-search', JSON.stringify(next)); } catch {}
    close();
    router.push(`/search?q=${encodeURIComponent(t)}`);
  };

  const Chip = ({ t }: { t: string }) => <button type="button" onClick={() => submit(t)} className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink">{t}</button>;

  return (
    <Dialog open={open} onClose={close} title="Search" hideTitle variant="top" initialFocusRef={inputRef}>
      <div className="container py-5">
        <form role="search" onSubmit={(e) => { e.preventDefault(); submit(q); }} className="flex items-center gap-3 border-b-2 border-ink pb-2">
          <Icon name="search" />
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input ref={inputRef} id="site-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search kurtas, sarees, fabrics…" autoComplete="off" className="h-12 flex-1 bg-transparent text-lg outline-none focus-visible:outline-none" aria-controls="search-suggestions" />
          <button type="button" onClick={close} className="p-2" aria-label="Close search"><Icon name="close" /></button>
        </form>
        <div id="search-suggestions" aria-live="polite" className="py-6">
          {q.trim().length >= 2 ? (
            results.length ? (
              <>
                <p className="eyebrow mb-4">Products</p>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link href={`/products/${p.slug}`} onClick={close} className="flex items-center gap-4 hover:bg-bg">
                        <span className="relative h-20 w-16 shrink-0 bg-line/40"><Image src={p.images[0].src} alt="" fill sizes="64px" className="object-cover" /></span>
                        <span><span className="block text-sm">{p.name}</span><span className="text-sm text-muted">{money(p.price)}</span></span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => submit(q)} className="btn-ghost mt-6">See all results for “{q}”</button>
              </>
            ) : <p className="text-muted">No matches for “{q}”. Try a fabric (silk, linen) or a category (kurta, saree).</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {recent.length > 0 && <div><p className="eyebrow mb-3">Recent searches</p><div className="flex flex-wrap gap-2">{recent.map((t) => <Chip key={t} t={t} />)}</div></div>}
              <div><p className="eyebrow mb-3">Trending</p><div className="flex flex-wrap gap-2">{TRENDING.map((t) => <Chip key={t} t={t} />)}</div></div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

// ------------------------- Free shipping meter -------------------------
export function FreeShippingMeter({ amount }: { amount: number }) {
  const money = useMoney();
  const goal = brand.shipping.freeThreshold;
  const left = Math.max(0, goal - amount);
  const pct = Math.min(100, (amount / goal) * 100);
  return (
    <div>
      <p className="mb-2 text-sm">{left > 0 ? <>You’re <strong>{money(left)}</strong> away from free shipping</> : <><Icon name="check" size={16} className="mr-1 inline text-success" />You’ve unlocked <strong>free shipping</strong></>}</p>
      <div className="h-1.5 w-full bg-line" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(amount, goal)}>
        <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ------------------------- Cart drawer -------------------------
export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const set = useUI((s) => s.set);
  const { lines, setQty, remove, coupon, giftWrap } = useCart();
  const h = useHydrated();
  const money = useMoney();
  const close = () => set({ cartOpen: false });
  const t = computeTotals(lines, coupon, giftWrap);
  const items = h ? lines : [];
  return (
    <Dialog open={open} onClose={close} title={`Your Bag${items.length ? ` (${items.reduce((s, l) => s + l.qty, 0)})` : ''}`} variant="right"
      footer={items.length ? (
        <div className="space-y-3">
          <div className="flex justify-between text-base"><span>Subtotal</span><span className="font-medium">{money(t.subtotal - t.discount)}</span></div>
          <p className="text-xs text-muted">Inclusive of all taxes. Shipping and coupons are calculated at checkout.</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/cart" onClick={close} className="btn-outline">View Bag</Link>
            <Link href="/checkout" onClick={close} className="btn-primary">Checkout</Link>
          </div>
        </div>
      ) : undefined}
    >
      {items.length ? (
        <div className="p-5">
          <FreeShippingMeter amount={t.subtotal - t.discount} />
          <ul className="mt-6 divide-y divide-line">
            {items.map((l) => (
              <li key={l.key} className="flex gap-4 py-5">
                <Link href={`/products/${l.slug}`} onClick={close} className="relative h-28 w-[84px] shrink-0 bg-line/40"><Image src={l.image} alt="" fill sizes="84px" className="object-cover" /></Link>
                <div className="flex flex-1 flex-col">
                  <Link href={`/products/${l.slug}`} onClick={close} className="text-sm leading-snug hover:underline">{l.name}</Link>
                  <p className="mt-1 text-xs text-muted">Size: {l.size} · {l.color}</p>
                  <p className="mt-1 text-sm">{money(l.price)}{l.compareAtPrice && <s className="ml-2 text-xs text-muted">{money(l.compareAtPrice)}</s>}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QtyStepper small value={l.qty} max={l.maxQty} onChange={(n) => setQty(l.key, n)} label={`Quantity for ${l.name}`} />
                    <button type="button" onClick={() => remove(l.key)} className="text-xs underline underline-offset-4">Remove<span className="sr-only"> {l.name}</span></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid place-items-center gap-4 p-10 text-center">
          <Icon name="bag" size={40} strokeWidth={1} />
          <p className="font-display text-2xl">Your bag is empty</p>
          <p className="text-sm text-muted">Start with something new from the studio.</p>
          <Link href="/collections/new-arrivals" onClick={close} className="btn-primary mt-2">Shop New Arrivals</Link>
        </div>
      )}
    </Dialog>
  );
}

// ------------------------- Toast + WhatsApp -------------------------
export function Toast() {
  const toast = useUI((s) => s.toast);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[110] flex justify-center px-4">
      {toast && <p className="animate-[fadeIn_.2s] rounded bg-ink px-5 py-3 text-sm text-bg shadow-lg">{toast}</p>}
    </div>
  );
}

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith('/checkout')) return null;
  return (
    <a href={`https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent('Hi, I need help with my order.')}`} target="_blank" rel="noopener noreferrer"
      className={`fixed right-4 z-40 ${pathname.startsWith('/products') ? 'bottom-20 lg:bottom-4' : 'bottom-4'} grid h-14 w-14 place-items-center rounded-full bg-[#1F8F4E] text-white shadow-lg transition-transform hover:scale-105`}
      aria-label="Chat with us on WhatsApp (opens in a new tab)">
      <SocialIcon name="whatsapp" size={28} />
    </a>
  );
}
