// Pure helpers, safe to import from client components (no catalogue data).
import type { Filters, Product, SortKey } from '@/types';

export const discountPct = (p: Pick<Product, 'price' | 'compareAtPrice'>) =>
  p.compareAtPrice && p.compareAtPrice > p.price ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;

export function sort(list: Product[], key: SortKey): Product[] {
  const l = [...list];
  switch (key) {
    case 'new': return l.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'price-asc': return l.sort((a, b) => a.price - b.price);
    case 'price-desc': return l.sort((a, b) => b.price - a.price);
    case 'bestselling': return l.sort((a, b) => b.popularity - a.popularity);
    default: return l; // featured = merchandised order
  }
}
export function applyFilters(list: Product[], f: Filters): Product[] {
  return list.filter((p) =>
    (!f.category.length || f.category.includes(p.category)) &&
    (!f.size.length || f.size.some((s) => (p.stock[s] ?? 0) > 0)) &&
    (!f.color.length || p.colors.some((c) => f.color.includes(c.name))) &&
    (!f.fabric.length || f.fabric.includes(p.fabric)) &&
    (!f.occasion.length || p.occasion.some((o) => f.occasion.includes(o))) &&
    (f.discount === null || discountPct(p) >= f.discount) &&
    (f.priceMin === null || p.price >= f.priceMin) &&
    (f.priceMax === null || p.price <= f.priceMax)
  );
}
