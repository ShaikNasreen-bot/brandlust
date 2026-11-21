import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/supabase/products';
import { ProductCard } from '@/components/product/ProductCard';

export const revalidate = 60; // Refresh dynamic product cache periodically

export default async function HomePage() {
  const categories = await getCategories();
  const { products: allProducts } = await getProducts();

  const trendingProducts = allProducts.filter((p) => p.is_trending).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.is_new_arrival).slice(0, 4);
  const bestSellers = allProducts.filter((p) => p.is_best_seller).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] sm:h-[90vh] w-full bg-stone-900 overflow-hidden flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85"
            alt="Men's Fashion Luxury Atelier"
            fill
            priority
            className="object-cover object-center brightness-[0.65] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-stone-200 text-xs uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-sand-300" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white uppercase tracking-tight leading-[1.08]">
              Upgrade Your <br />
              <span className="font-serif italic font-normal text-sand-200 lowercase">Style.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-light max-w-lg leading-relaxed">
              Discover the latest trends in men's fashion. Engineered with architectural cuts, bespoke fabrics, and effortless versatility.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-white text-stone-950 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-200 transition shadow-2xl flex items-center justify-center gap-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?category=jackets"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/60 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition flex items-center justify-center"
              >
                Explore Outerwear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="py-20 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-2">Curated Silhouettes</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-black flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-[4/5] overflow-hidden bg-stone-900"
              >
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent group-hover:from-stone-950/90 transition" />
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-stone-300 line-clamp-1 hidden sm:block">
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-2">Most Coveted Right Now</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
                Trending Essentials
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-black flex items-center gap-1 group"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL EDITORIAL BANNER */}
      <section className="relative py-24 sm:py-32 bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2000&q=80"
            alt="Handcrafted Outerwear Promo"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-300">
            Exclusive Capsule Drop
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            The Selvedge & Leather Collection
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Constructed with heavy Japanese shuttle denim and hand-finished lambskin nappa. Designed for longevity and refined patina over decades.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/shop?category=jackets"
              className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-200 transition"
            >
              Shop Outerwear
            </Link>
            <Link
              href="/shop?category=jeans"
              className="px-8 py-3.5 bg-transparent border border-white text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition"
            >
              Shop Denim
            </Link>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-2">Fresh Off The Atelier</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?new=true"
              className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-black flex items-center gap-1 group"
            >
              <span>View All New</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-2">Proven Wardrobe Icons</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop?bestseller=true"
              className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-black flex items-center gap-1 group"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. ATELIER PHILOSOPHY BANNER */}
      <section className="py-16 bg-stone-100 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <Compass className="w-8 h-8 text-stone-600 mx-auto" />
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-stone-950">
            The BRAND LUST Standard
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Every garment in our catalog begins with raw fibers tested for endurance, drape, and tensile resilience. From 14oz Japanese selvedge denim to French flax linen, we partner directly with generational weavers to eliminate excess margins and deliver uncompromising luxury.
          </p>
        </div>
      </section>

    </div>
  );
}
