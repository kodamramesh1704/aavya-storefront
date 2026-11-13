import { brand } from '@/brand.config';

const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${n >> 16} ${(n >> 8) & 255} ${n & 255}`;
};
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

/** brand.config colours → CSS custom properties consumed by Tailwind. Fonts: see app/fonts.ts. */
export function themeCss() {
  const vars = Object.entries(brand.colors).map(([k, v]) => `--c-${kebab(k)}:${rgb(v)};`).join('');
  return `:root{${vars}}`;
}
