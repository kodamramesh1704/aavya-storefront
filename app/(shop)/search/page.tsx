import type { Metadata } from 'next';
import { searchProducts } from '@/lib/api';
import { CollectionPage } from '@/components/plp/CollectionPage';

export const metadata: Metadata = { title: 'Search', robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const results = await searchProducts(q, 200);
  return <CollectionPage title={q ? `Results for “${q}”` : 'Search'} products={results} crumbs={[{ label: 'Search' }]} />;
}
