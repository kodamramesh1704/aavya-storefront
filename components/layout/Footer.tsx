'use client';
import Link from 'next/link';
import { useState } from 'react';
import { brand } from '@/brand.config';
import { CATEGORIES, FOOTER } from '@/lib/catalog';
import { Icon, SocialIcon } from '../ui/Icon';
import { NewsletterForm } from '../ui/NewsletterForm';

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const id = `f-${title.replace(/\W/g, '')}`;
  return (
    <div className="border-b border-bg/15 md:border-0">
      <h2 className="font-sans">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-left text-xs font-medium uppercase tracking-[0.16em] md:pointer-events-none md:py-0 md:pb-4">
          {title}<Icon name={open ? 'minus' : 'plus'} size={16} className="md:hidden" />
        </button>
      </h2>
      <ul id={id} className={`${open ? 'block' : 'hidden'} space-y-2.5 pb-5 text-sm text-bg/80 md:block`}>
        {links.map((l) => <li key={l.href + l.label}><Link href={l.href} className="hover:text-bg hover:underline">{l.label}</Link></li>)}
      </ul>
    </div>
  );
}

const PAYMENTS = ['UPI', 'Visa', 'Mastercard', 'RuPay', 'Amex', 'Net Banking', 'COD'];

export function Footer() {
  const apparel = CATEGORIES.slice(0, 6);
  return (
    <footer className="bg-ink text-bg">
      <div className="container grid gap-10 py-12 md:grid-cols-2 md:py-16">
        <div>
          <h2 className="text-display-md">Stay in the loop</h2>
          <p className="mt-2 max-w-md text-sm text-bg/80">New collections, craft stories and early access to sales. 10% off your first order.</p>
        </div>
        <NewsletterForm dark />
      </div>
      <div className="container grid gap-0 border-t border-bg/15 py-6 md:grid-cols-4 md:gap-8 md:py-12">
        <Col title="Customer Care" links={FOOTER.care} />
        <Col title="Our Company" links={FOOTER.company} />
        {brand.subBrands.map((sb) => (
          <Col key={sb.slug} title={sb.name} links={[{ label: `Shop ${sb.name}`, href: `/collections/${sb.slug}` }, ...apparel.map((c) => ({ label: c.name, href: `/collections/${c.slug}?brand=${sb.slug}` }))]} />
        ))}
      </div>
      <div className="container flex flex-col gap-6 border-t border-bg/15 py-8 md:flex-row md:items-center md:justify-between">
        <ul className="flex gap-2" aria-label="Social media">
          {(Object.keys(brand.social) as (keyof typeof brand.social)[]).map((k) => (
            <li key={k}><a href={brand.social[k]} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-bg/25 hover:bg-bg hover:text-ink" aria-label={`${k[0].toUpperCase() + k.slice(1)} (opens in a new tab)`}><SocialIcon name={k} /></a></li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
          {PAYMENTS.map((p) => <li key={p} className="rounded border border-bg/25 px-2 py-1 text-[11px] tracking-wide text-bg/85">{p}</li>)}
        </ul>
      </div>
      <div className="container border-t border-bg/15 py-6 text-xs text-bg/70">
        <p>© {new Date().getFullYear()} {brand.name}. All rights reserved. · {brand.contact.address}</p>
      </div>
    </footer>
  );
}
