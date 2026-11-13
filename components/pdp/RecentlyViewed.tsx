'use client';
import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { useHydrated, useRecent } from '@/store';
import { ProductRail } from '../ui/ProductRail';

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const h = useHydrated();
  const ids = useRecent((s) => s.ids);
  const [items, setItems] = useState<Product[]>([]);
  const key = ids.filter((i) => i !== excludeId).slice(0, 8).join(',');
  useEffect(() => {
    if (!h || !key) return;
    fetch(`/api/products?ids=${key}`).then((r) => r.json()).then(setItems).catch(() => {});
  }, [h, key]);
  if (!items.length) return null;
  return (
    <section className="container py-12" aria-labelledby="rv-h">
      <h2 id="rv-h" className="mb-6 text-display-md">Recently Viewed</h2>
      <ProductRail products={items} label="Recently viewed" />
    </section>
  );
}
