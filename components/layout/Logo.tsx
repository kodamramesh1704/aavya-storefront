import Link from 'next/link';
import Image from 'next/image';
import { brand } from '@/brand.config';

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex flex-col items-center leading-none">
      {brand.logo.image ? (
        <Image src={brand.logo.image} alt={`${brand.name} home`} width={160} height={48} priority />
      ) : (
        <>
          <span className={`font-display tracking-[0.3em] transition-all ${compact ? 'text-2xl' : 'text-2xl md:text-[2rem]'}`}>{brand.logo.text}</span>
          {!compact && <span className="mt-1 text-[10px] tracking-[0.5em] text-muted">{brand.logo.sub}</span>}
          {compact && <span className="sr-only">{brand.logo.sub}</span>}
          <span className="sr-only"> home</span>
        </>
      )}
    </Link>
  );
}
