# Changelog

## [Unreleased]
### Added
- M0: `docs/reference-audit.md` and `docs/build-plan.md`.
- M1: Next.js 15 + Tailwind token setup; `brand.config.ts` drives CSS variables; deterministic seed (48 products, 8 categories, 236 generated placeholder images); data layer in `lib/api.ts`; Zustand stores (cart, wishlist, currency, recently viewed, account).
- M2: Global shell: rotating dismissible announcement bar, sticky shrinking header, keyboard-accessible mega-menu, mobile drawer, search overlay with live suggestions, mini-cart with free-shipping meter, footer with mobile accordions, WhatsApp button, toasts.
- M3: Homepage (hero with art-directed crops and pause control, sub-brand split, categories, tabbed new arrivals, editorial, occasions, bestsellers, craft story, shop-the-look, promises, delayed newsletter popup).
- M4: PLP with URL-synced facets (category, size, colour, price range, fabric, occasion, discount), sort, grid density, load more, quick add, empty state, SEO block; `/sale` driven by `compareAtPrice`; `/search`.
- M5: PDP with gallery + zoom lightbox, colour/size selection, size guide (in/cm), low-stock message, pincode check, offers, accordions, share, complete the look, related, recently viewed, mobile sticky bar, Product + Breadcrumb JSON-LD.
### Changed
- Pure helpers split into `lib/product-utils.ts` and `lib/pincode.ts` so the catalogue JSON never ships to the client.
- M6: Cart page (coupons WELCOME10 / FESTIVE20 with min-order rule, gift wrap + message, move to wishlist, free-shipping meter, empty state), 5-step checkout (contact, address with pincode autofill and saved addresses, delivery, payment incl. COD fee and COD serviceability, review), order confirmation, mock order API + email stub, Razorpay integration notes.
- M7: About, store locator, contact form, track order, policy template with sticky TOC, FAQs (FAQPage JSON-LD), shoppable lookbook, wishlist, account (mobile OTP / email login, orders, addresses), branded 404.
- M8: Sitemap and robots; next/font/local with metric-matched fallbacks; favicon; heading-order fixes; lazy tab panels; metadata always in `<head>`.
### Fixed
- Logo link accessible name now matches its visible text (WCAG 2.5.3).
- Order summary `<dl>` markup.
- PLP layout shift under throttled streaming (SEO block moved inside the Suspense boundary).
### Verified
- axe WCAG 2.1 AA: 0 violations (15 pages × desktop/mobile). Lighthouse mobile: Perf 92–95, A11y/BP/SEO 100 on home, PLP and PDP.
