import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQS } from '@/lib/content';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Accordion } from '@/components/ui/Accordion';

export const metadata: Metadata = { title: 'FAQs', alternates: { canonical: '/faqs' } };

export default function Faqs() {
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.flatMap((g) => g.items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }))) };
  return (
    <div className="container max-w-3xl pb-20">
      <Breadcrumbs items={[{ label: 'FAQs' }]} />
      <h1 className="text-display-lg">Frequently asked questions</h1>
      <nav aria-label="FAQ topics" className="scroll-x my-8">
        {FAQS.map((g) => <a key={g.topic} href={`#${g.topic.replace(/\W+/g, '-').toLowerCase()}`} className="shrink-0 rounded-full border border-line px-4 py-2 text-sm hover:border-ink">{g.topic}</a>)}
      </nav>
      {FAQS.map((g) => (
        <section key={g.topic} id={g.topic.replace(/\W+/g, '-').toLowerCase()} className="scroll-mt-40 pb-10">
          <h2 className="mb-2 text-display-md">{g.topic}</h2>
          <div className="border-t border-line">{g.items.map((i) => <Accordion key={i.q} title={i.q}>{i.a}</Accordion>)}</div>
        </section>
      ))}
      <p className="text-muted">Still need help? <Link href="/contact" className="link text-ink">Contact us</Link>.</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
