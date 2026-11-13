'use client';
import { useId, useState } from 'react';
import { brand } from '@/brand.config';
import { cx } from '@/lib/format';

export function NewsletterForm({ dark, onDone }: { dark?: boolean; onDone?: () => void }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');
  const id = useId();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState('error');
    // Integration point: POST to ESP (Klaviyo / Mailchimp / Supabase) here.
    setState('done');
    try { localStorage.setItem('av-subscribed', '1'); } catch {}
    onDone?.();
  };
  if (state === 'done') return <p role="status" className="text-sm">Thank you. Check your inbox for a welcome note and code <strong>WELCOME10</strong>.</p>;
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={id} className="sr-only">Email address</label>
      <div className="flex">
        <input id={id} type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle'); }} placeholder="Your email address"
          aria-invalid={state === 'error'} aria-describedby={`${id}-help`}
          className={cx('h-12 min-w-0 flex-1 border px-4 focus:outline-none', dark ? 'border-bg/40 bg-transparent text-bg placeholder:text-bg/70 focus:border-bg' : 'border-line bg-surface focus:border-ink')} />
        <button type="submit" className={cx('btn h-12 shrink-0', dark ? 'bg-bg text-ink hover:bg-bg/90' : 'bg-primary text-primary-fg')}>Subscribe</button>
      </div>
      <p id={`${id}-help`} className={cx('mt-2 text-xs', dark ? 'text-bg/80' : 'text-muted')}>
        {state === 'error' ? <span className={dark ? 'text-bg font-medium' : 'text-sale font-medium'}>Enter a valid email address.</span> : <>By subscribing you agree to receive marketing emails from {brand.name}. Unsubscribe anytime. See our <a href="/policies/privacy" className="underline">Privacy Policy</a>.</>}
      </p>
    </form>
  );
}
