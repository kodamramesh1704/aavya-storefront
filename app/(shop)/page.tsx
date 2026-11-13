import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/brand.config';
import { CATEGORIES, OCCASIONS } from '@/lib/catalog';
import { getAllProducts, getBestsellers, getNewArrivals } from '@/lib/api';
import { HeroCarousel, type Slide } from '@/components/home/HeroCarousel';
import { ProductTabs } from '@/components/home/Tabs';
import { ShopTheLook } from '@/components/home/ShopTheLook';
import { ProductRail, SectionHeading } from '@/components/ui/ProductRail';
import { Icon } from '@/components/ui/Icon';

// Placeholder merchandising content: in production this comes from a CMS.
const SLIDES: Slide[] = [
  { desktop: '/placeholder/hero-1-desktop.webp', mobile: '/placeholder/hero-1-mobile.webp', alt: 'Model in a rust block-printed kurta set against arched doorways', eyebrow: 'New Season', title: 'The Festive Edit', text: 'Zari, mirror work and rich silks, made for the season of celebrations.', cta: 'Shop the Edit', href: '/collections/festive' },
  { desktop: '/placeholder/hero-2-desktop.webp', mobile: '/placeholder/hero-2-mobile.webp', alt: 'Teal linen co-ord set in soft morning light', eyebrow: brand.subBrands[0].name, title: 'Made for Every Day', text: 'Breathable cottons and linens with quiet, handcrafted detail.', cta: 'Shop Everyday', href: '/collections/everyday' },
  { desktop: '/placeholder/hero-3-desktop.webp', mobile: '/placeholder/hero-3-mobile.webp', alt: 'Maroon embroidered lehenga in a heritage courtyard', eyebrow: 'Bridal & Festive', title: 'Heirlooms in the Making', text: 'Lehengas and sarees, hand-finished over hundreds of hours.', cta: 'Explore Bridal', href: '/collections/bridal-festive' },
];

const PROMISES = [
  { icon: 'truck', title: 'Free Shipping', text: `On orders above ₹${brand.shipping.freeThreshold.toLocaleString('en-IN')}` },
  { icon: 'return', title: 'Easy Returns', text: '15-day returns & exchanges' },
  { icon: 'lock', title: 'Secure Payments', text: 'UPI, cards, net banking, COD' },
  { icon: 'india', title: 'Made in India', text: 'With artisan communities' },
];

export default async function Home() {
  const [all, everyday, couture, best, products] = await Promise.all([getNewArrivals(), getNewArrivals('everyday'), getNewArrivals('couture'), getBestsellers(), getAllProducts()]);
  const looks = [0, 1, 2, 3, 4, 5].map((i) => ({ image: `/placeholder/insta-${i + 1}.webp`, products: [products[(i * 7) % products.length], products[(i * 7 + 38) % products.length]] }));

  return (
    <>
      {/* 1. Hero */}
      <HeroCarousel slides={SLIDES} />

      {/* 2. Sub-brand split */}
      <section aria-label="Our lines" className="container grid gap-4 py-12 md:grid-cols-2 md:py-16">
        {brand.subBrands.map((sb) => (
          <Link key={sb.slug} href={`/collections/${sb.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-line/40 md:aspect-[6/7]">
            <Image src={`/placeholder/subbrand-${sb.slug}.webp`} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
              <h2 className="text-display-lg">{sb.name}</h2>
              <p className="mt-2 text-white/90">{sb.blurb}</p>
              <span className="mt-5 inline-block border-b border-white pb-1 text-sm uppercase tracking-wider">Shop now</span>
            </div>
          </Link>
        ))}
      </section>

      {/* 3. Shop by category */}
      <section className="container pb-12 md:pb-16" aria-labelledby="cat-h">
        <h2 id="cat-h" className="mb-6 text-center text-display-md md:mb-8">Shop by Category</h2>
        <ul className="scroll-x lg:grid lg:grid-cols-8 lg:overflow-visible">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="w-[38%] shrink-0 snap-start sm:w-[24%] lg:w-auto">
              <Link href={`/collections/${c.slug}`} className="group block text-center">
                <div className="relative aspect-portrait overflow-hidden rounded-t-full bg-line/40">
                  <Image src={c.image} alt="" fill sizes="(min-width:1024px) 12vw, 38vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 text-sm font-medium uppercase tracking-wider group-hover:underline">{c.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. New arrivals with tabs */}
      <section className="container pb-12 md:pb-20" aria-labelledby="na-h">
        <div className="mb-2 flex items-end justify-between">
          <h2 id="na-h" className="text-display-md">New Arrivals</h2>
          <Link href="/collections/new-arrivals" className="link text-sm">View all</Link>
        </div>
        <ProductTabs tabs={[{ id: 'all', label: 'All', products: all }, { id: 'everyday', label: brand.subBrands[0].name, products: everyday }, { id: 'couture', label: brand.subBrands[1].name, products: couture }]} />
      </section>

      {/* 5. Editorial campaign */}
      <section className="bg-surface" aria-labelledby="ed-h">
        <div className="container grid items-center gap-8 py-12 md:grid-cols-12 md:gap-12 md:py-20">
          <div className="relative aspect-[4/3] overflow-hidden md:col-span-7">
            <Image src="/placeholder/editorial.webp" alt="Campaign image: mustard silk sets in a sunlit haveli" fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">The Campaign</p>
            <h2 id="ed-h" className="text-display-lg">Golden Hour</h2>
            <p className="mt-5 leading-relaxed text-muted">Placeholder campaign story. Two or three sentences on the inspiration behind the collection, the region and craft it draws from, and the mood it is meant to carry. Replace with client copy.</p>
            <Link href="/lookbook/the-festive-edit" className="btn-outline mt-8">Explore the Collection</Link>
          </div>
        </div>
      </section>

      {/* 6. Shop by occasion */}
      <section className="container py-12 md:py-20" aria-labelledby="occ-h">
        <SectionHeading eyebrow="Dress for the moment" title="Shop by Occasion" />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
          {OCCASIONS.map((o, i) => (
            <li key={o.slug} className={i === 0 ? 'col-span-2 row-span-2 md:col-span-2' : i < 3 ? 'md:col-span-2' : 'md:col-span-2 lg:col-span-2'}>
              <Link href={`/collections/occasion-${o.slug}`} className="group relative block h-full min-h-[200px] overflow-hidden bg-line/40 md:min-h-[260px]">
                <Image src={o.image} alt="" fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-2xl text-white md:text-3xl">{o.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Bestsellers */}
      <section className="container pb-12 md:pb-20" aria-labelledby="bs-h">
        <div className="mb-6 flex items-end justify-between md:mb-8">
          <h2 id="bs-h" className="text-display-md">Bestsellers</h2>
          <Link href="/collections/bestsellers" className="link text-sm">View all</Link>
        </div>
        <ProductRail products={best} label="Bestsellers" />
      </section>

      {/* 8. Craft / heritage */}
      <section className="bg-primary text-primary-fg" aria-labelledby="craft-h">
        <div className="container grid items-center gap-8 py-12 md:grid-cols-2 md:gap-16 md:py-20">
          <div className="relative aspect-[7/6] overflow-hidden md:order-2">
            <Image src="/placeholder/craft.webp" alt="Artisan hands block-printing indigo motifs on cotton" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="mb-3 text-eyebrow uppercase text-primary-fg/80">Our Craft</p>
            <h2 id="craft-h" className="text-display-lg">Made by hand, meant to last</h2>
            <p className="mt-5 leading-relaxed text-primary-fg/85">Placeholder heritage copy. Describe the techniques the brand works with, such as hand block printing from Rajasthan, chikankari from Lucknow and zari from Varanasi, and the artisan clusters behind each piece. Replace with client copy.</p>
            <ul className="mt-8 grid grid-cols-3 gap-4 border-t border-primary-fg/20 pt-6 text-center">
              {[['120+', 'Artisans'], ['8', 'Craft clusters'], ['100%', 'Natural dyes in Everyday']].map(([n, l]) => (
                <li key={l}><span className="block font-display text-3xl">{n}</span><span className="text-xs text-primary-fg/80">{l}</span></li>
              ))}
            </ul>
            <Link href="/about" className="btn mt-8 border border-primary-fg hover:bg-primary-fg hover:text-primary">Our Story</Link>
          </div>
        </div>
      </section>

      {/* 9. Shop the look */}
      <section className="container py-12 md:py-20" aria-labelledby="stl-h">
        <SectionHeading eyebrow="@aavyastudio" title="Shop the Look" action={<a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="link text-sm">Follow us<span className="sr-only"> on Instagram (opens in a new tab)</span></a>} />
        <ShopTheLook tiles={looks} handle="@aavyastudio" href={brand.social.instagram} />
      </section>

      {/* 10. Promises */}
      <section aria-label="Our promises" className="border-y border-line bg-surface">
        <ul className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {PROMISES.map((p) => (
            <li key={p.title} className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
              <Icon name={p.icon} size={30} strokeWidth={1.2} className="shrink-0 text-primary" />
              <div><p className="text-sm font-medium">{p.title}</p><p className="text-xs text-muted">{p.text}</p></div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
