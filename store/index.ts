'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { brand, type CurrencyCode } from '@/brand.config';
import type { Address, CartLine, Order } from '@/types';

/** Avoid SSR/localStorage mismatches: render persisted values only after mount. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

// ---------------- Cart ----------------
type CartState = {
  lines: CartLine[];
  coupon: string | null;
  giftWrap: boolean;
  giftMessage: string;
  add: (l: Omit<CartLine, 'key' | 'qty'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  setGift: (on: boolean, msg?: string) => void;
};
export const GIFT_WRAP_FEE = 99;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      coupon: null,
      giftWrap: false,
      giftMessage: '',
      add: (l, qty = 1) => {
        const key = `${l.productId}|${l.size}|${l.color}`;
        const lines = get().lines;
        const existing = lines.find((x) => x.key === key);
        if (existing) set({ lines: lines.map((x) => (x.key === key ? { ...x, qty: Math.min(x.qty + qty, x.maxQty) } : x)) });
        else set({ lines: [...lines, { ...l, key, qty: Math.min(qty, l.maxQty) }] });
      },
      setQty: (key, qty) => set({ lines: get().lines.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(qty, x.maxQty)) } : x)) }),
      remove: (key) => set({ lines: get().lines.filter((x) => x.key !== key) }),
      clear: () => set({ lines: [], coupon: null, giftWrap: false, giftMessage: '' }),
      applyCoupon: (raw) => {
        const code = raw.trim().toUpperCase();
        const c = brand.coupons[code];
        if (!c) return { ok: false, message: 'This code isn’t valid. Check the spelling and try again.' };
        const sub = cartSubtotal(get().lines);
        if (c.min && sub < c.min) return { ok: false, message: `Add items worth ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(c.min - sub)} more to use ${code}.` };
        set({ coupon: code });
        return { ok: true, message: `${code} applied: ${c.label}.` };
      },
      removeCoupon: () => set({ coupon: null }),
      setGift: (on, msg) => set({ giftWrap: on, giftMessage: msg ?? get().giftMessage }),
    }),
    { name: 'av-cart' }
  )
);

export const cartSubtotal = (lines: CartLine[]) => lines.reduce((s, l) => s + l.price * l.qty, 0);
export const cartMrp = (lines: CartLine[]) => lines.reduce((s, l) => s + (l.compareAtPrice ?? l.price) * l.qty, 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((s, l) => s + l.qty, 0);

export function computeTotals(lines: CartLine[], coupon: string | null, giftWrap: boolean, shippingFee?: number, paymentFee = 0) {
  const subtotal = cartSubtotal(lines);
  const c = coupon ? brand.coupons[coupon] : null;
  const couponValid = c && (!c.min || subtotal >= c.min);
  const discount = couponValid ? (c!.type === 'percent' ? Math.round((subtotal * c!.value) / 100) : c!.value) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = shippingFee ?? (afterDiscount >= brand.shipping.freeThreshold || lines.length === 0 ? 0 : brand.shipping.standardFee);
  const gift = giftWrap ? GIFT_WRAP_FEE : 0;
  const total = afterDiscount + shipping + gift + paymentFee;
  // Prices are GST-inclusive; show the embedded GST for transparency (assumes 12% apparel slab for display only).
  const gst = Math.round(total - total / 1.12);
  return { subtotal, mrp: cartMrp(lines), discount, couponApplied: couponValid ? coupon : null, shipping, gift, paymentFee, total, gst };
}

// ---------------- Wishlist ----------------
type WishState = { ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean; remove: (id: string) => void };
export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set({ ids: get().ids.includes(id) ? get().ids.filter((x) => x !== id) : [id, ...get().ids] }),
      has: (id) => get().ids.includes(id),
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
    }),
    { name: 'av-wishlist' }
  )
);

// ---------------- Currency ----------------
export const useCurrency = create<{ currency: CurrencyCode; setCurrency: (c: CurrencyCode) => void }>()(
  persist((set) => ({ currency: 'INR', setCurrency: (currency) => set({ currency }) }), { name: 'av-currency' })
);

// ---------------- Recently viewed ----------------
export const useRecent = create<{ ids: string[]; push: (id: string) => void }>()(
  persist((set, get) => ({ ids: [], push: (id) => set({ ids: [id, ...get().ids.filter((x) => x !== id)].slice(0, 12) }) }), { name: 'av-recent' })
);

// ---------------- Account + orders (mock auth) ----------------
type AccountState = {
  user: { name: string; email: string; phone: string } | null;
  addresses: Address[];
  orders: Order[];
  login: (u: { name: string; email: string; phone: string }) => void;
  logout: () => void;
  saveAddress: (a: Address) => void;
  deleteAddress: (id: string) => void;
  addOrder: (o: Order) => void;
};
export const useAccount = create<AccountState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      orders: [],
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      saveAddress: (a) => set({ addresses: [a, ...get().addresses.filter((x) => x.id !== a.id)] }),
      deleteAddress: (id) => set({ addresses: get().addresses.filter((x) => x.id !== id) }),
      addOrder: (o) => set({ orders: [o, ...get().orders] }),
    }),
    { name: 'av-account' }
  )
);

// ---------------- UI (not persisted) ----------------
type UIState = {
  cartOpen: boolean; searchOpen: boolean; menuOpen: boolean; toast: string | null;
  set: (p: Partial<Omit<UIState, 'set' | 'showToast'>>) => void;
  showToast: (m: string) => void;
};
export const useUI = create<UIState>()((set) => ({
  cartOpen: false, searchOpen: false, menuOpen: false, toast: null,
  set: (p) => set(p),
  showToast: (m) => {
    set({ toast: m });
    setTimeout(() => set({ toast: null }), 3000);
  },
}));
