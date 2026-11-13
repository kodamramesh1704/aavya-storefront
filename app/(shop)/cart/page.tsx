import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CartView } from './CartView';

export const metadata: Metadata = { title: 'Your Bag', robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container pb-20">
      <Breadcrumbs items={[{ label: 'Bag' }]} />
      <CartView />
    </div>
  );
}
