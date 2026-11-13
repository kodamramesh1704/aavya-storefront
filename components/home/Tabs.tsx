'use client';
import { useRef, useState } from 'react';
import type { Product } from '@/types';
import { ProductRail } from '../ui/ProductRail';
import { cx } from '@/lib/format';

/** WAI-ARIA tabs with arrow-key navigation. */
export function ProductTabs({ tabs }: { tabs: { id: string; label: string; products: Product[] }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, idx: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const n = (idx + d + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  return (
    <div>
      <div role="tablist" aria-label="Filter new arrivals" className="mb-6 flex gap-6 border-b border-line">
        {tabs.map((t, idx) => (
          <button key={t.id} ref={(el) => { refs.current[idx] = el; }} role="tab" id={`tab-${t.id}`} aria-selected={active === idx} aria-controls={`panel-${t.id}`} tabIndex={active === idx ? 0 : -1}
            onClick={() => setActive(idx)} onKeyDown={(e) => onKey(e, idx)}
            className={cx('-mb-px border-b-2 pb-3 text-sm uppercase tracking-wider', active === idx ? 'border-ink font-medium' : 'border-transparent text-muted hover:text-ink')}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, idx) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={active !== idx}>
          {active === idx && <ProductRail products={t.products} label={`${t.label} new arrivals`} />}
        </div>
      ))}
    </div>
  );
}
