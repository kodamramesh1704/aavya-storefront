import type { Metadata, Viewport } from 'next';
import './globals.css';
import { brand } from '@/brand.config';
import { themeCss } from '@/lib/theme';
import { Toast } from '@/components/layout/Overlays';
import { bodyFont, displayFont } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: brand.seo.defaultTitle, template: brand.seo.titleTemplate },
  description: brand.description,
  openGraph: { siteName: brand.name, type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: brand.colors.bg, width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-2 top-2 z-[200] bg-ink px-4 py-2 text-bg">Skip to content</a>
        {children}
        <Toast />
      </body>
    </html>
  );
}
