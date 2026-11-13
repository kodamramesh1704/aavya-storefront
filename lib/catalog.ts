// Static catalogue metadata (categories, collections, menus). Client content: edit freely.
import type { Collection, Product } from '@/types';

export const CATEGORIES = [
  { slug: 'kurtas', name: 'Kurtas', image: '/placeholder/tile-1.webp' },
  { slug: 'suit-sets', name: 'Suit Sets', image: '/placeholder/tile-2.webp' },
  { slug: 'sarees', name: 'Sarees', image: '/placeholder/tile-3.webp' },
  { slug: 'lehengas', name: 'Lehengas', image: '/placeholder/tile-4.webp' },
  { slug: 'dresses', name: 'Dresses', image: '/placeholder/tile-5.webp' },
  { slug: 'co-ords', name: 'Co-ord Sets', image: '/placeholder/tile-6.webp' },
  { slug: 'accessories', name: 'Accessories', image: '/placeholder/tile-7.webp' },
  { slug: 'home-living', name: 'Home & Living', image: '/placeholder/tile-8.webp' },
];
export const categoryName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export const OCCASIONS = [
  { slug: 'festive', name: 'Festive', image: '/placeholder/look-1.webp' },
  { slug: 'wedding-guest', name: 'Wedding Guest', image: '/placeholder/look-2.webp' },
  { slug: 'workwear', name: 'Workwear', image: '/placeholder/look-3.webp' },
  { slug: 'everyday', name: 'Everyday', image: '/placeholder/look-4.webp' },
  { slug: 'resort', name: 'Resort', image: '/placeholder/look-5.webp' },
];
const occasionName = (slug: string) => OCCASIONS.find((o) => o.slug === slug)?.name;

const seo = (topic: string) =>
  `Explore ${topic} handcrafted in India. Each piece is made in small batches with artisan partners, using natural fabrics and traditional techniques like block printing, chikankari and zari work. Placeholder SEO copy: replace with client-written text that describes the range, fit, fabrics and styling ideas for ${topic.toLowerCase()}.`;

const base: Collection[] = [
  { slug: 'all', title: 'Shop All', description: 'Kurtas, suit sets, sarees, lehengas and more, all handcrafted in India.', filter: () => true, seoText: seo('our full range') },
  { slug: 'new-arrivals', title: 'New Arrivals', description: 'Fresh off the loom: the latest pieces from our studio.', banner: '/placeholder/collection-banner.webp', filter: (p) => p.tags.includes('new'), seoText: seo('new arrivals') },
  { slug: 'bestsellers', title: 'Bestsellers', filter: (p) => p.tags.includes('bestseller'), seoText: seo('bestsellers') },
  { slug: 'sale', title: 'Sale', description: 'Considered pieces at considered prices. Limited sizes.', banner: '/placeholder/collection-banner.webp', filter: (p) => p.compareAtPrice !== null && p.compareAtPrice > p.price, seoText: seo('sale styles') },
  { slug: 'festive', title: 'The Festive Edit', description: 'Zari, mirror work and rich silks for the season of celebrations.', banner: '/placeholder/editorial.webp', filter: (p) => p.collections.includes('festive'), seoText: seo('festive wear') },
  { slug: 'summer-linen', title: 'Summer Linen', description: 'Breathable linens and cottons in sun-washed colours.', filter: (p) => p.collections.includes('summer-linen') },
  { slug: 'everyday', title: 'Aavya Everyday', description: 'Easy cottons and linens for every day.', banner: '/placeholder/subbrand-everyday.webp', filter: (p) => p.subBrand === 'everyday' && !['accessories', 'home-living'].includes(p.category) },
  { slug: 'couture', title: 'Aavya Couture', description: 'Heirloom craft for celebrations.', banner: '/placeholder/subbrand-couture.webp', filter: (p) => p.subBrand === 'couture' && !['accessories', 'home-living'].includes(p.category) },
  { slug: 'bridal-festive', title: 'Bridal & Festive', description: 'Lehengas, sarees and sets for the big days.', banner: '/placeholder/hero-3-desktop.webp', filter: (p) => ['lehengas', 'sarees'].includes(p.category) || p.collections.includes('festive') },
];
const cats: Collection[] = CATEGORIES.map((c) => ({ slug: c.slug, title: c.name, filter: (p: Product) => p.category === c.slug, seoText: seo(c.name.toLowerCase()) }));
const occs: Collection[] = OCCASIONS.map((o) => ({ slug: `occasion-${o.slug}`, title: `${o.name} Edit`, filter: (p: Product) => p.occasion.includes(o.name), seoText: seo(`${o.name.toLowerCase()} styles`) }));

export const COLLECTIONS: Collection[] = [...base, ...cats, ...occs];
export const getCollectionMeta = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
export { occasionName };

// ----- Navigation -----
export type MenuColumn = { title: string; links: { label: string; href: string }[] };
export type NavItem = { label: string; href: string; highlight?: boolean; columns?: MenuColumn[]; tiles?: { image: string; label: string; href: string }[] };

const shopByCategory = (prefix = ''): MenuColumn => ({
  title: 'Shop by Category',
  links: CATEGORIES.filter((c) => !['accessories', 'home-living'].includes(c.slug)).map((c) => ({ label: c.name, href: `/collections/${c.slug}${prefix}` })),
});
const shopByOccasion: MenuColumn = { title: 'Shop by Occasion', links: OCCASIONS.map((o) => ({ label: o.name, href: `/collections/occasion-${o.slug}` })) };
const collectionsCol: MenuColumn = {
  title: 'Collections',
  links: [
    { label: 'The Festive Edit', href: '/collections/festive' },
    { label: 'Summer Linen', href: '/collections/summer-linen' },
    { label: 'Bestsellers', href: '/collections/bestsellers' },
    { label: 'Lookbook', href: '/lookbook/the-festive-edit' },
  ],
};

export const NAV: NavItem[] = [
  { label: 'New Arrivals', href: '/collections/new-arrivals', columns: [shopByCategory(), collectionsCol], tiles: [{ image: '/placeholder/menu-1.webp', label: 'Just landed', href: '/collections/new-arrivals' }] },
  { label: 'Aavya Everyday', href: '/collections/everyday', columns: [shopByCategory('?brand=everyday'), shopByOccasion], tiles: [{ image: '/placeholder/subbrand-everyday.webp', label: 'Everyday essentials', href: '/collections/everyday' }] },
  { label: 'Aavya Couture', href: '/collections/couture', columns: [shopByCategory('?brand=couture'), shopByOccasion, collectionsCol], tiles: [{ image: '/placeholder/subbrand-couture.webp', label: 'Couture', href: '/collections/couture' }, { image: '/placeholder/menu-2.webp', label: 'The Festive Edit', href: '/collections/festive' }] },
  { label: 'Bridal / Festive', href: '/collections/bridal-festive', columns: [{ title: 'Shop', links: [{ label: 'Lehengas', href: '/collections/lehengas' }, { label: 'Sarees', href: '/collections/sarees' }, { label: 'Festive Edit', href: '/collections/festive' }, { label: 'Wedding Guest', href: '/collections/occasion-wedding-guest' }] }], tiles: [{ image: '/placeholder/menu-2.webp', label: 'Bridal stories', href: '/lookbook/the-festive-edit' }] },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'Home & Living', href: '/collections/home-living' },
  { label: 'Sale', href: '/sale', highlight: true },
  { label: 'Stores', href: '/stores' },
];

export const FOOTER = {
  care: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Returns & Exchange', href: '/policies/returns' },
    { label: 'Fees & Payments', href: '/policies/payments' },
    { label: 'Shipping & Delivery', href: '/policies/shipping' },
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms & Conditions', href: '/policies/terms' },
    { label: 'FAQs', href: '/faqs' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Store Locator', href: '/stores' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press', href: '/about#press' },
  ],
};
