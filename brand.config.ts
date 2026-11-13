/**
 * WHITE-LABEL CONFIG: the only file to edit when onboarding a new client.
 * Colours are hex; they are converted to CSS variables at runtime (app/layout.tsx).
 */
export const brand = {
  name: 'Aavya Studio',
  shortName: 'Aavya',
  tagline: 'Handcrafted Indian wear, made for now',
  description:
    'Contemporary Indian womenswear: kurtas, suits, sarees and festive wear, crafted with artisan communities across India.',
  url: 'https://example.com',
  logo: { text: 'AAVYA', sub: 'STUDIO', image: null as string | null }, // set image to '/brand/logo.svg' to use a file
  subBrands: [
    { slug: 'everyday', name: 'Aavya Everyday', blurb: 'Easy cottons and linens for every day.' },
    { slug: 'couture', name: 'Aavya Couture', blurb: 'Heirloom craft for celebrations.' },
  ],
  colors: {
    primary: '#5C1A24', // deep maroon: buttons, links
    primaryFg: '#FFFFFF',
    accent: '#8A6A22', // antique gold, AA on bg for text ≥ 18px; decorative otherwise
    bg: '#FAF7F2',
    surface: '#FFFFFF',
    ink: '#1F1A17',
    muted: '#5E5650', // 6.6:1 on bg
    line: '#E4DCD0',
    sale: '#A3262A', // 6.2:1 on bg
    success: '#2E6B3A',
  },
  fonts: {
    // Reference only: the actual font files are wired in app/fonts.ts (next/font/local).
    display: 'Cormorant Garamond',
    body: 'Jost',
  },
  currency: {
    base: 'INR' as const,
    supported: ['INR', 'USD'] as const,
    // Display-only conversion. Checkout always charges INR.
    rates: { INR: 1, USD: 0.012 },
  },
  shipping: { freeThreshold: 2999, standardFee: 149, expressFee: 349, codFee: 99 },
  contact: {
    phone: '+91 00000 00000',
    whatsapp: '910000000000',
    email: 'care@example.com',
    address: 'Placeholder address, Surat, Gujarat 395007',
    hours: 'Mon–Sat, 10am–7pm IST',
  },
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    pinterest: 'https://pinterest.com/',
    youtube: 'https://youtube.com/',
  },
  announcements: [
    { text: 'Free shipping on orders above ₹2,999', href: '/collections/new-arrivals' },
    { text: 'The Festive Edit is here', href: '/collections/festive' },
    { text: 'Season sale: up to 40% off', href: '/sale' },
  ],
  coupons: {
    WELCOME10: { type: 'percent', value: 10, label: '10% off your first order' },
    FESTIVE20: { type: 'percent', value: 20, label: '20% off, minimum ₹4,999', min: 4999 },
  } as Record<string, { type: 'percent' | 'flat'; value: number; label: string; min?: number }>,
  bankOffers: [
    'Extra 5% off on UPI payments above ₹3,000',
    'No-cost EMI on select credit cards above ₹10,000',
  ],
  seo: { titleTemplate: '%s | Aavya Studio', defaultTitle: 'Aavya Studio | Handcrafted Indian Wear' },
} as const;

export type Brand = typeof brand;
export type CurrencyCode = (typeof brand.currency.supported)[number];
