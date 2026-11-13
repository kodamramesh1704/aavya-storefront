import { NextResponse } from 'next/server';
import type { Order } from '@/types';
import { sendOrderConfirmation } from '@/lib/email';

/** Mock order intake. In production: validate prices server-side, persist, then email. */
export async function POST(req: Request) {
  const order = (await req.json()) as Order;
  if (!order?.id || !order.lines?.length) return NextResponse.json({ ok: false }, { status: 400 });
  await sendOrderConfirmation(order);
  return NextResponse.json({ ok: true, id: order.id });
}
