/**
 * Self-hosted brand fonts via next/font/local: preloaded, with metric-matched
 * fallbacks (prevents layout shift). To change fonts for a client: install the
 * matching @fontsource package, point `src` at its woff2 files, and update
 * brand.config.ts `fonts` (used for documentation/OG only).
 */
import localFont from 'next/font/local';

export const displayFont = localFont({
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  src: [
    { path: '../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2', weight: '500' },
    { path: '../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2', weight: '600' },
  ],
});

export const bodyFont = localFont({
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
  src: [
    { path: '../node_modules/@fontsource/jost/files/jost-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/jost/files/jost-latin-500-normal.woff2', weight: '500' },
  ],
});
