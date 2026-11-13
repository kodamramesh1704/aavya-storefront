'use client';
import Link from 'next/link';
import { getImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import { cx } from '@/lib/format';

export type Slide = { desktop: string; mobile: string; alt: string; eyebrow: string; title: string; text: string; cta: string; href: string; tone?: 'light' | 'dark' };

/** Art-directed <picture> so mobile only downloads the portrait crop. */
function SlideImage({ s, priority }: { s: Slide; priority: boolean }) {
  const common = { alt: s.alt, sizes: '100vw', priority, loading: priority ? undefined : ('lazy' as const) };
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: s.desktop, width: 2400, height: 1100 });
  const { props: { srcSet: mobile, ...rest } } = getImageProps({ ...common, src: s.mobile, width: 900, height: 1400 });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source srcSet={mobile} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...rest} className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [playing, slides.length]);
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);

  return (
    <section aria-roledescription="carousel" aria-label="Featured collections" className="relative h-[78svh] max-h-[860px] min-h-[480px] overflow-hidden bg-line/40 md:h-[72vh]">
      {slides.map((s, idx) => (
        <div key={s.title} role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${slides.length}`} aria-hidden={idx !== i}
          className={cx('absolute inset-0 transition-opacity duration-700', idx === i ? 'opacity-100' : 'pointer-events-none opacity-0')}>
          <SlideImage s={s} priority={idx === 0} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent md:bg-gradient-to-r md:from-ink/50 md:via-ink/10" />
          <div className="container relative flex h-full items-end pb-20 md:items-center md:pb-0">
            <div className="max-w-xl text-white">
              <p className="mb-3 text-eyebrow uppercase">{s.eyebrow}</p>
              {idx === 0 ? <h1 className="text-display-xl">{s.title}</h1> : <h2 className="text-display-xl">{s.title}</h2>}
              <p className="mt-4 max-w-md text-base text-white/90 md:text-lg">{s.text}</p>
              <Link href={s.href} tabIndex={idx === i ? 0 : -1} className="btn mt-7 bg-white text-ink hover:bg-bg">{s.cta}</Link>
            </div>
          </div>
        </div>
      ))}
      <div className="container absolute inset-x-0 bottom-5 flex items-center justify-between text-white md:bottom-8">
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button key={s.title} type="button" onClick={() => setI(idx)} aria-label={`Show slide ${idx + 1}: ${s.title}`} aria-current={idx === i} className="grid h-8 w-8 place-items-center">
              <span className={cx('block h-0.5 transition-all', idx === i ? 'w-7 bg-white' : 'w-4 bg-white/60')} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="grid h-10 w-10 place-items-center rounded-full border border-white/50 hover:bg-white/15"><Icon name="chevronLeft" size={18} /></button>
          <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} className="grid h-10 w-10 place-items-center rounded-full border border-white/50 hover:bg-white/15"><Icon name={playing ? 'pause' : 'play'} size={16} /></button>
          <button type="button" onClick={() => go(1)} aria-label="Next slide" className="grid h-10 w-10 place-items-center rounded-full border border-white/50 hover:bg-white/15"><Icon name="chevronRight" size={18} /></button>
        </div>
      </div>
    </section>
  );
}
