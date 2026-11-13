import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brand } from '@/brand.config';
import { getAllProducts, getCompleteTheLook, getProductBySlug, getRelated } from '@/lib/api';
import { categoryName } from '@/lib/catalog';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Gallery } from '@/components/pdp/Gallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { RecentlyViewed } from '@/components/pdp/RecentlyViewed';
import { ProductRail } from '@/components/ui/ProductRail';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.description.split('.')[0]}. ${p.fabric}, ${p.technique.toLowerCase()}. Shop at ${brand.name}.`,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { images: [{ url: p.images[0].src, alt: p.images[0].alt }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = await getProductBySlug((await params).slug);
  if (!p) notFound();
  const [look, related] = await Promise.all([getCompleteTheLook(p), getRelated(p)]);
  const inStock = p.sizes.some((s) => p.stock[s] > 0);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    image: p.images.map((i) => brand.url + i.src),
    description: p.description,
    brand: { '@type': 'Brand', name: brand.name },
    material: p.fabric,
    color: p.colors.map((c) => c.name).join(', '),
    offers: {
      '@type': 'Offer',
      url: `${brand.url}/products/${p.slug}`,
      priceCurrency: 'INR',
      price: p.price,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <div className="container">
        <Breadcrumbs items={[{ label: categoryName(p.category), href: `/collections/${p.category}` }, { label: p.name }]} />
        <div className="grid gap-8 pb-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="-mx-4 md:mx-0"><Gallery images={p.images} name={p.name} /></div>
          <div className="lg:sticky lg:top-36 lg:self-start"><ProductInfo product={p} /></div>
        </div>
      </div>
      {look.length > 0 && (
        <section className="bg-surface py-12" aria-labelledby="ctl-h">
          <div className="container">
            <h2 id="ctl-h" className="mb-6 text-display-md">Complete the Look</h2>
            <ProductRail products={look} label="Complete the look" />
          </div>
        </section>
      )}
      <section className="container py-12" aria-labelledby="ymal-h">
        <h2 id="ymal-h" className="mb-6 text-display-md">You May Also Like</h2>
        <ProductRail products={related} label="You may also like" />
      </section>
      <RecentlyViewed excludeId={p.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
