import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AccountView } from './AccountView';

export const metadata: Metadata = { title: 'My Account', robots: { index: false } };

export default function Account() {
  return (
    <div className="container pb-20">
      <Breadcrumbs items={[{ label: 'My Account' }]} />
      <Suspense><AccountView /></Suspense>
    </div>
  );
}
