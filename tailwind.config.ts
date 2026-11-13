import type { Config } from 'tailwindcss';

// Every colour/font maps to a CSS variable set from brand.config.ts (see app/layout.tsx).
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2.5rem' } },
    extend: {
      colors: {
        primary: v('primary'),
        'primary-fg': v('primary-fg'),
        accent: v('accent'),
        bg: v('bg'),
        surface: v('surface'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        sale: v('sale'),
        success: v('success'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
      },
      fontSize: {
        // Type scale: display sizes are fluid
        'display-xl': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(1.875rem, 3.5vw, 2.75rem)', { lineHeight: '1.1' }],
        'display-md': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.15' }],
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.16em' }],
      },
      aspectRatio: { portrait: '3 / 4' },
      transitionTimingFunction: { soft: 'cubic-bezier(.2,.7,.2,1)' },
    },
  },
  plugins: [],
} satisfies Config;
