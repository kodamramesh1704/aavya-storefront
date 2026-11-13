import Link from 'next/link';
import { brand } from '@/brand.config';

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const all = [{ label: 'Home', href: '/' }, ...items];
  const ld = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: brand.url + c.href } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb" className="py-4 text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href && i < all.length - 1 ? <Link href={c.href} className="hover:text-ink hover:underline">{c.label}</Link> : <span aria-current="page" className="text-ink">{c.label}</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}
