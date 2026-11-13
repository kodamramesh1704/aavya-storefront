/**
 * DATA ACCESS LAYER: the only module that knows where data comes from.
 * Swap these implementations for Shopify Storefront API / Supabase / a CMS
 * without touching components. Every function is async for that reason.
 */
import raw from '@/data/products.json';
import type { Product } from '@/types';
import { getCollectionMeta } from './catalog';
import { sort } from './product-utils';
export { discountPct, sort, applyFilters } from './product-utils';
export { checkPincode, lookupPincode, type PincodeResult } from './pincode';

const products = raw as unknown as Product[];

export async function getAllProducts(): Promise<Product[]> {
  return products;
}
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
}
export async function getNewArrivals(subBrand?: string, limit = 8) {
  return sort(products.filter((p) => p.tags.includes('new') && (!subBrand || p.subBrand === subBrand)), 'new').slice(0, limit);
}
export async function getBestsellers(limit = 8) {
  return sort(products.filter((p) => p.tags.includes('bestseller')), 'bestselling').slice(0, limit);
}
/** Complementary categories for "Complete the look" */
const PAIRS: Record<string, string[]> = {
  kurtas: ['accessories', 'co-ords'], 'suit-sets': ['accessories'], sarees: ['accessories'], lehengas: ['accessories', 'sarees'],
  dresses: ['accessories'], 'co-ords': ['accessories', 'kurtas'], accessories: ['kurtas', 'suit-sets'], 'home-living': ['home-living'],
};
export async function getCompleteTheLook(p: Product, limit = 4) {
  return products.filter((x) => x.id !== p.id && PAIRS[p.category]?.includes(x.category)).sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}
export async function getRelated(p: Product, limit = 8) {
  return products
    .filter((x) => x.id !== p.id && x.category === p.category)
    .concat(products.filter((x) => x.id !== p.id && x.category !== p.category && x.occasion.some((o) => p.occasion.includes(o))))
    .slice(0, limit);
}
export async function searchProducts(q: string, limit = 6) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products
    .filter((p) => terms.every((t) => [p.name, p.category, p.fabric, p.technique, ...p.occasion, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(t)))
    .slice(0, limit);
}

// ---------- Collections / PLP ----------
export async function getCollection(slug: string, subBrand?: string) {
  const meta = getCollectionMeta(slug);
  if (!meta) return null;
  const items = products.filter((p) => meta.filter(p) && (!subBrand || p.subBrand === subBrand));
  const { filter, ...rest } = meta;
  return { meta: rest, products: items };
}

