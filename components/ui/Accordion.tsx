'use client';
import { useId, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { cx } from '@/lib/format';

export function Accordion({ title, children, defaultOpen = false, className, headingLevel = 3 }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; className?: string; headingLevel?: 2 | 3 | 4 }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const H = `h${headingLevel}` as 'h3';
  return (
    <div className={cx('border-b border-line', className)}>
      <H className="font-sans text-base">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-left font-medium">
          {title}
          <Icon name={open ? 'minus' : 'plus'} size={18} />
        </button>
      </H>
      <div id={id} hidden={!open} className="pb-5 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}
