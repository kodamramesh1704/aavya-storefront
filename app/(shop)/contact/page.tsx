import type { Metadata } from 'next';
import { brand } from '@/brand.config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Icon, SocialIcon } from '@/components/ui/Icon';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = { title: 'Contact Us', alternates: { canonical: '/contact' } };

export default function Contact() {
  const c = brand.contact;
  return (
    <div className="container pb-20">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />
      <h1 className="text-display-lg">Contact us</h1>
      <p className="mt-2 text-muted">We usually reply within one business day.</p>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <ContactForm />
        <aside className="space-y-6 bg-surface p-6 text-sm">
          <h2 className="text-2xl">Reach us directly</h2>
          <p className="flex gap-3"><Icon name="phone" size={20} /><a href={`tel:${c.phone.replace(/\s/g, '')}`} className="link">{c.phone}</a></p>
          <p className="flex gap-3"><SocialIcon name="whatsapp" size={20} /><a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link">Chat on WhatsApp</a></p>
          <p className="flex gap-3"><Icon name="mail" size={20} /><a href={`mailto:${c.email}`} className="link">{c.email}</a></p>
          <p className="flex gap-3"><Icon name="pin" size={20} />{c.address}</p>
          <p className="flex gap-3"><Icon name="clock" size={20} />{c.hours}</p>
        </aside>
      </div>
    </div>
  );
}
