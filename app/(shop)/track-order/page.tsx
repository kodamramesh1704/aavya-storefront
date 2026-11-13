import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { TrackForm } from './TrackForm';

export const metadata: Metadata = { title: 'Track Order', alternates: { canonical: '/track-order' } };

export default function TrackOrder() {
  return (
    <div className="container max-w-2xl pb-20">
      <Breadcrumbs items={[{ label: 'Track Order' }]} />
      <h1 className="text-display-lg">Track your order</h1>
      <p className="mt-2 text-muted">Enter your order number and the email or phone used at checkout.</p>
      <TrackForm />
    </div>
  );
}
