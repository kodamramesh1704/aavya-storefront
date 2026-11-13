import Image from 'next/image';
import { Suspense } from 'react';
import type { Product } from '@/types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { CollectionView } from './CollectionView';

export function CollectionPage({ title, description, banner, seoText, products, crumbs, hideCategoryFacet }: {
  title: string; description?: string; banner?: string; seoText?: string; products: Product[]; crumbs: { label: string; href?: string }[]; hideCategoryFacet?: boolean;
}) {
  return (
    <>
      {banner ? (
        <section className="relative h-[220px] overflow-hidden bg-line/40 md:h-[320px]">
          <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/40" />
          <div className="container relative flex h-full flex-col justify-end pb-8 text-white md:pb-12">
            <h1 className="text-display-xl">{title}</h1>
            {description && <p className="mt-2 max-w-xl text-white/90">{description}</p>}
          </div>
        </section>
      ) : null}
      <div className="container">
        <Breadcrumbs items={crumbs} />
        {!banner && (
          <header className="pb-6 pt-2 text-center">
            <h1 className="text-display-lg">{title}</h1>
            {description && <p className="mx-auto mt-2 max-w-xl text-muted">{description}</p>}
          </header>
        )}
        {/* SEO block lives inside the boundary so streamed content never shifts it. */}
        <Suspense fallback={<div className="min-h-screen" />}>
          <CollectionView products={products} hideCategoryFacet={hideCategoryFacet} />
        {seoText && (
          <details className="group mx-auto mt-16 max-w-3xl border-t border-line py-8 text-sm text-muted">
            <summary className="cursor-pointer list-none font-medium text-ink [&::-webkit-details-marker]:hidden">
              About {title} <span className="ml-1 underline underline-offset-4 group-open:hidden">Read more</span><span className="ml-1 hidden underline underline-offset-4 group-open:inline">Read less</span>
            </summary>
            <p className="mt-4 leading-relaxed">{seoText}</p>
          </details>
        )}
        </Suspense>
        <div className="h-16" />
      </div>
    </>
  );
}
