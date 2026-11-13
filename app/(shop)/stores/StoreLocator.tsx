'use client';
import { useState } from 'react';
import { STORES } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/format';

export function StoreLocator() {
  const cities = ['All', ...Array.from(new Set(STORES.map((s) => s.city)))];
  const [city, setCity] = useState('All');
  const list = city === 'All' ? STORES : STORES.filter((s) => s.city === city);
  return (
    <>
      <div role="group" aria-label="Filter by city" className="scroll-x my-8">
        {cities.map((c) => (
          <button key={c} type="button" aria-pressed={city === c} onClick={() => setCity(c)} className={cx('shrink-0 rounded-full border px-5 py-2 text-sm', city === c ? 'border-ink bg-ink text-bg' : 'border-line hover:border-ink')}>{c}</button>
        ))}
      </div>
      <p aria-live="polite" className="mb-4 text-sm text-muted">{list.length} {list.length === 1 ? 'store' : 'stores'}</p>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li key={s.id} className="flex flex-col border border-line bg-surface p-6">
            <p className="eyebrow">{s.city}</p>
            <h2 className="mt-1 text-2xl">{s.name}</h2>
            <p className="mt-3 flex gap-2 text-sm"><Icon name="pin" size={18} className="shrink-0" />{s.address}</p>
            <p className="mt-2 flex gap-2 text-sm"><Icon name="clock" size={18} className="shrink-0" />{s.hours}</p>
            <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
              <a href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`} target="_blank" rel="noopener noreferrer" className="btn-outline h-11 px-3 text-xs">Directions<span className="sr-only"> to {s.name} (opens in a new tab)</span></a>
              <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="btn-primary h-11 px-3 text-xs"><Icon name="phone" size={16} />Call<span className="sr-only"> {s.name}</span></a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
