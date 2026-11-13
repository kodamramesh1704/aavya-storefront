import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LOOKBOOKS } from '@/lib/content';
import { getAllProducts } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Price } from '@/components/ui/Price';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return Object.keys(LOOKBOOKS).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = LOOKBOOKS[(await params).slug];
  return l ? { title: `${l.title} Lookbook`, description: l.intro } : {};
}

export default async function Lookbook({ params }: Props) {
  const l = LOOKBOOKS[(await params).slug];
  if (!l) notFound();
  const products = await getAllProducts();
  return (
    <>
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-line/40">
        <Image src={l.hero} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="container relative flex h-full flex-col items-center justify-center text-center text-white">
          <p className="mb-3 text-eyebrow uppercase">Lookbook</p>
          <h1 className="text-display-xl">{l.title}</h1>
          <p className="mt-4 max-w-lg text-white/90">{l.intro}</p>
        </div>
      </section>
      <div className="container pb-20">
        <Breadcrumbs items={[{ label: 'Lookbook' }, { label: l.title }]} />
        <div className="space-y-16 pt-6 md:space-y-24">
          {l.looks.map((look, i) => {
            const items = look.productIdx.map((x) => products[x % products.length]);
            return (
              <section key={look.caption} aria-label={look.caption} className={`grid items-center gap-8 md:grid-cols-12 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-line/40 md:col-span-7">
                  <Image src={look.image} alt={`${look.caption}: ${items.map((p) => p.name).join(' styled with ')}`} fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
                  <span className="absolute left-4 top-4 bg-surface px-3 py-1 text-xs uppercase tracking-wider">{look.caption}</span>
                </div>
                <div className="md:col-span-5">
                  <p className="eyebrow mb-4">Shop this look</p>
                  <ul className="space-y-4">
                    {items.map((p) => (
                      <li key={p.id}>
                        <Link href={`/products/${p.slug}`} className="group flex items-center gap-4">
                          <span className="relative h-28 w-20 shrink-0 bg-line/40"><Image src={p.images[0].src} alt="" fill sizes="80px" className="object-cover" /></span>
                          <span><span className="block group-hover:underline">{p.name}</span><Price price={p.price} compareAtPrice={p.compareAtPrice} size="sm" /></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
