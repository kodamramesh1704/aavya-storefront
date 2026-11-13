import Link from 'next/link';
import ShopLayout from './(shop)/layout';

export default function NotFound() {
  return (
    <ShopLayout>
      <div className="container grid place-items-center gap-4 py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="text-display-lg">We couldn’t find that page</h1>
        <p className="max-w-md text-muted">It may have moved or sold out. Try searching, or start from one of these.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/collections/new-arrivals" className="btn-primary">New Arrivals</Link>
          <Link href="/" className="btn-outline">Home</Link>
        </div>
      </div>
    </ShopLayout>
  );
}
