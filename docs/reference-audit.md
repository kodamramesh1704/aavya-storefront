# Reference audit: premium Indian designer-wear storefront patterns

> **Method note:** ritukumar.com sits behind a Cloudflare bot check that blocks
> automated browsers from this environment, and we chose not to circumvent it.
> This audit records the **structural patterns** common to premium Indian
> designer-wear storefronts (the category ritukumar.com belongs to, alongside
> peers in the same segment), cross-checked against the brief. Nothing here
> describes or reproduces that brand's logo, imagery, product names, copy or
> visual styling. **To validate against the live site, attach screenshots of
> home, PLP, PDP, cart and sale, and this doc will be updated.**

## 1. Navigation and mega-menu

| Level | Pattern |
|---|---|
| Utility (top) | Announcement bar (rotating, 2–4 messages: shipping threshold, new drop, sale) |
| Header row | Search (left on desktop), **centred logo**, right cluster: currency/country, account, wishlist, bag with count |
| Primary nav | New Arrivals · Sub-brand lines (diffusion vs couture) · Bridal/Festive · Accessories · Home · **Sale (often in accent colour)** · Stores |
| Mega-menu | Hover (desktop) with intent delay. 3–4 text columns: *Shop by Category* (Kurtas, Sets, Sarees, Lehengas, Dresses, Co-ords), *Shop by Occasion*, *Collections* (campaign names), plus 1–2 editorial image tiles with a CTA |
| Mobile | Hamburger → full-height drawer, accordion levels, sub-brand tabs at top; utilities (account, stores, contact) at the bottom of the drawer |

**Keep:** the sub-brand split. Premium Indian labels nearly always run a diffusion line next to the main/couture line, and IA should mirror that.
**Improve:** many sites in this segment open mega-menus on hover only. We add keyboard support (Enter/Space/Arrow, Esc to close) and a hover-intent delay.

## 2. Homepage section order (typical)
1. Full-bleed hero carousel (campaign imagery, separate mobile crops)
2. Sub-brand split tiles
3. Shop by category (horizontal scroll on mobile)
4. New arrivals rail
5. Campaign/editorial block
6. Occasion grid
7. Bestsellers rail
8. Craft/heritage storytelling
9. Social/Instagram or shop-the-look grid
10. Service promises strip → newsletter → footer

## 3. PLP
- Banner (image or title-only), breadcrumbs
- Toolbar: count, sort (Featured / New / Price ↑↓ / Bestselling), grid density toggle
- Facets: Category, Size, Colour (swatches), Price, Fabric, Occasion, Discount
- Desktop: left sidebar. Mobile: bottom sheet with sticky "Apply"
- **Card anatomy:** portrait 3:4 image → hover swaps to second image; wishlist heart top-right; badge top-left (New / % Off); name (1–2 lines); price, then strikethrough MRP, then % off in accent; colour dots
- Load-more with progress count is more common than numbered pagination in this segment
- SEO copy block at the foot of category pages

## 4. PDP
- Gallery: vertical thumbs + main image (desktop), swipe + dots (mobile), fullscreen zoom
- Right column sticky: name, SKU, price block with **"Inclusive of all taxes"** (statutory expectation in India for MRP display)
- Size buttons (XS–XXL, sometimes custom/made-to-measure), size-guide modal in inches/cm
- **Pincode check** for delivery ETA and COD eligibility; this is standard in Indian e-commerce
- Add to Bag + Buy Now, wishlist
- Accordions: details, fabric & care, shipping & returns, handcraft disclaimer
- Cross-sell: Complete the look, You may also like, Recently viewed
- Mobile sticky add-to-bag bar

## 5. Sale presentation
- Dedicated sale entry in the nav, usually in accent colour
- Strikethrough MRP + % off on cards and the PDP; discount facet (10%+, 20%+, …)
- Sale is a collection driven by `compareAtPrice > price`, not a separate catalogue

## 6. Cart and checkout
- Slide-out mini bag → full bag page → checkout
- Bag: qty stepper, move to wishlist, coupon, free-shipping progress, gift wrap
- Checkout: distraction-free; contact → address (pincode autofill) → delivery → payment (UPI, cards, netbanking, wallets, COD with a fee) → review → confirmation
- Order summary sticky on desktop, collapsible at the top on mobile

## 7. Gaps we will close
| Common gap in the segment | Our approach |
|---|---|
| Hover-only menus, no keyboard support | Full keyboard + ARIA disclosure pattern |
| Low-contrast greys on cream backgrounds | Tokens validated to WCAG AA 4.5:1 |
| Heavy hero carousels hurt LCP | First slide priority image, the rest lazy; autoplay with a pause control (WCAG 2.2.2) |
| Popup on landing | Delayed, once per session, never on PDP/checkout |
