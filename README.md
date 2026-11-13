# White-label Indian Fashion Storefront

A production-ready, mobile-first storefront template for premium Indian ethnic and designer wear. It ships with a fictional demo brand (**Aavya Studio**) and 48 placeholder products, so every new client starts from a working site.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 (CSS-variable tokens) · Zustand (persisted cart, wishlist, currency, recently viewed, mock account) · next/image · next/font/local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run seed       # regenerate data/products.json + placeholder images
                   # (images are git-ignored; dev/build generate them automatically if missing)
```

## Architecture

| Concern | Where |
|---|---|
| Brand identity, colours, contact, coupons, shipping rules | `brand.config.ts` |
| Fonts | `app/fonts.ts` (self-hosted via `@fontsource` + `next/font/local`) |
| Colour tokens → CSS variables | `lib/theme.ts` → `tailwind.config.ts` |
| **All data access** (swap for Shopify / Supabase / CMS) | `lib/api.ts` |
| Navigation, collections, categories, occasions | `lib/catalog.ts` |
| Editorial content: stores, FAQs, policies, lookbooks | `lib/content.ts` |
| Pure helpers safe for the client | `lib/product-utils.ts`, `lib/pincode.ts` |
| Payment integration point (Razorpay steps documented) | `lib/payments.ts` |
| Order email stub | `lib/email.ts` (called from `app/api/orders`) |
| Auth integration point | `app/(shop)/account/AccountView.tsx` → `Login` |
| Client state | `store/index.ts` |

Route groups: `app/(shop)` has the full header and footer; `app/checkout` is a distraction-free layout.

## Onboarding a new client in under 1 hour

**1. Brand (10 min).** Edit `brand.config.ts`:
- `name`, `shortName`, `tagline`, `description`, `url`
- `logo`: set `image: '/brand/logo.svg'` and drop the file in `public/brand/`, or keep the text logo
- `subBrands`: one or two lines (e.g. diffusion and couture). The nav, footer and homepage split read from here
- `colors`: keep **ink/bg ≥ 4.5:1** and **muted/bg ≥ 4.5:1**, and check the `sale` and `primary` colours as text on `bg` (use the WebAIM contrast checker)
- `contact`, `social`, `announcements`, `coupons`, `bankOffers`, `shipping` thresholds and fees
- Replace `app/icon.svg` with the client's favicon

**2. Fonts (5 min).** `npm i @fontsource/<display-font> @fontsource/<body-font>`, then point the `src` paths in `app/fonts.ts` at the new `.woff2` files.

**3. Navigation and collections (10 min).** In `lib/catalog.ts`, rename the nav labels, mega-menu columns and tiles. Collections are filter functions, so a new edit is one line.

**4. Content (15 min).** In `lib/content.ts`: stores (with lat/lng for map links), FAQs, policies (legally reviewed text only) and lookbooks. Homepage hero and editorial copy are at the top of `app/(shop)/page.tsx`.

**5. Products (10–20 min).**
- *Demo:* keep the seeded catalogue (`npm run seed` is deterministic).
- *Real catalogue:* replace `data/products.json` with the client's export in the same shape (`types/index.ts → Product`), with images in `public/` or a CDN (add the domain to `images.remotePatterns` in `next.config.mjs`). Every image needs meaningful `alt` text.
- *Headless:* re-implement the functions in `lib/api.ts` against Shopify Storefront API / Supabase. Components do not change.

**6. Ship (5 min).** Set `brand.url` to the production domain (it drives the canonical URLs, sitemap and JSON-LD), push, and import into Vercel.

### Before go-live checklist
- [ ] Razorpay: follow the steps in `lib/payments.ts` (server-side order creation + signature verification + webhook)
- [ ] Email: replace `lib/email.ts` with Resend / SES
- [ ] Auth: replace the mock login with Supabase Auth OTP or Shopify customer accounts
- [ ] Pincode serviceability: replace `lib/pincode.ts` with your courier's API
- [ ] Newsletter: wire `components/ui/NewsletterForm.tsx` to the ESP
- [ ] Prices must be re-validated server-side at order creation; the client cart is not trusted
- [ ] Replace all text marked "Placeholder"

## Quality baseline (demo build, local production server, Lighthouse mobile)

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| Home | 93 | 100 | 100 | 100 |
| Collection (all) | 94 | 100 | 100 | 100 |
| Collection (kurtas) | 92 | 100 | 100 | 100 |
| Product | 95 | 100 | 100 | 100 |

axe-core (WCAG 2.1 A/AA): 0 violations on 15 key pages, desktop and mobile. Checkout, cart and account are `noindex` by design.

## Notes
- **Currency:** INR is the source of truth. USD is a display conversion (`brand.currency.rates`); checkout always charges INR.
- **Newsletter popup:** 8 s delay, once per session, suppressed on product, cart, checkout and account pages and for subscribers.
- **GST:** prices are GST-inclusive. The summary shows the embedded GST at a 12% display rate; replace it with real HSN-based tax from the invoice system.
- **Reference:** structural patterns only; see `docs/reference-audit.md`. No third-party brand assets are used.
