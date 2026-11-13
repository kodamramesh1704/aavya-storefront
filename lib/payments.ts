/**
 * PAYMENT INTEGRATION POINT (mock).
 *
 * To go live with Razorpay:
 * 1. Add an API route (app/api/payments/order/route.ts) that calls
 *    `razorpay.orders.create({ amount: total * 100, currency: 'INR', receipt: orderId })`
 *    with RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET from env (server only).
 * 2. In `startPayment`, load https://checkout.razorpay.com/v1/checkout.js and open
 *    `new Razorpay({ key, order_id, prefill: { email, contact }, handler })`.
 * 3. In the handler, POST razorpay_payment_id / order_id / signature to
 *    app/api/payments/verify and verify the HMAC signature server-side
 *    BEFORE marking the order paid. Also handle the `payment.captured` webhook.
 * COD skips the gateway but should still create the order server-side.
 */
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: 'upi', label: 'UPI', hint: 'Google Pay, PhonePe, Paytm or any UPI app' },
  { id: 'card', label: 'Credit / Debit Card', hint: 'Visa, Mastercard, RuPay, Amex' },
  { id: 'netbanking', label: 'Net Banking', hint: 'All major Indian banks' },
  { id: 'wallet', label: 'Wallets', hint: 'Paytm, Amazon Pay, Mobikwik' },
  { id: 'cod', label: 'Cash on Delivery', hint: 'Pay when your order arrives' },
];

export async function startPayment(opts: { orderId: string; amount: number; method: PaymentMethod; email: string; phone: string }): Promise<{ ok: true; paymentId: string } | { ok: false; error: string }> {
  await new Promise((r) => setTimeout(r, 900)); // simulate gateway round-trip
  if (opts.method === 'cod') return { ok: true, paymentId: 'COD' };
  return { ok: true, paymentId: `pay_mock_${opts.orderId}` };
}
