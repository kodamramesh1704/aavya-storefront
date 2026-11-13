'use client';
import { useHydrated, useUI, useWishlist } from '@/store';
import { Icon } from './Icon';
import { cx } from '@/lib/format';

export function WishlistButton({ id, name, className, withLabel }: { id: string; name: string; className?: string; withLabel?: boolean }) {
  const h = useHydrated();
  const on = useWishlist((s) => s.ids.includes(id)) && h;
  const toggle = useWishlist((s) => s.toggle);
  const toast = useUI((s) => s.showToast);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={withLabel ? undefined : `${on ? 'Remove' : 'Add'} ${name} ${on ? 'from' : 'to'} wishlist`}
      onClick={(e) => { e.preventDefault(); toggle(id); toast(on ? 'Removed from wishlist' : 'Saved to wishlist'); }}
      className={cx('grid place-items-center', className)}
    >
      <Icon name="heart" fill={on ? 'currentColor' : 'none'} className={on ? 'text-sale' : ''} />
      {withLabel && <span className="ml-2">{on ? 'Wishlisted' : 'Wishlist'}</span>}
    </button>
  );
}
