'use client';
import { useState } from 'react';
import { useAccount } from '@/store';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/format';

const STEPS = ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];

export function TrackForm() {
  const orders = useAccount((s) => s.orders);
  const [id, setId] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string; stage: number; eta: string } | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    const oid = id.trim().toUpperCase().replace(/^#/, '');
    if (!/^AV\d{6,}$/.test(oid)) return setError('Order numbers look like AV12345678. Check your confirmation email.');
    if (contact.trim().length < 5) return setError('Enter the email or phone number used at checkout.');
    setError('');
    // Mock: orders placed in this browser are found; any other valid ID gets a demo status.
    const found = orders.find((o) => o.id === oid);
    const stage = found ? 0 : (Number(oid.slice(-1)) % 4) + 1;
    setResult({ id: oid, stage, eta: found?.delivery.eta ?? 'in 2–3 days' });
  };
  return (
    <>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div><label htmlFor="t-id" className="label">Order number</label><input id="t-id" className="input" placeholder="AV12345678" value={id} onChange={(e) => setId(e.target.value)} aria-describedby={error ? 't-err' : undefined} /></div>
        <div><label htmlFor="t-c" className="label">Email or phone</label><input id="t-c" className="input" value={contact} onChange={(e) => setContact(e.target.value)} /></div>
        <button type="submit" className="btn-primary">Track</button>
      </form>
      <div aria-live="polite">
        {error && <p id="t-err" className="mt-3 text-sm text-sale">{error}</p>}
        {result && (
          <section className="mt-10 border border-line bg-surface p-6" aria-label={`Status for order ${result.id}`}>
            <p className="text-sm text-muted">Order #{result.id}</p>
            <p className="mt-1 text-xl font-medium">{STEPS[result.stage]}{result.stage < 4 && <span className="font-normal text-muted"> · arriving {result.eta}</span>}</p>
            <ol className="mt-8 space-y-0">
              {STEPS.map((s, i) => (
                <li key={s} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < STEPS.length - 1 && <span className={cx('absolute left-[13px] top-7 h-full w-0.5', i < result.stage ? 'bg-success' : 'bg-line')} aria-hidden="true" />}
                  <span className={cx('relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full', i <= result.stage ? 'bg-success text-white' : 'border-2 border-line bg-surface')}>{i <= result.stage && <Icon name="check" size={14} strokeWidth={2.5} />}</span>
                  <span className={cx('pt-0.5', i > result.stage && 'text-muted')}>{s}{i === result.stage && <span className="sr-only"> (current status)</span>}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  );
}
