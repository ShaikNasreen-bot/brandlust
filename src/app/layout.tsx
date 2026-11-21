import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { CartProvider } from '@/lib/context/cart-context';
import { WishlistProvider } from '@/lib/context/wishlist-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'BRAND LUST | Premium Men\'s Fashion & Menswear',
  description: 'Discover contemporary menswear, luxury selvedge denim, tailored trousers, organic cotton essentials, and ceremonial silhouettes at Brand Lust.',
  keywords: 'menswear, men\'s fashion, luxury clothing, linen shirts, selvedge denim, tailored trousers, outerwear, brand lust',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <CartDrawer />
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
