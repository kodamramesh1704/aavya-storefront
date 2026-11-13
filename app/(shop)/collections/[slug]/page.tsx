import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brand } from '@/brand.config';
import { COLLECTIONS, CATEGORIES } from '@/lib/catalog';
import { getCollection } from '@/lib/api';
import { CollectionPage } from '@/components/plp/CollectionPage';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ brand?: string }> };

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) return {};
  return {
    title: c.meta.title,
    description: c.meta.description ?? `Shop ${c.meta.title.toLowerCase()} from ${brand.name}. Handcrafted in India, with free shipping above ₹${brand.shipping.freeThreshold}.`,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { brand: sub } = await searchParams;
  const subBrand = brand.subBrands.find((b) => b.slug === sub);
  const c = await getCollection(slug, subBrand?.slug);
  if (!c) notFound();
  const isCategory = CATEGORIES.some((x) => x.slug === slug);
  return (
    <CollectionPage
      title={subBrand ? `${subBrand.name} · ${c.meta.title}` : c.meta.title}
      description={c.meta.description}
      banner={c.meta.banner}
      seoText={c.meta.seoText}
      products={c.products}
      hideCategoryFacet={isCategory}
      crumbs={[...(subBrand ? [{ label: subBrand.name, href: `/collections/${subBrand.slug}` }] : []), { label: c.meta.title }]}
    />
  );
}
