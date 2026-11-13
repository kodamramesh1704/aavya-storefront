'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { useHydrated, useWishlist } from '@/store';
import { ProductCard } from '@/components/ui/ProductCard';
import { Icon } from '@/components/ui/Icon';

export function WishlistView({ embedded }: { embedded?: boolean }) {
  const h = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const [items, setItems] = useState<Product[] | null>(null);
  useEffect(() => {
    if (!h) return;
    if (!ids.length) return setItems([]);
    fetch(`/api/products?ids=${ids.join(',')}`).then((r) => r.json()).then(setItems).catch(() => setItems([]));
  }, [h, ids]);
  const H = embedded ? 'h2' : 'h1';
  if (!items) return <div className="h-80" />;
  return (
    <>
      <H className={embedded ? 'mb-6 text-2xl' : 'mb-8 text-display-lg'}>Wishlist {items.length > 0 && <span className="font-sans text-lg text-muted">({items.length})</span>}</H>
      {items.length ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      ) : (
        <div className="grid place-items-center gap-4 py-16 text-center">
          <Icon name="heart" size={44} strokeWidth={1} />
          <p className="font-display text-2xl">Nothing saved yet</p>
          <p className="text-sm text-muted">Tap the heart on any product to save it for later.</p>
          <Link href="/collections/new-arrivals" className="btn-primary mt-2">Discover New Arrivals</Link>
        </div>
      )}
    </>
  );
}
