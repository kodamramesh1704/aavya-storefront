import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewsletterPopup } from '@/components/home/NewsletterPopup';
import { CartDrawer, MobileMenu, SearchOverlay, WhatsAppButton } from '@/components/layout/Overlays';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[60vh] focus:outline-none">{children}</main>
      <Footer />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <WhatsAppButton />
      <NewsletterPopup />
    </>
  );
}
