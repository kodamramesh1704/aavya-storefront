'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Order } from '@/types';
import { useAccount, useHydrated } from '@/store';
import { SummaryLines } from '@/components/ui/OrderSummary';
import { useMoney } from '@/components/ui/Price';
import { Icon } from '@/components/ui/Icon';

export function OrderConfirmation({ id }: { id: string }) {
  const h = useHydrated();
  const orders = useAccount((s) => s.orders);
  const [order, setOrder] = useState<Order | null>(null);
  const money = useMoney();
  useEffect(() => {
    if (!h) return;
    const fromStore = orders.find((o) => o.id === id);
    if (fromStore) return setOrder(fromStore);
    try { const s = JSON.parse(sessionStorage.getItem('av-last-order') || 'null'); if (s?.id === id) setOrder(s); } catch {}
  }, [h, id, orders]);

  if (!h) return <div className="h-96" />;
  if (!order)
    return (
      <div className="container grid place-items-center gap-4 py-24 text-center">
        <h1 className="text-display-lg">Order not found</h1>
        <p className="text-muted">Track an existing order with your order number.</p>
        <Link href="/track-order" className="btn-primary">Track order</Link>
      </div>
    );

  return (
    <div className="container max-w-3xl py-12 md:py-16">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-white"><Icon name="check" size={32} strokeWidth={2} /></span>
        <h1 className="mt-6 text-display-lg">Thank you for your order</h1>
        <p className="mt-3 text-muted">Order <strong className="text-ink">#{order.id}</strong> is confirmed. We’ve sent the details to <strong className="text-ink">{order.email}</strong>.</p>
      </div>
      <div className="mt-10 grid gap-6 border border-line bg-surface p-6 text-sm md:grid-cols-3">
        <div><p className="eyebrow mb-1">Estimated delivery</p><p>{order.delivery.eta}</p></div>
        <div><p className="eyebrow mb-1">Shipping to</p><p>{order.address.name}, {order.address.city} {order.address.pincode}</p></div>
        <div><p className="eyebrow mb-1">Payment</p><p>{order.payment.method} · {money(order.total)}</p></div>
      </div>
      <div className="mt-6 border border-line bg-surface p-6">
        <h2 className="mb-5 text-2xl">Items</h2>
        <SummaryLines lines={order.lines} />
        {order.giftWrap && <p className="mt-4 flex items-center gap-2 text-sm"><Icon name="gift" size={16} /> Gift wrapped</p>}
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/account" className="btn-outline">View my orders</Link>
        <Link href="/collections/new-arrivals" className="btn-primary">Continue shopping</Link>
      </div>
    </div>
  );
}
