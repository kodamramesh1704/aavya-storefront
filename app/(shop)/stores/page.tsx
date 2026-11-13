import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StoreLocator } from './StoreLocator';

export const metadata: Metadata = { title: 'Store Locator', description: 'Find a store near you.', alternates: { canonical: '/stores' } };

export default function Stores() {
  return (
    <div className="container pb-20">
      <Breadcrumbs items={[{ label: 'Stores' }]} />
      <h1 className="text-display-lg">Find a store</h1>
      <p className="mt-2 text-muted">Visit us for styling appointments, alterations and the full collection.</p>
      <StoreLocator />
    </div>
  );
}
