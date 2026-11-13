'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { NewsletterForm } from '../ui/NewsletterForm';

/**
 * First-visit popup: 8s delay, once per session, never on PDP/cart/checkout
 * (avoids interrupting purchase intent; Google penalises intrusive interstitials on mobile).
 */
export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (/^\/(products|cart|checkout|account)/.test(pathname)) return;
    try {
      if (sessionStorage.getItem('av-popup') || localStorage.getItem('av-subscribed')) return;
    } catch { return; }
    const t = setTimeout(() => { setOpen(true); try { sessionStorage.setItem('av-popup', '1'); } catch {} }, 8000);
    return () => clearTimeout(t);
  }, [pathname]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} title="10% off your first order" hideTitle variant="center" className="max-w-3xl overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative hidden aspect-[4/5] md:block"><Image src="/placeholder/newsletter.webp" alt="" fill sizes="400px" className="object-cover" /></div>
        <div className="relative flex flex-col justify-center p-8">
          <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 p-2 text-2xl leading-none" aria-label="Close">×</button>
          <p className="eyebrow mb-3">Join the studio</p>
          <p className="font-display text-3xl" aria-hidden="true">10% off your first order</p>
          <p className="mb-6 mt-3 text-sm text-muted">Get first look at new collections, craft stories and private sale access.</p>
          <NewsletterForm />
          <button type="button" onClick={() => setOpen(false)} className="mt-4 self-start text-sm text-muted underline underline-offset-4">No thanks</button>
        </div>
      </div>
    </Dialog>
  );
}
