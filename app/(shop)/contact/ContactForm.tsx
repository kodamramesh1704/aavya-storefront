'use client';
import { useState } from 'react';

type E = Partial<Record<'name' | 'email' | 'message', string>>;

export function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', phone: '', topic: 'Order enquiry', order: '', message: '' });
  const [e, setE] = useState<E>({});
  const [sent, setSent] = useState(false);
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs: E = {};
    if (v.name.trim().length < 2) errs.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(v.email)) errs.email = 'Enter a valid email address.';
    if (v.message.trim().length < 10) errs.message = 'Tell us a little more (at least 10 characters).';
    setE(errs);
    const first = Object.keys(errs)[0];
    if (first) return document.getElementById(`c-${first}`)?.focus();
    // Integration point: POST to helpdesk (Freshdesk / Zendesk / email) here.
    setSent(true);
  };
  if (sent) return <div role="status" className="bg-surface p-8"><h2 className="text-2xl">Thank you, {v.name.split(' ')[0]}</h2><p className="mt-2 text-muted">We’ve received your message and will reply to {v.email} within one business day.</p></div>;
  const err = (k: keyof E) => ({ 'aria-invalid': !!e[k], 'aria-describedby': e[k] ? `c-${k}-err` : undefined });
  return (
    <form onSubmit={submit} noValidate className="grid gap-5 md:grid-cols-2">
      <div><label htmlFor="c-name" className="label">Name</label><input id="c-name" autoComplete="name" className="input" value={v.name} onChange={(x) => setV({ ...v, name: x.target.value })} {...err('name')} />{e.name && <p id="c-name-err" className="mt-1 text-sm text-sale">{e.name}</p>}</div>
      <div><label htmlFor="c-email" className="label">Email</label><input id="c-email" type="email" autoComplete="email" className="input" value={v.email} onChange={(x) => setV({ ...v, email: x.target.value })} {...err('email')} />{e.email && <p id="c-email-err" className="mt-1 text-sm text-sale">{e.email}</p>}</div>
      <div><label htmlFor="c-phone" className="label">Phone (optional)</label><input id="c-phone" type="tel" autoComplete="tel" className="input" value={v.phone} onChange={(x) => setV({ ...v, phone: x.target.value })} /></div>
      <div><label htmlFor="c-topic" className="label">Topic</label><select id="c-topic" className="input" value={v.topic} onChange={(x) => setV({ ...v, topic: x.target.value })}>{['Order enquiry', 'Returns & exchange', 'Sizing help', 'Custom / bridal order', 'Other'].map((t) => <option key={t}>{t}</option>)}</select></div>
      <div className="md:col-span-2"><label htmlFor="c-order" className="label">Order number (optional)</label><input id="c-order" className="input" value={v.order} onChange={(x) => setV({ ...v, order: x.target.value })} /></div>
      <div className="md:col-span-2"><label htmlFor="c-message" className="label">Message</label><textarea id="c-message" rows={6} className="input h-auto py-3" value={v.message} onChange={(x) => setV({ ...v, message: x.target.value })} {...err('message')} />{e.message && <p id="c-message-err" className="mt-1 text-sm text-sale">{e.message}</p>}</div>
      <div><button type="submit" className="btn-primary">Send message</button></div>
    </form>
  );
}
