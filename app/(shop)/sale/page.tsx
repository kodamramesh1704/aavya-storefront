import type { Metadata } from 'next';
import { getCollection } from '@/lib/api';
import { CollectionPage } from '@/components/plp/CollectionPage';

export const metadata: Metadata = { title: 'Sale', description: 'Handcrafted Indian wear at reduced prices. Limited sizes.', alternates: { canonical: '/sale' } };

/** /sale is driven entirely by compareAtPrice > price (see lib/catalog.ts). */
export default async function SalePage() {
  const c = (await getCollection('sale'))!;
  return <CollectionPage title={c.meta.title} description={c.meta.description} banner={c.meta.banner} seoText={c.meta.seoText} products={c.products} crumbs={[{ label: 'Sale' }]} />;
}
