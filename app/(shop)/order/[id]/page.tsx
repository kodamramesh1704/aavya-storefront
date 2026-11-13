import type { Metadata } from 'next';
import { OrderConfirmation } from './OrderConfirmation';

export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return <OrderConfirmation id={(await params).id} />;
}
