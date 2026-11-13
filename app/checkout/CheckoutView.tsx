'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { brand } from '@/brand.config';
import type { Address, Order } from '@/types';
import { computeTotals, useAccount, useCart, useHydrated } from '@/store';
import { lookupPincode } from '@/lib/pincode';
import { PAYMENT_METHODS, startPayment, type PaymentMethod } from '@/lib/payments';
import { SummaryLines, SummaryRows } from '@/components/ui/OrderSummary';
import { useMoney } from '@/components/ui/Price';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/format';

type Errors = Record<string, string>;
const STEPS = ['Contact', 'Shipping address', 'Delivery method', 'Payment', 'Review & place order'];

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; hint?: string; children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>> }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-sale">{error}</p>}
    </div>
  );
}
const aria = (id: string, e: Errors, hint = false) => ({ id, 'aria-invalid': !!e[id], 'aria-describedby': e[id] ? `${id}-error` : hint ? `${id}-hint` : undefined });

const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); };

export function CheckoutView() {
  const h = useHydrated();
  const router = useRouter();
  const money = useMoney();
  const cart = useCart();
  const { user, addresses, saveAddress, addOrder } = useAccount();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [contact, setContact] = useState({ email: '', phone: '', optIn: true });
  const [addr, setAddr] = useState<Address>({ id: '', name: '', phone: '', pincode: '', line1: '', line2: '', landmark: '', city: '', state: '', type: 'Home' });
  const [saveAddr, setSaveAddr] = useState(true);
  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard');
  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (user) setContact((c) => ({ ...c, email: c.email || user.email, phone: c.phone || user.phone }));
    if (addresses[0] && !addr.id) setAddr(addresses[0]);
  }, [user, addresses]); // eslint-disable-line react-hooks/exhaustive-deps

  const pin = lookupPincode(addr.pincode);
  const remote = pin?.zone === 'remote';
  const codAvailable = !remote;
  const base = computeTotals(cart.lines, cart.coupon, cart.giftWrap);
  const subtotalAfter = base.subtotal - base.discount;
  const standardFee = subtotalAfter >= brand.shipping.freeThreshold ? 0 : brand.shipping.standardFee;
  const shipFee = delivery === 'express' ? brand.shipping.expressFee : standardFee;
  const codFee = payment === 'cod' ? brand.shipping.codFee : 0;
  const t = computeTotals(cart.lines, cart.coupon, cart.giftWrap, shipFee, codFee);
  const eta = delivery === 'express' ? addDays(2) : `${addDays(4)} – ${addDays(6)}`;

  const focusFirstError = (e: Errors) => {
    const first = Object.keys(e)[0];
    if (first) setTimeout(() => document.getElementById(first)?.focus(), 0);
  };
  const go = (n: number) => {
    setStep(n);
    setTimeout(() => {
      const el = sectionRefs.current[n - 1];
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el?.querySelector<HTMLElement>('input,button')?.focus({ preventScroll: true });
    }, 50);
  };
  const validate = (n: number): boolean => {
    const e: Errors = {};
    if (n === 1) {
      if (!/^\S+@\S+\.\S+$/.test(contact.email)) e.email = 'Enter a valid email address, like name@example.com.';
      if (!/^[6-9]\d{9}$/.test(contact.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a 10-digit Indian mobile number.';
    }
    if (n === 2) {
      if (addr.name.trim().length < 2) e['a-name'] = 'Enter the recipient’s full name.';
      if (!/^[6-9]\d{9}$/.test(addr.phone.replace(/\D/g, '').slice(-10))) e['a-phone'] = 'Enter a 10-digit mobile number for the courier.';
      if (!/^[1-9]\d{5}$/.test(addr.pincode)) e['a-pincode'] = 'Enter a valid 6-digit pincode.';
      if (addr.line1.trim().length < 3) e['a-line1'] = 'Enter house/flat number and building.';
      if (!addr.city.trim()) e['a-city'] = 'Enter your city.';
      if (!addr.state.trim()) e['a-state'] = 'Enter your state.';
    }
    setErrors(e);
    focusFirstError(e);
    return !Object.keys(e).length;
  };
  const next = (n: number) => {
    if (!validate(n)) return;
    if (n === 2 && saveAddr && user) saveAddress({ ...addr, id: addr.id || `addr_${Date.now()}` });
    if (n === 3 && payment === 'cod' && !codAvailable) setPayment('upi');
    go(n + 1);
  };

  const place = async () => {
    setPlacing(true);
    const id = `AV${Date.now().toString().slice(-8)}`;
    const res = await startPayment({ orderId: id, amount: t.total, method: payment, email: contact.email, phone: contact.phone });
    if (!res.ok) { setPlacing(false); setErrors({ payment: res.error }); return; }
    const order: Order = {
      id, createdAt: new Date().toISOString(), email: contact.email, phone: contact.phone, address: addr,
      delivery: { method: delivery, fee: shipFee, eta }, payment: { method: PAYMENT_METHODS.find((m) => m.id === payment)!.label, fee: codFee },
      lines: cart.lines, subtotal: t.subtotal, discount: t.discount, coupon: t.couponApplied, giftWrap: cart.giftWrap, total: t.total, status: 'Placed',
    };
    addOrder(order);
    fetch('/api/orders', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(order) }).catch(() => {});
    try { sessionStorage.setItem('av-last-order', JSON.stringify(order)); } catch {}
    router.push(`/order/${id}`);
    cart.clear();
  };

  if (!h) return <div className="h-screen" />;
  if (!cart.lines.length && !placing)
    return (
      <div className="container grid place-items-center gap-4 py-24 text-center">
        <h1 className="text-display-lg">Your bag is empty</h1>
        <Link href="/collections/new-arrivals" className="btn-primary">Continue shopping</Link>
      </div>
    );

  const Section = (n: number, done: React.ReactNode, body: React.ReactNode) => (
    <section ref={(el) => { sectionRefs.current[n - 1] = el; }} aria-labelledby={`step-${n}`} className={cx('scroll-mt-4 border border-line bg-surface', step === n ? 'p-5 md:p-7' : 'px-5 py-4 md:px-7')}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={`step-${n}`} className={cx('flex items-center gap-3 font-sans text-base font-medium', step < n && 'text-muted')}>
          <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs', step > n ? 'bg-success text-white' : step === n ? 'bg-ink text-bg' : 'border border-line')}>
            {step > n ? <Icon name="check" size={14} strokeWidth={2.5} /> : n}
          </span>
          {STEPS[n - 1]}
          {step > n && <span className="sr-only">(completed)</span>}
        </h2>
        {step > n && <button type="button" onClick={() => go(n)} className="text-sm underline underline-offset-4">Edit<span className="sr-only"> {STEPS[n - 1]}</span></button>}
      </div>
      {step > n && <div className="mt-2 pl-10 text-sm text-muted">{done}</div>}
      {step === n && <div className="mt-6">{body}</div>}
    </section>
  );

  const summary = (
    <div className="space-y-6">
      <SummaryLines lines={cart.lines} />
      <SummaryRows t={t} shippingLabel={step >= 3 ? `Shipping (${delivery})` : 'Shipping'} />
    </div>
  );

  return (
    <div className="container py-6 md:py-10">
      {/* Mobile collapsible summary */}
      <div className="mb-6 border border-line bg-surface lg:hidden">
        <button type="button" aria-expanded={summaryOpen} aria-controls="m-summary" onClick={() => setSummaryOpen(!summaryOpen)} className="flex w-full items-center justify-between p-4 text-sm">
          <span className="flex items-center gap-2 font-medium"><Icon name="bag" size={18} />{summaryOpen ? 'Hide' : 'Show'} order summary <Icon name="chevronDown" size={16} className={cx('transition-transform', summaryOpen && 'rotate-180')} /></span>
          <span className="font-medium">{money(t.total)}</span>
        </button>
        <div id="m-summary" hidden={!summaryOpen} className="border-t border-line p-4">{summary}</div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
        <div className="space-y-3">
          <h1 className="sr-only">Checkout</h1>
          <ol className="mb-4 hidden items-center gap-2 text-xs uppercase tracking-wider text-muted md:flex" aria-label="Checkout progress">
            {STEPS.map((s, i) => <li key={s} className={cx('flex items-center gap-2', step === i + 1 && 'font-medium text-ink')} aria-current={step === i + 1 ? 'step' : undefined}>{i > 0 && <span aria-hidden="true">—</span>}{s}</li>)}
          </ol>

          {Section(1, <>{contact.email} · {contact.phone}</>, (
            <form onSubmit={(e) => { e.preventDefault(); next(1); }} noValidate className="space-y-4">
              {!user && <p className="text-sm">Have an account? <Link href="/account?next=/checkout" className="link font-medium">Log in</Link> for saved addresses, or continue as a guest.</p>}
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="email" label="Email" error={errors.email}><input {...aria('email', errors)} type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="input" /></Field>
                <Field id="phone" label="Mobile number" error={errors.phone} hint="For order and delivery updates"><input {...aria('phone', errors, true)} type="tel" inputMode="numeric" autoComplete="tel-national" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="input" placeholder="98xxxxxxxx" /></Field>
              </div>
              <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={contact.optIn} onChange={(e) => setContact({ ...contact, optIn: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[rgb(var(--c-primary))]" />Email me about new collections and offers. You can unsubscribe anytime.</label>
              <button type="submit" className="btn-primary w-full md:w-auto">Continue to shipping</button>
            </form>
          ))}

          {Section(2, <>{addr.name}, {addr.line1}{addr.line2 && `, ${addr.line2}`}, {addr.city}, {addr.state} {addr.pincode}</>, (
            <form onSubmit={(e) => { e.preventDefault(); next(2); }} noValidate className="space-y-4">
              {addresses.length > 0 && (
                <fieldset className="space-y-2">
                  <legend className="label">Saved addresses</legend>
                  {addresses.map((a) => (
                    <label key={a.id} className={cx('flex cursor-pointer gap-3 border p-4 text-sm', addr.id === a.id ? 'border-ink' : 'border-line')}>
                      <input type="radio" name="saved" checked={addr.id === a.id} onChange={() => setAddr(a)} className="mt-0.5 accent-[rgb(var(--c-primary))]" />
                      <span><strong className="font-medium">{a.name}</strong> <span className="ml-1 rounded bg-line px-1.5 py-0.5 text-[11px]">{a.type}</span><br />{a.line1}, {a.city} {a.pincode}</span>
                    </label>
                  ))}
                  <button type="button" onClick={() => setAddr({ id: '', name: '', phone: '', pincode: '', line1: '', line2: '', landmark: '', city: '', state: '', type: 'Home' })} className="text-sm underline underline-offset-4">+ Add a new address</button>
                </fieldset>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="a-name" label="Full name" error={errors['a-name']}><input {...aria('a-name', errors)} autoComplete="name" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} className="input" /></Field>
                <Field id="a-phone" label="Mobile number" error={errors['a-phone']}><input {...aria('a-phone', errors)} type="tel" inputMode="numeric" autoComplete="tel-national" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} className="input" /></Field>
                <Field id="a-pincode" label="Pincode" error={errors['a-pincode']} hint="City and state fill in automatically">
                  <input {...aria('a-pincode', errors, true)} inputMode="numeric" maxLength={6} autoComplete="postal-code" value={addr.pincode}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); const hit = lookupPincode(v); setAddr({ ...addr, pincode: v, ...(hit ? { city: hit.city, state: hit.state } : {}) }); }} className="input" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="a-city" label="City" error={errors['a-city']}><input {...aria('a-city', errors)} autoComplete="address-level2" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className="input" /></Field>
                  <Field id="a-state" label="State" error={errors['a-state']}><input {...aria('a-state', errors)} autoComplete="address-level1" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className="input" /></Field>
                </div>
                <div className="md:col-span-2"><Field id="a-line1" label="Flat / house no., building" error={errors['a-line1']}><input {...aria('a-line1', errors)} autoComplete="address-line1" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} className="input" /></Field></div>
                <Field id="a-line2" label="Area, street (optional)"><input id="a-line2" autoComplete="address-line2" value={addr.line2} onChange={(e) => setAddr({ ...addr, line2: e.target.value })} className="input" /></Field>
                <Field id="a-landmark" label="Landmark (optional)"><input id="a-landmark" value={addr.landmark} onChange={(e) => setAddr({ ...addr, landmark: e.target.value })} className="input" /></Field>
              </div>
              <fieldset>
                <legend className="label">Address type</legend>
                <div className="flex gap-2">
                  {(['Home', 'Work'] as const).map((tp) => (
                    <label key={tp} className="cursor-pointer">
                      <input type="radio" name="atype" checked={addr.type === tp} onChange={() => setAddr({ ...addr, type: tp })} className="peer sr-only" />
                      <span className="block border border-line px-5 py-2 text-sm peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary">{tp}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {user && <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--c-primary))]" />Save this address to my account</label>}
              <button type="submit" className="btn-primary w-full md:w-auto">Continue to delivery</button>
            </form>
          ))}

          {Section(3, <>{delivery === 'express' ? 'Express' : 'Standard'} · arrives {eta}</>, (
            <form onSubmit={(e) => { e.preventDefault(); next(3); }} className="space-y-3">
              <fieldset className="space-y-3">
                <legend className="sr-only">Delivery method</legend>
                {([['standard', 'Standard delivery', `${addDays(4)} – ${addDays(6)}`, standardFee], ['express', 'Express delivery', `By ${addDays(2)}`, brand.shipping.expressFee]] as const).map(([id, label, when, fee]) => (
                  <label key={id} className={cx('flex cursor-pointer items-center gap-4 border p-4', delivery === id ? 'border-ink' : 'border-line')}>
                    <input type="radio" name="delivery" checked={delivery === id} onChange={() => setDelivery(id)} className="h-4 w-4 accent-[rgb(var(--c-primary))]" />
                    <span className="flex-1"><span className="block font-medium">{label}</span><span className="text-sm text-muted">{when}</span></span>
                    <span className="font-medium">{fee ? money(fee) : 'Free'}</span>
                  </label>
                ))}
              </fieldset>
              <button type="submit" className="btn-primary w-full md:w-auto">Continue to payment</button>
            </form>
          ))}

          {Section(4, <>{PAYMENT_METHODS.find((m) => m.id === payment)?.label}</>, (
            <form onSubmit={(e) => { e.preventDefault(); next(4); }} className="space-y-3">
              <fieldset className="space-y-2">
                <legend className="sr-only">Payment method</legend>
                {PAYMENT_METHODS.map((m) => {
                  const disabled = m.id === 'cod' && !codAvailable;
                  return (
                    <label key={m.id} className={cx('flex items-center gap-4 border p-4', disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer', payment === m.id ? 'border-ink' : 'border-line')}>
                      <input type="radio" name="payment" disabled={disabled} checked={payment === m.id} onChange={() => setPayment(m.id)} className="h-4 w-4 accent-[rgb(var(--c-primary))]" />
                      <span className="flex-1"><span className="block font-medium">{m.label}</span><span className="text-sm text-muted">{disabled ? 'Not available for this pincode' : m.hint}</span></span>
                      {m.id === 'cod' && !disabled && <span className="text-sm text-muted">+{money(brand.shipping.codFee)}</span>}
                    </label>
                  );
                })}
              </fieldset>
              <p className="flex items-center gap-2 text-xs text-muted"><Icon name="lock" size={14} /> Payments are processed securely. This demo does not charge you.</p>
              <button type="submit" className="btn-primary w-full md:w-auto">Review order</button>
            </form>
          ))}

          {Section(5, null, (
            <div className="space-y-5">
              <dl className="grid gap-4 text-sm md:grid-cols-2">
                <div><dt className="eyebrow mb-1">Ship to</dt><dd>{addr.name}<br />{addr.line1}{addr.line2 && `, ${addr.line2}`}<br />{addr.city}, {addr.state} {addr.pincode}<br />{addr.phone}</dd></div>
                <div><dt className="eyebrow mb-1">Delivery</dt><dd>{delivery === 'express' ? 'Express' : 'Standard'}, arrives {eta}</dd><dt className="eyebrow mb-1 mt-3">Payment</dt><dd>{PAYMENT_METHODS.find((m) => m.id === payment)?.label}</dd></div>
              </dl>
              {errors.payment && <p role="alert" className="text-sm text-sale">{errors.payment}</p>}
              <button type="button" onClick={place} disabled={placing} className="btn-primary w-full">{placing ? 'Placing order…' : payment === 'cod' ? `Place order · ${money(t.total)}` : `Pay ${money(t.total)}`}</button>
              <p className="text-center text-xs text-muted">By placing this order you agree to our <Link href="/policies/terms" className="link">Terms</Link> and <Link href="/policies/returns" className="link">Returns Policy</Link>.</p>
            </div>
          ))}
        </div>

        <aside aria-labelledby="os-h" className="hidden lg:block">
          <div className="sticky top-6 border border-line bg-surface p-6">
            <h2 id="os-h" className="mb-5 text-2xl">Order Summary</h2>
            {summary}
          </div>
        </aside>
      </div>
    </div>
  );
}
