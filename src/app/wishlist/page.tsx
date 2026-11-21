'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useWishlist } from '@/lib/context/wishlist-context';
import { Product } from '@/types/database';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleMoveToCart = (product: Product) => {
    const res = moveToCart(product);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3000);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Save your favorite garments as you browse to keep track of seasonal capsule pieces and restocks.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      <div className="flex items-center justify-between border-b border-stone-200 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
            Saved Pieces
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your private atelier list
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs text-stone-600 hover:text-black font-semibold uppercase tracking-wider flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {feedback && (
        <div className="mb-6 p-3 bg-stone-900 text-white text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-green-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid of Wishlisted Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const img = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
          const availableStock = product.variants?.some((v) => v.stock_quantity > 0);

          return (
            <div key={product.id} className="group relative bg-white border border-stone-200 flex flex-col justify-between">
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
                  <Link href={`/products/${product.slug || product.id}`}>
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-500 hover:text-red-600 shadow-sm transition"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {product.discount_percent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-stone-950 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {product.discount_percent}% OFF
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                    {product.brand?.name || 'BRAND LUST'}
                  </p>
                  <Link href={`/products/${product.slug || product.id}`}>
                    <h3 className="text-xs sm:text-sm font-semibold text-stone-950 hover:underline line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-stone-950">
                      ₹{product.selling_price.toLocaleString('en-IN')}
                    </span>
                    {product.original_price > product.selling_price && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{product.original_price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Move to Cart button */}
              <div className="p-4 pt-0">
                <button
                  disabled={!availableStock}
                  onClick={() => handleMoveToCart(product)}
                  className={`w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    availableStock
                      ? 'bg-stone-950 text-white hover:bg-black shadow'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{availableStock ? 'Move to Cart' : 'Sold Out'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
