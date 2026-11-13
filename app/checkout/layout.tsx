import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

/** Distraction-free checkout: logo + secure badge only, no nav or footer links. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="container grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          <Link href="/cart" className="flex items-center gap-1 text-sm"><Icon name="chevronLeft" size={18} /><span className="hidden sm:inline">Back to bag</span><span className="sr-only sm:hidden">Back to bag</span></Link>
          <Logo compact />
          <p className="flex items-center justify-end gap-1.5 text-xs uppercase tracking-wider text-muted"><Icon name="lock" size={16} /><span className="hidden sm:inline">Secure checkout</span></p>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="min-h-screen bg-bg focus:outline-none">{children}</main>
    </>
  );
}
