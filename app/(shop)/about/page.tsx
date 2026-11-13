import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/brand.config';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = { title: 'About Us', description: `The story of ${brand.name}: ${brand.tagline}.`, alternates: { canonical: '/about' } };

const TIMELINE = [
  ['2012', 'Placeholder: the first block-printing workshop opens with six artisans.'],
  ['2015', 'Placeholder: first flagship store opens.'],
  ['2019', 'Placeholder: the couture line launches with a bridal collection.'],
  ['2023', 'Placeholder: partnerships expand to eight craft clusters.'],
  ['2026', 'Placeholder: online store and new everyday line.'],
];

export default function About() {
  return (
    <>
      <section className="relative h-[46vh] min-h-[320px] overflow-hidden bg-line/40">
        <Image src="/placeholder/about-hero.webp" alt="Artisans at work in a sunlit block-printing studio" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="container relative flex h-full flex-col justify-end pb-10 text-white">
          <p className="mb-2 text-eyebrow uppercase">Our story</p>
          <h1 className="text-display-xl">{brand.tagline}</h1>
        </div>
      </section>
      <div className="container">
        <Breadcrumbs items={[{ label: 'About Us' }]} />
        <section className="mx-auto max-w-2xl py-10 text-center text-lg leading-relaxed">
          <p>Placeholder brand story. Describe where the brand began, what it stands for, and the people and crafts behind every piece. Keep it to two or three short paragraphs; specifics beat superlatives.</p>
        </section>

        <section aria-labelledby="founder-h" className="grid items-center gap-10 py-12 md:grid-cols-2">
          <div className="relative aspect-[9/11] overflow-hidden bg-line/40"><Image src="/placeholder/founder.webp" alt="Portrait of the founder in the studio" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" /></div>
          <div>
            <p className="eyebrow mb-3">A note from the founder</p>
            <h2 id="founder-h" className="text-display-lg">“Clothes should carry the hands that made them.”</h2>
            <p className="mt-6 leading-relaxed text-muted">Placeholder founder’s note. A personal, first-person paragraph about why the label exists and what customers can expect from it.</p>
            <p className="mt-6 font-display text-2xl">Founder Name</p>
          </div>
        </section>

        <section aria-labelledby="tl-h" className="py-12">
          <h2 id="tl-h" className="mb-10 text-center text-display-md">Our journey</h2>
          <ol className="relative mx-auto max-w-2xl border-l border-line pl-8">
            {TIMELINE.map(([y, t]) => (
              <li key={y} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-bg" aria-hidden="true" />
                <p className="font-display text-3xl text-primary">{y}</p>
                <p className="mt-1 text-muted">{t}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="craft-h" className="py-12">
          <h2 id="craft-h" className="mb-8 text-center text-display-md">The craft</h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {['Hand block printing', 'Chikankari', 'Zari work', 'Bandhani', 'Mirror work', 'Ikat weaving'].map((c, i) => (
              <li key={c} className="group relative aspect-square overflow-hidden bg-line/40">
                <Image src={`/placeholder/craft-${i + 1}.webp`} alt={`${c} in progress`} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 p-4 font-display text-xl text-white">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="careers" className="grid gap-6 border-t border-line py-12 md:grid-cols-2">
          <div><h2 className="text-display-md">Careers</h2><p className="mt-3 text-muted">Placeholder: we’re always looking for designers, artisans and store teams. Write to {brand.contact.email}.</p></div>
          <div id="press"><h2 className="text-display-md">Press</h2><p className="mt-3 text-muted">Placeholder: for press enquiries and lookbook requests, contact {brand.contact.email}.</p></div>
        </section>
        <div className="pb-16 text-center"><Link href="/stores" className="btn-outline">Visit a store</Link></div>
      </div>
    </>
  );
}
