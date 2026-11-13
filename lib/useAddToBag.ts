'use client';
import { useCart, useUI } from '@/store';
import type { Product } from '@/types';

export function useAddToBag() {
  const add = useCart((s) => s.add);
  const setUI = useUI((s) => s.set);
  return (p: Product, size: string, color: string, qty = 1, openDrawer = true) => {
    add({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0].src, size, color, price: p.price, compareAtPrice: p.compareAtPrice, maxQty: Math.max(1, p.stock[size] ?? 1) }, qty);
    if (openDrawer) setUI({ cartOpen: true });
  };
}
