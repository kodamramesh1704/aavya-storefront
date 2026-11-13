import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { POLICIES } from '@/lib/content';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Toc } from './Toc';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return Object.keys(POLICIES).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = POLICIES[(await params).slug];
  return p ? { title: p.title, alternates: { canonical: `/policies/${(await params).slug}` } } : {};
}

/** Reusable long-form template: sticky in-page TOC on desktop, collapsible on mobile. */
export default async function Policy({ params }: Props) {
  const p = POLICIES[(await params).slug];
  if (!p) notFound();
  return (
    <div className="container pb-20">
      <Breadcrumbs items={[{ label: p.title }]} />
      <header className="border-b border-line pb-8">
        <h1 className="text-display-lg">{p.title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated {p.updated}</p>
      </header>
      <div className="grid gap-10 pt-8 lg:grid-cols-[240px_1fr]">
        <Toc sections={p.sections.map(({ id, title }) => ({ id, title }))} />
        <article className="max-w-[68ch] space-y-12">
          {p.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-40">
              <h2 className="mb-4 text-display-md">{s.title}</h2>
              {s.body.map((para, i) => <p key={i} className="mb-4 leading-relaxed text-ink/85">{para}</p>)}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
