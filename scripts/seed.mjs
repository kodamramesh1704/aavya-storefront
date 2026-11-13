// Generates data/products.json + neutral placeholder images in public/placeholder.
// Deterministic (seeded RNG) so every client starts with the same demo catalogue.
// Usage: npm run seed            (always regenerates)
//        node scripts/seed.mjs --if-missing   (used by predev/prebuild; skips if images exist)
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IMG_DIR = path.join(ROOT, 'public/placeholder');
const PRODUCT_IMG_DIR = path.join(IMG_DIR, 'products');

let s = 20261112;
const rand = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rand() * a.length)];
const pickN = (a, n) => [...a].sort(() => rand() - 0.5).slice(0, n);
const round = (n, to = 50) => Math.round(n / to) * to - 1; // ₹2,499-style

const COLORS = [
  { name: 'Ivory', hex: '#EFE6D4' }, { name: 'Rust', hex: '#B5532F' }, { name: 'Indigo', hex: '#2F3E6B' },
  { name: 'Sage', hex: '#8FA382' }, { name: 'Blush', hex: '#E3B5A8' }, { name: 'Mustard', hex: '#C9962E' },
  { name: 'Maroon', hex: '#6E1F2B' }, { name: 'Teal', hex: '#24636A' }, { name: 'Black', hex: '#222222' },
  { name: 'Lilac', hex: '#B7A4C9' }, { name: 'Emerald', hex: '#1F6B4C' }, { name: 'Coral', hex: '#E07B63' },
];
const FABRICS = ['Cotton', 'Chanderi', 'Linen', 'Silk', 'Georgette', 'Mul Cotton', 'Organza', 'Crepe'];
const OCCASIONS = ['Festive', 'Wedding Guest', 'Workwear', 'Everyday', 'Resort'];
const NAMES = ['Noor', 'Gulnar', 'Tara', 'Rewa', 'Kesari', 'Neel', 'Chandni', 'Basant', 'Mehr', 'Saba', 'Inaaya', 'Phool', 'Dhoop', 'Sitara', 'Ruhi', 'Aab', 'Zoya', 'Kiran', 'Meera', 'Pankh', 'Leher', 'Saanjh', 'Bela', 'Jharna'];
const TECHNIQUES = ['Block-Printed', 'Embroidered', 'Hand-Painted', 'Mirror-Work', 'Bandhani', 'Zari', 'Chikankari', 'Ikat'];
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const CATEGORIES = [
  { slug: 'kurtas', name: 'Kurtas', type: 'Kurta', price: [1999, 5999], sizes: APPAREL_SIZES, shape: 'kurta' },
  { slug: 'suit-sets', name: 'Suit Sets', type: 'Suit Set', price: [3999, 12999], sizes: APPAREL_SIZES, shape: 'kurta' },
  { slug: 'sarees', name: 'Sarees', type: 'Saree', price: [5999, 24999], sizes: ['Free Size'], shape: 'saree' },
  { slug: 'lehengas', name: 'Lehengas', type: 'Lehenga Set', price: [18999, 64999], sizes: APPAREL_SIZES, shape: 'lehenga' },
  { slug: 'dresses', name: 'Dresses', type: 'Dress', price: [2999, 8999], sizes: APPAREL_SIZES, shape: 'dress' },
  { slug: 'co-ords', name: 'Co-ord Sets', type: 'Co-ord Set', price: [3499, 9999], sizes: APPAREL_SIZES, shape: 'coord' },
  { slug: 'accessories', name: 'Accessories', type: 'Potli Bag', price: [1299, 4999], sizes: ['One Size'], shape: 'bag' },
  { slug: 'home-living', name: 'Home & Living', type: 'Cushion Cover', price: [999, 3999], sizes: ['One Size'], shape: 'cushion' },
];

// ---------- SVG placeholder art (abstract silhouettes, no text) ----------
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};
const SHAPES = {
  kurta: 'M330 230 L390 200 L510 200 L570 230 L640 420 L590 440 L560 360 L580 1000 L320 1000 L340 360 L310 440 L260 420 Z',
  dress: 'M360 210 L400 195 L500 195 L540 210 L560 420 L660 1000 L240 1000 L340 420 Z',
  saree: 'M380 200 L520 200 L560 380 L600 1000 L300 1000 L330 600 L250 300 L330 250 Z',
  lehenga: 'M370 210 L530 210 L545 420 L700 1010 L200 1010 L355 420 Z',
  coord: 'M340 220 L560 220 L600 520 L300 520 Z M340 540 L560 540 L580 1000 L470 1000 L450 640 L430 1000 L320 1000 Z',
  bag: 'M300 520 Q450 440 600 520 L640 860 Q450 940 260 860 Z M380 520 Q450 360 520 520',
  cushion: 'M230 380 Q450 330 670 380 Q720 600 670 820 Q450 870 230 820 Q180 600 230 380 Z',
};
function productSvg(shape, hex, variant) {
  const bg = shade(hex, 0.38);
  const fg = hex;
  const motif = shade(hex, -0.12);
  // variant 0: full front, 1: back (mirrored), 2: detail crop, 3: lifestyle (offset), 4+: texture
  const transforms = ['', 'translate(900,0) scale(-1,1)', 'translate(-450,-300) scale(2)', 'translate(120,40) scale(0.85)', 'translate(-900,-900) scale(3)', 'translate(-200,-100) scale(1.4)'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
  <defs><pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse">
    <circle cx="30" cy="30" r="6" fill="${motif}" opacity="0.55"/><circle cx="0" cy="0" r="3" fill="${motif}" opacity="0.4"/><circle cx="60" cy="60" r="3" fill="${motif}" opacity="0.4"/></pattern>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${shade(hex, 0.3)}"/></linearGradient></defs>
  <rect width="900" height="1200" fill="url(#g)"/>
  <ellipse cx="450" cy="1080" rx="300" ry="30" fill="#000" opacity="0.06"/>
  <g transform="${transforms[variant % transforms.length]}">
    <path d="${SHAPES[shape]}" fill="${fg}" stroke="${shade(hex, -0.2)}" stroke-width="4"/>
    <path d="${SHAPES[shape]}" fill="url(#p)"/>
  </g></svg>`;
}
function sceneSvg(w, h, hex, seedOffset = 0) {
  // Abstract editorial scene: arches + silhouettes
  const a = shade(hex, 0.25), b = shade(hex, -0.1), c = shade(hex, 0.45);
  const cx = w * (0.55 + 0.1 * Math.sin(seedOffset));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${c}"/>
  <path d="M${w * 0.08} ${h} V${h * 0.35} a${w * 0.14} ${w * 0.14} 0 0 1 ${w * 0.28} 0 V${h}Z" fill="${a}"/>
  <path d="M${w * 0.62} ${h} V${h * 0.25} a${w * 0.16} ${w * 0.16} 0 0 1 ${w * 0.32} 0 V${h}Z" fill="${a}" opacity="0.7"/>
  <circle cx="${cx}" cy="${h * 0.22}" r="${Math.min(w, h) * 0.06}" fill="${b}" opacity="0.5"/>
  <path d="M${cx - w * 0.08} ${h} L${cx - w * 0.03} ${h * 0.4} L${cx + w * 0.03} ${h * 0.4} L${cx + w * 0.08} ${h}Z" fill="${b}"/>
  <rect y="${h * 0.92}" width="${w}" height="${h * 0.08}" fill="${shade(hex, 0.1)}"/></svg>`;
}
const write = (svg, file, q = 72) => sharp(Buffer.from(svg)).webp({ quality: q }).toFile(file);

// ---------- Catalogue ----------
async function main() {
  if (process.argv.includes('--if-missing')) {
    const existing = await fs.readdir(PRODUCT_IMG_DIR).catch(() => []);
    if (existing.length > 0) return console.log('Placeholder images present, skipping seed.');
  }
  await fs.mkdir(PRODUCT_IMG_DIR, { recursive: true });
  const products = [];
  let id = 1;
  const usedSlugs = new Set();
  const now = new Date('2026-11-01').getTime();

  for (const cat of CATEGORIES) {
    for (let i = 0; i < 6; i++) {
      const colors = pickN(COLORS, 1 + Math.floor(rand() * 3));
      const fabric = cat.slug === 'home-living' ? pick(['Cotton', 'Linen', 'Silk']) : pick(FABRICS);
      const technique = pick(TECHNIQUES);
      let base = `${pick(NAMES)} ${technique} ${fabric} ${cat.type}`;
      let slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      while (usedSlugs.has(slug)) slug += '-' + id;
      usedSlugs.add(slug);
      const [lo, hi] = cat.price;
      const mrp = round(lo + rand() * (hi - lo), 100);
      const onSale = rand() < 0.4;
      const pct = pick([10, 20, 25, 30, 40]);
      const price = onSale ? round(mrp * (1 - pct / 100)) : mrp;
      const stock = Object.fromEntries(cat.sizes.map((sz) => [sz, rand() < 0.15 ? 0 : rand() < 0.2 ? 1 + Math.floor(rand() * 2) : 3 + Math.floor(rand() * 12)]));
      const imgCount = 4 + Math.floor(rand() * 3);
      const images = [];
      for (let k = 0; k < imgCount; k++) {
        const file = `${slug}-${k + 1}.webp`;
        await write(productSvg(cat.shape, colors[0].hex, k), path.join(PRODUCT_IMG_DIR, file));
        const views = ['front view', 'back view', 'detail of the craftwork', 'styled look', 'fabric texture close-up', 'side view'];
        images.push({ src: `/placeholder/products/${file}`, alt: `${base}, ${colors[0].name.toLowerCase()}, ${views[k] ?? 'view'}` });
      }
      const subBrand = cat.price[1] > 20000 || rand() < 0.3 ? 'couture' : 'everyday';
      const occasion = pickN(OCCASIONS, 1 + Math.floor(rand() * 2));
      if (cat.slug === 'lehengas' && !occasion.includes('Wedding Guest')) occasion.push('Wedding Guest');
      products.push({
        id: String(id),
        slug,
        name: base,
        sku: `AV-${cat.slug.slice(0, 3).toUpperCase()}-${String(id).padStart(4, '0')}`,
        category: cat.slug,
        subBrand,
        collections: [
          ...(rand() < 0.35 ? ['festive'] : []),
          ...(rand() < 0.25 ? ['summer-linen'] : []),
        ],
        occasion,
        fabric,
        technique,
        price,
        compareAtPrice: onSale ? mrp : null,
        colors,
        sizes: cat.sizes,
        stock,
        images,
        description: `A ${technique.toLowerCase()} ${cat.type.toLowerCase()} in ${fabric.toLowerCase()}, finished by hand. Placeholder description: replace with client copy.`,
        details: [
          `${technique} detailing`,
          cat.sizes.length > 1 ? 'Relaxed fit; true to size' : 'Standard size',
          `${fabric} ${cat.slug === 'home-living' ? 'cover with concealed zip' : 'with soft lining where needed'}`,
          'Made in India',
        ],
        care: fabric === 'Silk' || fabric === 'Organza' ? ['Dry clean only', 'Store in a muslin bag', 'Steam iron on reverse'] : ['Hand wash cold, separately', 'Dry in shade', 'Warm iron on reverse'],
        tags: [
          ...(rand() < 0.3 ? ['new'] : []),
          ...(rand() < 0.25 ? ['bestseller'] : []),
        ],
        createdAt: new Date(now - Math.floor(rand() * 120) * 864e5).toISOString(),
        popularity: Math.floor(rand() * 1000),
      });
      id++;
    }
  }
  // guarantee enough new/bestsellers for the homepage rails
  products.slice(0, 48).forEach((p, i) => {
    if (i % 5 === 0 && !p.tags.includes('new')) p.tags.push('new');
    if (i % 6 === 1 && !p.tags.includes('bestseller')) p.tags.push('bestseller');
  });
  await fs.writeFile(path.join(ROOT, 'data/products.json'), JSON.stringify(products, null, 2));

  // ---------- Editorial / marketing placeholders ----------
  const scenes = [
    ['hero-1-desktop', 2400, 1100, '#B5532F'], ['hero-1-mobile', 900, 1400, '#B5532F'],
    ['hero-2-desktop', 2400, 1100, '#24636A'], ['hero-2-mobile', 900, 1400, '#24636A'],
    ['hero-3-desktop', 2400, 1100, '#6E1F2B'], ['hero-3-mobile', 900, 1400, '#6E1F2B'],
    ['subbrand-everyday', 1200, 1400, '#8FA382'], ['subbrand-couture', 1200, 1400, '#6E1F2B'],
    ['editorial', 1600, 1200, '#C9962E'], ['craft', 1400, 1200, '#2F3E6B'],
    ['about-hero', 2400, 900, '#B5532F'], ['founder', 900, 1100, '#E3B5A8'],
    ['menu-1', 600, 760, '#B5532F'], ['menu-2', 600, 760, '#24636A'],
    ['collection-banner', 2400, 700, '#C9962E'], ['newsletter', 800, 1000, '#E3B5A8'],
    ['size-guide', 600, 800, '#EFE6D4'],
  ];
  for (const [name, w, h, hex] of scenes) await write(sceneSvg(w, h, hex, name.length), path.join(IMG_DIR, `${name}.webp`), 70);
  const tones = ['#B5532F', '#24636A', '#C9962E', '#6E1F2B', '#8FA382', '#B7A4C9', '#2F3E6B', '#E07B63'];
  for (let i = 1; i <= 8; i++) await write(sceneSvg(700, 933, tones[i - 1], i), path.join(IMG_DIR, `tile-${i}.webp`));
  for (let i = 1; i <= 6; i++) await write(sceneSvg(800, 800, tones[i], i * 2), path.join(IMG_DIR, `insta-${i}.webp`));
  for (let i = 1; i <= 6; i++) await write(sceneSvg(1200, 1500, tones[(i + 2) % 8], i * 3), path.join(IMG_DIR, `look-${i}.webp`));
  for (let i = 1; i <= 6; i++) await write(sceneSvg(900, 900, tones[(i + 4) % 8], i * 5), path.join(IMG_DIR, `craft-${i}.webp`));

  console.log(`Seeded ${products.length} products, ${products.filter((p) => p.compareAtPrice).length} on sale.`);
}
main();
