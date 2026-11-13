'use client';
import { useRef } from 'react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Icon } from './Icon';

export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  if (!products.length) return null;
  return (
    <div className="relative">
      <ul ref={ref} className="scroll-x" aria-label={label}>
        {products.map((p) => (
          <li key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]">
            <ProductCard product={p} sizes="(min-width:1024px) 24vw, 46vw" />
          </li>
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-x-0 top-[38%] hidden justify-between lg:flex">
        <button type="button" onClick={() => scroll(-1)} className="pointer-events-auto -ml-5 grid h-11 w-11 place-items-center rounded-full bg-surface shadow" aria-label={`Previous ${label}`}><Icon name="chevronLeft" /></button>
        <button type="button" onClick={() => scroll(1)} className="pointer-events-auto -mr-5 grid h-11 w-11 place-items-center rounded-full bg-surface shadow" aria-label={`Next ${label}`}><Icon name="chevronRight" /></button>
      </div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-display-md">{title}</h2>
      </div>
      {action}
    </div>
  );
}
