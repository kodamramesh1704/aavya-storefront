'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { ProductImage } from '@/types';
import { Dialog } from '../ui/Dialog';
import { Icon } from '../ui/Icon';
import { cx } from '@/lib/format';

export function Gallery({ images, name, video }: { images: ProductImage[]; name: string; video?: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const track = useRef<HTMLUListElement>(null);

  const onScroll = () => {
    const el = track.current;
    const w = (el?.firstElementChild as HTMLElement | null)?.offsetWidth;
    if (el && w) setActive(Math.round(el.scrollLeft / w));
  };
  const goTo = (i: number) => {
    setActive(i);
    const w = (track.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
    track.current?.scrollTo({ left: i * w, behavior: 'smooth' });
  };
  const open = (i: number) => { setActive(i); setZoom(false); setLightbox(true); };

  return (
    <div className="lg:grid lg:grid-cols-[80px_1fr] lg:gap-4">
      {/* Desktop thumbnails */}
      <ul className="hidden max-h-[calc(100vh-12rem)] flex-col gap-3 overflow-y-auto lg:flex" aria-label="Product images">
        {images.map((img, i) => (
          <li key={img.src}>
            <button type="button" onClick={() => goTo(i)} aria-label={`View image ${i + 1} of ${images.length}`} aria-current={active === i}
              className={cx('relative block aspect-portrait w-full overflow-hidden ring-offset-2', active === i ? 'ring-1 ring-ink' : 'opacity-70 hover:opacity-100')}>
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          </li>
        ))}
        {video && <li><span className="grid aspect-portrait place-items-center bg-line text-xs">Video</span></li>}
      </ul>

      {/* Main: swipe track on mobile, single image on desktop */}
      <div className="relative">
        <ul ref={track} onScroll={onScroll} className="flex gap-1 snap-x snap-mandatory overflow-x-auto lg:gap-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-hidden" aria-roledescription="carousel" aria-label={`${name} images`}>
          {images.map((img, i) => (
            <li key={img.src} className="relative aspect-portrait w-[86%] shrink-0 snap-start bg-line/40 sm:w-[60%] lg:w-full" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
              <button type="button" onClick={() => open(i)} className="absolute inset-0 cursor-zoom-in" aria-label={`Open full-screen view of image ${i + 1}`}>
                <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="(min-width:1024px) 50vw, (min-width:640px) 60vw, 86vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <span className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1 rounded-full bg-surface/90 px-3 py-1.5 text-xs lg:flex"><Icon name="zoom" size={16} /> Click to zoom</span>
        {/* Mobile dots */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1 lg:hidden">
          {images.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)} aria-label={`Go to image ${i + 1}`} aria-current={active === i} className="grid h-6 w-6 place-items-center">
              <span className={cx('block h-1.5 rounded-full transition-all', active === i ? 'w-5 bg-ink' : 'w-1.5 bg-ink/40')} />
            </button>
          ))}
        </div>
      </div>

      <Dialog open={lightbox} onClose={() => setLightbox(false)} title={`${name}: image ${active + 1} of ${images.length}`} variant="full" className="bg-surface">
        <div className="relative h-full min-h-[70vh] overflow-hidden">
          <button type="button" aria-label={zoom ? 'Zoom out' : 'Zoom in'} onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
              setZoom(!zoom);
            }}
            onMouseMove={(e) => { if (!zoom) return; const r = e.currentTarget.getBoundingClientRect(); setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}
            className={cx('absolute inset-0', zoom ? 'cursor-zoom-out' : 'cursor-zoom-in')}>
            <Image src={images[active].src} alt={images[active].alt} fill sizes="100vw" className="object-contain transition-transform duration-300" style={{ transform: zoom ? 'scale(2.2)' : 'none', transformOrigin: origin }} />
          </button>
          <button type="button" onClick={() => { setZoom(false); setActive((active - 1 + images.length) % images.length); }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-surface shadow" aria-label="Previous image"><Icon name="chevronLeft" /></button>
          <button type="button" onClick={() => { setZoom(false); setActive((active + 1) % images.length); }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-surface shadow" aria-label="Next image"><Icon name="chevronRight" /></button>
        </div>
      </Dialog>
    </div>
  );
}
