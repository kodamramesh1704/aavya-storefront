'use client';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { cx } from '@/lib/format';

/**
 * Accessible modal primitive: role=dialog, aria-modal, focus trap, Esc to close,
 * scroll lock, focus restored to the trigger on close. Variants cover drawers,
 * bottom sheets, centred modals and fullscreen overlays.
 */
type Variant = 'right' | 'left' | 'bottom' | 'center' | 'full' | 'top';
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Dialog({
  open, onClose, title, hideTitle, variant = 'center', children, footer, className, initialFocusRef,
}: {
  open: boolean; onClose: () => void; title: string; hideTitle?: boolean; variant?: Variant; children: ReactNode; footer?: ReactNode; className?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    const t = setTimeout(() => {
      const el = initialFocusRef?.current ?? ref.current?.querySelector<HTMLElement>('[data-autofocus]') ?? ref.current?.querySelector<HTMLElement>(FOCUSABLE);
      el?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCloseRef.current(); }
      if (e.key === 'Tab' && ref.current) {
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      prev?.focus?.();
    };
  }, [open, initialFocusRef]);

  if (!open || typeof document === 'undefined') return null;

  const panel: Record<Variant, string> = {
    right: 'right-0 top-0 h-full w-full max-w-md animate-[slideInR_.3s_ease-out]',
    left: 'left-0 top-0 h-full w-[88%] max-w-sm animate-[slideInL_.3s_ease-out]',
    bottom: 'bottom-0 inset-x-0 max-h-[88vh] rounded-t-xl animate-[slideInB_.3s_ease-out]',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] animate-[fadeIn_.2s_ease-out]',
    full: 'inset-0 animate-[fadeIn_.2s_ease-out]',
    top: 'inset-x-0 top-0 max-h-[90vh] animate-[slideInT_.25s_ease-out]',
  };

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-ink/50 animate-[fadeIn_.2s_ease-out]" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={id} className={cx('absolute flex flex-col bg-surface shadow-2xl', panel[variant], className)}>
        <div className={cx('flex items-center justify-between gap-4 px-5 py-4 border-b border-line', hideTitle && 'sr-only')}>
          <h2 id={id} className="font-display text-2xl">{title}</h2>
          <button type="button" onClick={onClose} className="-mr-2 p-2" aria-label="Close"><Icon name="close" /></button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line p-5">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
