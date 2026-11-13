'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV, type NavItem } from '@/lib/catalog';
import { brand, type CurrencyCode } from '@/brand.config';
import { cartCount, useCart, useCurrency, useHydrated, useUI, useWishlist } from '@/store';
import { Icon } from '../ui/Icon';
import { Logo } from './Logo';
import { cx } from '@/lib/format';

export function CurrencySelect({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const h = useHydrated();
  return (
    <label className={cx('relative inline-flex items-center text-sm', className)}>
      <span className="sr-only">Currency</span>
      <select value={h ? currency : 'INR'} onChange={(e) => setCurrency(e.target.value as CurrencyCode)} className="cursor-pointer appearance-none bg-transparent py-2 pl-1 pr-5">
        {brand.currency.supported.map((c) => <option key={c} value={c}>{c === 'INR' ? '₹ INR' : '$ USD'}</option>)}
      </select>
      <Icon name="chevronDown" size={14} className="pointer-events-none absolute right-0" />
    </label>
  );
}

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-fg" aria-hidden="true">{n}</span>;
}

function MegaItem({ item, open, setOpen }: { item: NavItem; open: boolean; setOpen: (v: boolean) => void }) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const btnRef = useRef<HTMLButtonElement>(null);
  const hasPanel = !!item.columns?.length;
  const pathname = usePathname();
  const active = pathname === item.href;
  const enter = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), 120); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 150); };

  return (
    <li
      onMouseEnter={hasPanel ? enter : undefined}
      onMouseLeave={hasPanel ? leave : undefined}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { setOpen(false); btnRef.current?.focus(); } }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
      className="flex items-center"
    >
      <Link href={item.href} aria-current={active ? 'page' : undefined} className={cx('relative py-3 text-[13px] uppercase tracking-[0.12em] after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100', item.highlight && 'text-sale font-medium', (open || active) && 'after:scale-x-100')}>
        {item.label}
      </Link>
      {hasPanel && (
        <button ref={btnRef} type="button" aria-expanded={open} aria-controls={`mega-${item.label}`} onClick={() => setOpen(!open)} className="ml-0.5 p-1 opacity-60 hover:opacity-100">
          <Icon name="chevronDown" size={14} className={cx('transition-transform', open && 'rotate-180')} />
          <span className="sr-only">{item.label} menu</span>
        </button>
      )}
      {hasPanel && (
        <div id={`mega-${item.label}`} hidden={!open} className="absolute inset-x-0 top-full border-t border-line bg-surface shadow-lg">
          <div className="container grid grid-cols-12 gap-8 py-8">
            {item.columns!.map((col) => (
              <div key={col.title} className="col-span-2">
                <p className="eyebrow mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)} className="text-sm hover:underline">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-6 col-start-7 grid grid-cols-2 gap-4">
              {item.tiles?.map((t) => (
                <Link key={t.href + t.label} href={t.href} onClick={() => setOpen(false)} className="group/tile block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-line/40">
                    <Image src={t.image} alt="" fill sizes="20vw" className="object-cover transition-transform duration-700 group-hover/tile:scale-105" />
                  </div>
                  <p className="mt-2 text-sm font-medium">{t.label} <span aria-hidden="true">→</span></p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const setUI = useUI((s) => s.set);
  const h = useHydrated();
  const count = useCart((s) => cartCount(s.lines));
  const wish = useWishlist((s) => s.ids.length);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpenMenu(null), [pathname]);

  const iconBtn = 'relative grid h-10 w-10 place-items-center';
  return (
    <header className={cx('sticky top-0 z-50 bg-bg/95 backdrop-blur transition-shadow', scrolled && 'shadow-[0_1px_0_rgb(var(--c-line))]')}>
      <div className={cx('container grid grid-cols-[1fr_auto_1fr] items-center transition-all', scrolled ? 'h-14' : 'h-16 md:h-20')}>
        <div className="flex items-center gap-1">
          <button type="button" className={cx(iconBtn, 'lg:hidden -ml-2')} onClick={() => setUI({ menuOpen: true })} aria-label="Open menu"><Icon name="menu" /></button>
          <button type="button" className={cx(iconBtn, 'lg:-ml-2')} onClick={() => setUI({ searchOpen: true })} aria-label="Search"><Icon name="search" /></button>
        </div>
        <Logo compact={scrolled} />
        <div className="flex items-center justify-end gap-0.5 md:gap-1">
          <CurrencySelect className="mr-2 hidden md:inline-flex" />
          <Link href="/account" className={cx(iconBtn, 'hidden md:grid')} aria-label="Account"><Icon name="user" /></Link>
          <Link href="/wishlist" className={iconBtn} aria-label={`Wishlist${h && wish ? `, ${wish} items` : ''}`}><Icon name="heart" />{h && <CountBadge n={wish} />}</Link>
          <button type="button" className={cx(iconBtn, '-mr-2')} onClick={() => setUI({ cartOpen: true })} aria-label={`Shopping bag${h && count ? `, ${count} items` : ''}`}><Icon name="bag" />{h && <CountBadge n={count} />}</button>
        </div>
      </div>
      <nav aria-label="Primary" className="relative hidden border-t border-line/70 lg:block">
        <ul className="container flex items-center justify-center gap-7">
          {NAV.map((item) => (
            <MegaItem key={item.label} item={item} open={openMenu === item.label} setOpen={(v) => setOpenMenu((cur) => (v ? item.label : cur === item.label ? null : cur))} />
          ))}
        </ul>
      </nav>
    </header>
  );
}
