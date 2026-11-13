'use client';
import { Icon } from './Icon';

export function QtyStepper({ value, onChange, max = 10, label = 'Quantity', small }: { value: number; onChange: (n: number) => void; max?: number; label?: string; small?: boolean }) {
  const h = small ? 'h-9' : 'h-12';
  return (
    <div className={`inline-flex items-center border border-line ${h}`} role="group" aria-label={label}>
      <button type="button" className={`${small ? 'w-8' : 'w-11'} h-full grid place-items-center disabled:opacity-40`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity"><Icon name="minus" size={16} /></button>
      <output className={`${small ? 'w-7 text-sm' : 'w-10'} text-center`} aria-live="polite" aria-label={`${label}: ${value}`}>{value}</output>
      <button type="button" className={`${small ? 'w-8' : 'w-11'} h-full grid place-items-center disabled:opacity-40`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><Icon name="plus" size={16} /></button>
    </div>
  );
}
