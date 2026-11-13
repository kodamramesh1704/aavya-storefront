import type { MetadataRoute } from 'next';
import { brand } from '@/brand.config';
import { getAllProducts } from '@/lib/api';
import { COLLECTIONS } from '@/lib/catalog';
import { LOOKBOOKS, POLICIES } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (path: string) => `${brand.url}${path}`;
  const now = new Date();
  const products = await getAllProducts();
  return [
    { url: u('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: u('/sale'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    ...COLLECTIONS.filter((c) => c.slug !== 'sale').map((c) => ({ url: u(`/collections/${c.slug}`), lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: u(`/products/${p.slug}`), lastModified: new Date(p.createdAt), changeFrequency: 'weekly' as const, priority: 0.7, images: [u(p.images[0].src)] })),
    ...Object.keys(LOOKBOOKS).map((s) => ({ url: u(`/lookbook/${s}`), priority: 0.5 })),
    ...['/about', '/stores', '/contact', '/faqs', '/track-order'].map((p) => ({ url: u(p), priority: 0.4 })),
    ...Object.keys(POLICIES).map((s) => ({ url: u(`/policies/${s}`), priority: 0.2 })),
  ];
}
