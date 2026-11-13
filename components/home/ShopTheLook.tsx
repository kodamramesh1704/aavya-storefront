'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { useMoney } from '../ui/Price';
import { SocialIcon } from '../ui/Icon';

export function ShopTheLook({ tiles, handle, href }: { tiles: { image: string; products: Product[] }[]; handle: string; href: string }) {
  const money = useMoney();
  return (
    <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
      {tiles.map((t, i) => (
        <li key={i} className="group relative aspect-square overflow-hidden bg-line/40">
          <Image src={t.image} alt={`Styled look ${i + 1} featuring ${t.products.map((p) => p.name).join(' and ')}`} fill sizes="(min-width:1024px) 16vw, (min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 flex flex-col justify-end gap-1 bg-ink/0 p-2 opacity-0 transition group-hover:bg-ink/60 group-hover:opacity-100 group-focus-within:bg-ink/60 group-focus-within:opacity-100">
            <p className="mb-1 flex items-center gap-1 text-xs text-white"><SocialIcon name="instagram" size={14} /> Shop this look</p>
            {t.products.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="flex items-center gap-2 bg-white/95 p-1.5 text-[11px] leading-tight text-ink hover:bg-white">
                <span className="relative h-10 w-8 shrink-0"><Image src={p.images[0].src} alt="" fill sizes="32px" className="object-cover" /></span>
                <span className="line-clamp-2">{p.name}<span className="block font-medium">{money(p.price)}</span></span>
              </Link>
            ))}
          </div>
        </li>
      ))}
      <li className="sr-only"><a href={href}>Follow {handle} on Instagram</a></li>
    </ul>
  );
}
