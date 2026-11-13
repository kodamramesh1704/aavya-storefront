'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Filters, Product, SortKey } from '@/types';
import { applyFilters, discountPct, sort } from '@/lib/product-utils';
import { categoryName } from '@/lib/catalog';
import { ProductCard } from '../ui/ProductCard';
import { Dialog } from '../ui/Dialog';
import { Icon } from '../ui/Icon';
import { useMoney } from '../ui/Price';
import { cx } from '@/lib/format';

const PAGE = 12;
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'new', label: 'New' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'bestselling', label: 'Bestselling' },
];
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'One Size'];
const LIST_KEYS = ['category', 'size', 'color', 'fabric', 'occasion'] as const;
type ListKey = (typeof LIST_KEYS)[number];

function parse(sp: URLSearchParams): Filters {
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(',').filter(Boolean) : []);
  const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) : null);
  return { category: list('category'), size: list('size'), color: list('color'), fabric: list('fabric'), occasion: list('occasion'), discount: num('discount'), priceMin: num('min'), priceMax: num('max') };
}

export function CollectionView({ products, hideCategoryFacet }: { products: Product[]; hideCategoryFacet?: boolean }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const money = useMoney();
  const filters = useMemo(() => parse(new URLSearchParams(sp.toString())), [sp]);
  const sortKey = (sp.get('sort') as SortKey) || 'featured';
  const page = Math.max(1, Number(sp.get('page') || 1));
  const [cols, setCols] = useState<number>(4);
  const [mobileCols, setMobileCols] = useState<number>(2);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    try { const v = JSON.parse(localStorage.getItem('av-grid') || 'null'); if (v) { setCols(v.d); setMobileCols(v.m); } } catch {}
  }, []);
  const saveGrid = (d: number, m: number) => { setCols(d); setMobileCols(m); try { localStorage.setItem('av-grid', JSON.stringify({ d, m })); } catch {} };

  const update = (mut: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(sp.toString());
    mut(p);
    p.delete('page');
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const toggle = (key: ListKey, value: string) => update((p) => {
    const cur = filters[key];
    const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
    next.length ? p.set(key, next.join(',')) : p.delete(key);
  });
  const setParam = (k: string, v: string | null) => update((p) => (v === null ? p.delete(k) : p.set(k, v)));
  const clearAll = () => update((p) => { [...LIST_KEYS, 'discount', 'min', 'max'].forEach((k) => p.delete(k)); });

  // Facet options derived from the collection, so clients never configure them by hand.
  const facets = useMemo(() => {
    const count = (fn: (p: Product) => string[]) => {
      const m = new Map<string, number>();
      products.forEach((p) => new Set(fn(p)).forEach((v) => m.set(v, (m.get(v) ?? 0) + 1)));
      return m;
    };
    const colorHex = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => colorHex.set(c.name, c.hex)));
    const prices = products.map((p) => p.price);
    return {
      category: [...count((p) => [p.category])].sort(),
      size: [...count((p) => p.sizes.filter((s) => p.stock[s] > 0))].sort((a, b) => SIZE_ORDER.indexOf(a[0]) - SIZE_ORDER.indexOf(b[0])),
      color: [...count((p) => p.colors.map((c) => c.name))].sort(),
      colorHex,
      fabric: [...count((p) => [p.fabric])].sort(),
      occasion: [...count((p) => p.occasion)].sort(),
      priceMin: prices.length ? Math.floor(Math.min(...prices) / 500) * 500 : 0,
      priceMax: prices.length ? Math.ceil(Math.max(...prices) / 500) * 500 : 0,
      hasDiscount: products.some((p) => discountPct(p) > 0),
    };
  }, [products]);

  const filtered = useMemo(() => sort(applyFilters(products, filters), sortKey), [products, filters, sortKey]);
  const visible = filtered.slice(0, page * PAGE);

  const chips: { label: string; clear: () => void }[] = [
    ...LIST_KEYS.flatMap((k) => filters[k].map((v) => ({ label: k === 'category' ? categoryName(v) : v, clear: () => toggle(k, v) }))),
    ...(filters.discount ? [{ label: `${filters.discount}% off or more`, clear: () => setParam('discount', null) }] : []),
    ...(filters.priceMin !== null || filters.priceMax !== null ? [{ label: `${money(filters.priceMin ?? facets.priceMin)} – ${money(filters.priceMax ?? facets.priceMax)}`, clear: () => update((p) => { p.delete('min'); p.delete('max'); }) }] : []),
  ];
  const activeCount = chips.length;

  const check = (k: ListKey, value: string, label: string, n: number) => (
    <label key={value} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
      <input type="checkbox" checked={filters[k].includes(value)} onChange={() => toggle(k, value)} className="h-4 w-4 accent-[rgb(var(--c-primary))]" />
      <span className="flex-1">{label}</span><span className="text-xs text-muted">{n}</span>
    </label>
  );

  const FacetPanel = (
    <div>
      {!hideCategoryFacet && facets.category.length > 1 && (
        <FacetGroup title="Category">{facets.category.map(([v, n]) => check('category', v, categoryName(v), n))}</FacetGroup>
      )}
      <FacetGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.size.map(([v]) => {
            const on = filters.size.includes(v);
            return <button key={v} type="button" aria-pressed={on} onClick={() => toggle('size', v)} className={cx('h-10 min-w-11 border px-3 text-sm', on ? 'border-ink bg-ink text-bg' : 'border-line hover:border-ink')}>{v}</button>;
          })}
        </div>
      </FacetGroup>
      <FacetGroup title="Colour">
        <div className="grid grid-cols-2 gap-x-2">
          {facets.color.map(([v, n]) => {
            const on = filters.color.includes(v);
            return (
              <label key={v} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
                <input type="checkbox" checked={on} onChange={() => toggle('color', v)} className="peer sr-only" />
                <span className="h-6 w-6 shrink-0 rounded-full ring-1 ring-ink/20 ring-offset-2 peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary" style={{ background: facets.colorHex.get(v) }} aria-hidden="true" />
                <span>{v} <span className="text-xs text-muted">({n})</span></span>
              </label>
            );
          })}
        </div>
      </FacetGroup>
      <FacetGroup title="Price">
        <PriceRange min={facets.priceMin} max={facets.priceMax} valueMin={filters.priceMin ?? facets.priceMin} valueMax={filters.priceMax ?? facets.priceMax}
          onCommit={(a, b) => update((p) => { a > facets.priceMin ? p.set('min', String(a)) : p.delete('min'); b < facets.priceMax ? p.set('max', String(b)) : p.delete('max'); })} />
      </FacetGroup>
      <FacetGroup title="Fabric" open={false}>{facets.fabric.map(([v, n]) => check('fabric', v, v, n))}</FacetGroup>
      <FacetGroup title="Occasion" open={false}>{facets.occasion.map(([v, n]) => check('occasion', v, v, n))}</FacetGroup>
      {facets.hasDiscount && (
        <FacetGroup title="Discount" open={false}>
          {[10, 20, 30, 40].map((d) => (
            <label key={d} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
              <input type="radio" name="discount" checked={filters.discount === d} onChange={() => setParam('discount', String(d))} className="h-4 w-4 accent-[rgb(var(--c-primary))]" />
              {d}% off or more
            </label>
          ))}
          {filters.discount && <button type="button" onClick={() => setParam('discount', null)} className="mt-2 text-xs underline">Clear discount</button>}
        </FacetGroup>
      )}
    </div>
  );

  const gridCls = cx('grid gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-10', mobileCols === 1 ? 'grid-cols-1' : 'grid-cols-2', cols === 2 ? 'lg:grid-cols-2' : cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4', 'md:grid-cols-3');

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
          <p className="pb-2 text-sm font-medium uppercase tracking-wider">Filter</p>
          {FacetPanel}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="sticky top-14 z-20 -mx-4 mb-4 flex items-center justify-between gap-3 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:pb-4">
          <button type="button" onClick={() => setSheet(true)} className="flex h-10 items-center gap-2 border border-line px-3 text-sm lg:hidden">
            <Icon name="filter" size={18} /> Filter{activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-fg">{activeCount}</span>}
          </button>
          <p className="hidden text-sm text-muted md:block" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</p>
          <div className="flex items-center gap-3">
            <label className="relative flex items-center gap-2 text-sm">
              <span className="hidden sm:inline text-muted">Sort by</span>
              <span className="sr-only sm:hidden">Sort by</span>
              <select value={sortKey} onChange={(e) => setParam('sort', e.target.value === 'featured' ? null : e.target.value)} className="h-10 cursor-pointer appearance-none border border-line bg-surface pl-3 pr-8 text-sm">
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <Icon name="chevronDown" size={14} className="pointer-events-none absolute right-2.5" />
            </label>
            <div className="hidden items-center lg:flex" role="group" aria-label="Grid columns">
              {[2, 3, 4].map((n) => <button key={n} type="button" aria-pressed={cols === n} onClick={() => saveGrid(n, mobileCols)} className={cx('grid h-10 w-10 place-items-center', cols === n ? 'text-ink' : 'text-muted/60 hover:text-ink')} aria-label={`${n} columns`}><Icon name={`grid${n}`} size={20} /></button>)}
            </div>
            <div className="flex items-center lg:hidden" role="group" aria-label="Grid columns">
              {[1, 2].map((n) => <button key={n} type="button" aria-pressed={mobileCols === n} onClick={() => saveGrid(cols, n)} className={cx('grid h-10 w-9 place-items-center', mobileCols === n ? 'text-ink' : 'text-muted/60')} aria-label={`${n} column${n > 1 ? 's' : ''}`}><Icon name={`grid${n}`} size={20} /></button>)}
            </div>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button key={c.label} type="button" onClick={c.clear} className="flex items-center gap-1.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-2 text-sm hover:border-ink">
                {c.label}<Icon name="close" size={14} /><span className="sr-only">Remove filter</span>
              </button>
            ))}
            <button type="button" onClick={clearAll} className="ml-1 text-sm underline underline-offset-4">Clear all</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="grid place-items-center gap-3 py-20 text-center">
            <p className="font-display text-3xl">Nothing matches those filters</p>
            <p className="max-w-sm text-sm text-muted">Try removing a filter or two, or browse the full range.</p>
            <div className="mt-3 flex gap-3">
              <button type="button" onClick={clearAll} className="btn-primary">Clear all filters</button>
              <Link href="/collections/all" className="btn-outline">Shop all</Link>
            </div>
          </div>
        ) : (
          <>
            <h2 className="sr-only">Products</h2>
            <ul className={gridCls}>
              {visible.map((p, i) => <li key={p.id}><ProductCard product={p} priority={i < 4} sizes={`(min-width:1024px) ${Math.round(80 / cols)}vw, ${mobileCols === 1 ? 100 : 50}vw`} /></li>)}
            </ul>
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-muted" aria-live="polite">Showing {visible.length} of {filtered.length}</p>
              <div className="h-0.5 w-48 bg-line"><div className="h-full bg-ink" style={{ width: `${(visible.length / filtered.length) * 100}%` }} /></div>
              {visible.length < filtered.length && (
                <button type="button" onClick={() => { const p = new URLSearchParams(sp.toString()); p.set('page', String(page + 1)); router.replace(`${pathname}?${p}`, { scroll: false }); }} className="btn-outline min-w-52">Load more</button>
              )}
            </div>
          </>
        )}
      </div>

      <Dialog open={sheet} onClose={() => setSheet(false)} title="Filter" variant="bottom"
        footer={<div className="grid grid-cols-2 gap-3"><button type="button" onClick={clearAll} className="btn-outline">Clear all</button><button type="button" onClick={() => setSheet(false)} className="btn-primary">Show {filtered.length}</button></div>}>
        <div className="px-5">{FacetPanel}</div>
      </Dialog>
    </div>
  );
}

function FacetGroup({ title, children, open = true }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium uppercase tracking-wider [&::-webkit-details-marker]:hidden">
        {title}<Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
      </summary>
      <fieldset className="mt-4"><legend className="sr-only">{title}</legend>{children}</fieldset>
    </details>
  );
}

function PriceRange({ min, max, valueMin, valueMax, onCommit }: { min: number; max: number; valueMin: number; valueMax: number; onCommit: (a: number, b: number) => void }) {
  const [a, setA] = useState(valueMin);
  const [b, setB] = useState(valueMax);
  const money = useMoney();
  useEffect(() => { setA(valueMin); setB(valueMax); }, [valueMin, valueMax]);
  const step = 500;
  const pct = (v: number) => ((v - min) / (max - min || 1)) * 100;
  const commit = () => onCommit(a, b);
  const thumb = 'pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-surface [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-surface';
  return (
    <div>
      <div className="relative mx-2 h-6">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-line" />
        <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-ink" style={{ left: `${pct(a)}%`, right: `${100 - pct(b)}%` }} />
        <input type="range" min={min} max={max} step={step} value={a} aria-label="Minimum price" aria-valuetext={money(a)} onChange={(e) => setA(Math.min(Number(e.target.value), b - step))} onMouseUp={commit} onTouchEnd={commit} onKeyUp={commit} className={thumb} />
        <input type="range" min={min} max={max} step={step} value={b} aria-label="Maximum price" aria-valuetext={money(b)} onChange={(e) => setB(Math.max(Number(e.target.value), a + step))} onMouseUp={commit} onTouchEnd={commit} onKeyUp={commit} className={thumb} />
      </div>
      <div className="mt-3 flex justify-between text-sm"><span>{money(a)}</span><span>{money(b)}</span></div>
    </div>
  );
}
