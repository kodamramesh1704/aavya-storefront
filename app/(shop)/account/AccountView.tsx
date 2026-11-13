'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { brand } from '@/brand.config';
import type { Address } from '@/types';
import { useAccount, useHydrated } from '@/store';
import { useMoney } from '@/components/ui/Price';
import { WishlistView } from '../wishlist/WishlistView';
import { cx } from '@/lib/format';

/**
 * AUTH INTEGRATION POINT (mock). Replace with Supabase Auth
 * (signInWithOtp for phone/email OTP) or Shopify customer accounts.
 */
function Login() {
  const login = useAccount((s) => s.login);
  const router = useRouter();
  const next = useSearchParams().get('next');
  const [mode, setMode] = useState<'otp' | 'email'>('otp');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const done = (u: { name: string; email: string; phone: string }) => { login(u); if (next) router.push(next); };

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) return setError('Enter a 10-digit Indian mobile number.');
    if (!otpSent) { setOtpSent(true); setError(''); return; }
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code. In this demo any 6 digits work.');
    done({ name: 'Guest Customer', email: '', phone });
  };
  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    done({ name: email.split('@')[0], email, phone: '' });
  };

  return (
    <div className="mx-auto max-w-md py-6">
      <h1 className="text-center text-display-lg">Log in or sign up</h1>
      <p className="mt-2 text-center text-sm text-muted">Track orders, save addresses and keep your wishlist across devices.</p>
      <div role="tablist" aria-label="Login method" className="mt-8 grid grid-cols-2 border border-line">
        {(['otp', 'email'] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} type="button" onClick={() => { setMode(m); setError(''); }} className={cx('h-11 text-sm', mode === m ? 'bg-ink text-bg' : 'hover:bg-surface')}>{m === 'otp' ? 'Mobile OTP' : 'Email'}</button>
        ))}
      </div>
      {mode === 'otp' ? (
        <form role="tabpanel" onSubmit={submitOtp} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="l-phone" className="label">Mobile number</label>
            <div className="flex"><span className="grid h-12 place-items-center border border-r-0 border-line bg-surface px-3 text-sm">+91</span><input id="l-phone" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} disabled={otpSent} /></div>
          </div>
          {otpSent && (
            <div>
              <label htmlFor="l-otp" className="label">6-digit code sent to +91 {phone}</label>
              <input id="l-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="input tracking-[0.5em]" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus />
              <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="mt-2 text-sm underline underline-offset-4">Change number</button>
            </div>
          )}
          {error && <p role="alert" className="text-sm text-sale">{error}</p>}
          <button type="submit" className="btn-primary w-full">{otpSent ? 'Verify & continue' : 'Send OTP'}</button>
        </form>
      ) : (
        <form role="tabpanel" onSubmit={submitEmail} noValidate className="mt-6 space-y-4">
          <div><label htmlFor="l-email" className="label">Email</label><input id="l-email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label htmlFor="l-pass" className="label">Password</label><input id="l-pass" type="password" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <p role="alert" className="text-sm text-sale">{error}</p>}
          <button type="submit" className="btn-primary w-full">Continue</button>
        </form>
      )}
      <p className="mt-6 text-center text-xs text-muted">By continuing you agree to our <Link href="/policies/terms" className="link">Terms</Link> and <Link href="/policies/privacy" className="link">Privacy Policy</Link>.</p>
    </div>
  );
}

const TABS = ['Orders', 'Addresses', 'Wishlist', 'Profile'] as const;

function AddressForm({ initial, onSave, onCancel }: { initial?: Address; onSave: (a: Address) => void; onCancel: () => void }) {
  const [a, setA] = useState<Address>(initial ?? { id: `addr_${Date.now()}`, name: '', phone: '', pincode: '', line1: '', line2: '', landmark: '', city: '', state: '', type: 'Home' });
  const [err, setErr] = useState('');
  const f = (k: keyof Address, label: string, auto?: string) => (
    <div><label htmlFor={`ad-${k}`} className="label">{label}</label><input id={`ad-${k}`} autoComplete={auto} className="input" value={a[k]} onChange={(e) => setA({ ...a, [k]: e.target.value })} /></div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!a.name || !/^[1-9]\d{5}$/.test(a.pincode) || !a.line1 || !a.city) return setErr('Fill in name, pincode, address and city.'); onSave(a); }} noValidate className="grid gap-4 border border-line bg-surface p-5 md:grid-cols-2">
      {f('name', 'Full name', 'name')}{f('phone', 'Mobile', 'tel-national')}{f('line1', 'Flat / house, building', 'address-line1')}{f('line2', 'Area, street', 'address-line2')}{f('pincode', 'Pincode', 'postal-code')}{f('city', 'City', 'address-level2')}{f('state', 'State', 'address-level1')}
      <div><label htmlFor="ad-type" className="label">Type</label><select id="ad-type" className="input" value={a.type} onChange={(e) => setA({ ...a, type: e.target.value as Address['type'] })}><option>Home</option><option>Work</option></select></div>
      {err && <p role="alert" className="text-sm text-sale md:col-span-2">{err}</p>}
      <div className="flex gap-3 md:col-span-2"><button type="submit" className="btn-primary">Save address</button><button type="button" onClick={onCancel} className="btn-outline">Cancel</button></div>
    </form>
  );
}

export function AccountView() {
  const h = useHydrated();
  const { user, orders, addresses, logout, saveAddress, deleteAddress } = useAccount();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Orders');
  const [editing, setEditing] = useState<Address | 'new' | null>(null);
  const money = useMoney();
  if (!h) return <div className="h-96" />;
  if (!user) return <Login />;

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <div>
        <h1 className="text-display-md">Hello, {user.name.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-muted">{user.email || `+91 ${user.phone}`}</p>
        <nav aria-label="Account" className="scroll-x mt-6 lg:flex-col lg:overflow-visible">
          {TABS.map((t) => <button key={t} type="button" aria-current={tab === t ? 'page' : undefined} onClick={() => setTab(t)} className={cx('shrink-0 border-b-2 px-1 py-2 text-left text-sm lg:border-b-0 lg:border-l-2 lg:pl-4', tab === t ? 'border-ink font-medium' : 'border-transparent text-muted hover:text-ink')}>{t}</button>)}
          <button type="button" onClick={logout} className="shrink-0 px-1 py-2 text-left text-sm text-muted underline underline-offset-4 lg:mt-4 lg:pl-4">Log out</button>
        </nav>
      </div>
      <div>
        {tab === 'Orders' && (
          <section aria-labelledby="o-h">
            <h2 id="o-h" className="mb-6 text-2xl">Orders</h2>
            {orders.length ? (
              <ul className="space-y-4">
                {orders.map((o) => (
                  <li key={o.id} className="border border-line bg-surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div><p className="font-medium">#{o.id}</p><p className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.lines.reduce((s, l) => s + l.qty, 0)} items · {money(o.total)}</p></div>
                      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">{o.status}</span>
                    </div>
                    <p className="mt-3 text-sm">{o.lines.map((l) => l.name).join(', ')}</p>
                    <div className="mt-4 flex gap-4 text-sm"><Link href={`/order/${o.id}`} className="link">View details</Link><Link href="/track-order" className="link">Track</Link></div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-muted">No orders yet. <Link href="/collections/new-arrivals" className="link text-ink">Start shopping</Link></p>}
          </section>
        )}
        {tab === 'Addresses' && (
          <section aria-labelledby="a-h">
            <div className="mb-6 flex items-center justify-between"><h2 id="a-h" className="text-2xl">Saved addresses</h2>{!editing && <button type="button" onClick={() => setEditing('new')} className="btn-outline h-10 text-xs">Add address</button>}</div>
            {editing && <div className="mb-6"><AddressForm initial={editing === 'new' ? undefined : editing} onSave={(a) => { saveAddress(a); setEditing(null); }} onCancel={() => setEditing(null)} /></div>}
            <ul className="grid gap-4 md:grid-cols-2">
              {addresses.map((a) => (
                <li key={a.id} className="border border-line bg-surface p-5 text-sm">
                  <p className="font-medium">{a.name} <span className="ml-1 rounded bg-line px-1.5 py-0.5 text-[11px] font-normal">{a.type}</span></p>
                  <p className="mt-2 text-muted">{a.line1}{a.line2 && `, ${a.line2}`}<br />{a.city}, {a.state} {a.pincode}<br />{a.phone}</p>
                  <div className="mt-4 flex gap-4"><button type="button" onClick={() => setEditing(a)} className="link">Edit<span className="sr-only"> address for {a.name}</span></button><button type="button" onClick={() => deleteAddress(a.id)} className="link">Delete<span className="sr-only"> address for {a.name}</span></button></div>
                </li>
              ))}
            </ul>
            {!addresses.length && !editing && <p className="text-muted">No saved addresses.</p>}
          </section>
        )}
        {tab === 'Wishlist' && <WishlistView embedded />}
        {tab === 'Profile' && (
          <section aria-labelledby="p-h" className="max-w-md space-y-3 text-sm">
            <h2 id="p-h" className="mb-6 text-2xl">Profile</h2>
            <p><span className="text-muted">Name:</span> {user.name}</p>
            <p><span className="text-muted">Email:</span> {user.email || '—'}</p>
            <p><span className="text-muted">Mobile:</span> {user.phone ? `+91 ${user.phone}` : '—'}</p>
            <p className="pt-4 text-muted">Need to change something? <a className="link" href={`mailto:${brand.contact.email}`}>Contact us</a>.</p>
          </section>
        )}
      </div>
    </div>
  );
}
