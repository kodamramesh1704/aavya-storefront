'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { brand } from '@/brand.config';
import { Icon } from '../ui/Icon';

export function AnnouncementBar() {
  const items = brand.announcements;
  const [i, setI] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    try { if (sessionStorage.getItem('av-ann-closed')) setHidden(true); } catch {}
  }, []);
  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [paused, items.length]);
  if (hidden || !items.length) return null;
  const go = (d: number) => setI((x) => (x + d + items.length) % items.length);
  return (
    <div className="bg-primary text-primary-fg" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="container flex h-9 items-center justify-between gap-2 text-xs tracking-wide">
        <button type="button" onClick={() => go(-1)} aria-label="Previous announcement" className="p-1"><Icon name="chevronLeft" size={16} /></button>
        <div className="flex-1 text-center" aria-live="polite" role="region" aria-label="Announcements">
          <Link href={items[i].href} className="hover:underline">{items[i].text}</Link>
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next announcement" className="p-1"><Icon name="chevronRight" size={16} /></button>
        <button type="button" onClick={() => { setHidden(true); try { sessionStorage.setItem('av-ann-closed', '1'); } catch {} }} aria-label="Dismiss announcements" className="ml-1 p-1"><Icon name="close" size={16} /></button>
      </div>
    </div>
  );
}
