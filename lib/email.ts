import type { Order } from '@/types';

/**
 * EMAIL STUB. Replace with Resend / SendGrid / AWS SES from a server action or API route.
 * Called after an order is placed; logs to the console in development.
 */
export async function sendOrderConfirmation(order: Order) {
  // eslint-disable-next-line no-console
  console.info(`[email stub] Order ${order.id} confirmation → ${order.email} (total ₹${order.total})`);
  return { ok: true };
}
