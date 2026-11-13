'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types';
import { Price } from './Price';
import { WishlistButton } from './WishlistButton';
import { Dialog } from './Dialog';
import { Icon } from './Icon';
import { discountPct } from '@/lib/product-utils';
import { useAddToBag } from '@/lib/useAddToBag';
import { cx } from '@/lib/format';

export function ProductCard({ product: p, priority, sizes = '(min-width:1024px) 25vw, 50vw' }: { product: Product; priority?: boolean; sizes?: string }) {
  const pct = discountPct(p);
  const isNew = p.tags.includes('new');
  const addToBag = useAddToBag();
  const [sheet, setSheet] = useState(false);
  const soldOut = p.sizes.every((s) => !p.stock[s]);
  const single = p.sizes.length === 1;

  const quickAdd = (size: string) => { addToBag(p, size, p.colors[0].name); setSheet(false); };

  const SizeButtons = ({ big }: { big?: boolean }) => (
    <div className="flex flex-wrap gap-1.5">
      {p.sizes.map((s) => {
        const out = !p.stock[s];
        return (
          <button key={s} type="button" disabled={out} onClick={() => quickAdd(s)}
            aria-label={`Add size ${s} to bag${out ? ', sold out' : ''}`}
            className={cx('border border-line bg-surface hover:border-ink disabled:line-through disabled:text-muted/60 disabled:hover:border-line', big ? 'h-12 min-w-12 px-3' : 'h-8 min-w-9 px-2 text-xs')}>{s}</button>
        );
      })}
    </div>
  );

  return (
    <article className="group relative">
      <div className="relative aspect-portrait overflow-hidden bg-line/40">
        <Link href={`/products/${p.slug}`} tabIndex={-1} aria-hidden="true">
          <Image src={p.images[0].src} alt="" fill sizes={sizes} priority={priority} className="object-cover transition-opacity duration-500 group-hover:opacity-0" />
          {p.images[1] && <Image src={p.images[1].src} alt="" fill sizes={sizes} loading="lazy" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {soldOut ? <span className="bg-ink px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-bg">Sold out</span>
            : pct > 0 ? <span className="bg-sale px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-white"><span className="sr-only">Sale, </span>−{pct}%</span>
            : isNew ? <span className="bg-surface px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-ink">New</span> : null}
        </div>
        <WishlistButton id={p.id} name={p.name} className="absolute right-1 top-1 z-10 h-10 w-10 rounded-full bg-surface/80 backdrop-blur hover:bg-surface" />
        {!soldOut && (
          <>
            {/* Desktop: inline size quick-add on hover/focus */}
            <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full bg-surface/95 p-3 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 lg:block">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider">Quick add</p>
              <SizeButtons />
            </div>
            {/* Mobile: open size sheet */}
            <button type="button" onClick={() => (single ? quickAdd(p.sizes[0]) : setSheet(true))} className="absolute bottom-2 right-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-surface/90 lg:hidden" aria-label={`Quick add ${p.name}`}>
              <Icon name="bag" size={18} />
            </button>
          </>
        )}
      </div>
      <div className="pt-3 space-y-1">
        <h3 className="font-sans text-sm leading-snug line-clamp-2">
          <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:underline">
            {p.name}
          </Link>
        </h3>
        <Price price={p.price} compareAtPrice={p.compareAtPrice} size="sm" />
        {p.colors.length > 1 && (
          <ul className="flex gap-1.5 pt-1" aria-label={`${p.colors.length} colours`}>
            {p.colors.map((c) => <li key={c.name} title={c.name} className="h-3 w-3 rounded-full ring-1 ring-ink/20" style={{ background: c.hex }}><span className="sr-only">{c.name}</span></li>)}
          </ul>
        )}
      </div>
      <Dialog open={sheet} onClose={() => setSheet(false)} title="Select a size" variant="bottom">
        <div className="p-5">
          <p className="mb-4 text-sm text-muted">{p.name}</p>
          <SizeButtons big />
        </div>
      </Dialog>
    </article>
  );
}
