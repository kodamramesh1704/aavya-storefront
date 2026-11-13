import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { WishlistView } from './WishlistView';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };

export default function Wishlist() {
  return (
    <div className="container pb-20">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />
      <WishlistView />
    </div>
  );
}
