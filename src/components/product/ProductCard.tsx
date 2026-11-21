'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/database';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCart } from '@/lib/context/cart-context';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.[1]?.image_url || primaryImage;

  // Distinct sizes available with stock
  const availableVariants = product.variants?.filter((v) => v.stock_quantity > 0) || [];
  const uniqueSizes = Array.from(new Set(availableVariants.map((v) => v.size)));
  const uniqueColors = Array.from(new Set(product.variants?.map((v) => v.color) || []));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) {
      if (uniqueSizes.length === 1) {
        // Auto pick if single size
        const variant = availableVariants.find((v) => v.size === uniqueSizes[0]);
        if (variant) {
          const res = addToCart(product, variant.id, 1);
          setFeedbackMessage(res.message);
          setTimeout(() => setFeedbackMessage(null), 2500);
          return;
        }
      }
      setShowSizePicker(true);
      return;
    }

    const variant = availableVariants.find((v) => v.size === selectedSize);
    if (variant) {
      const res = addToCart(product, variant.id, 1);
      setFeedbackMessage(res.message);
      setTimeout(() => setFeedbackMessage(null), 2500);
      setShowSizePicker(false);
    }
  };

  const handleSelectSizeAndAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    const variant = availableVariants.find((v) => v.size === size);
    if (variant) {
      const res = addToCart(product, variant.id, 1);
      setFeedbackMessage(res.message);
      setTimeout(() => setFeedbackMessage(null), 2500);
      setShowSizePicker(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-stone-200/70 hover:border-stone-900 transition-all duration-300">
      
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link href={`/products/${product.slug || product.id}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discount_percent > 0 && (
            <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {product.discount_percent}% OFF
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-sand-400 text-stone-950 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              New
            </span>
          )}
          {product.is_best_seller && (
            <span className="bg-stone-800 text-stone-200 text-[10px] font-medium px-2 py-0.5 uppercase tracking-wider">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-black shadow-sm transition"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-stone-900 text-stone-900' : ''}`} />
        </button>

        {/* Quick Add Overlay / Size Picker */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {showSizePicker ? (
            <div className="bg-white p-2.5 shadow-lg border border-stone-200 animate-fadeIn">
              <p className="text-[11px] font-semibold text-stone-900 uppercase tracking-wider mb-2 text-center">
                Select Size to Add:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {uniqueSizes.length > 0 ? (
                  uniqueSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => handleSelectSizeAndAdd(sz, e)}
                      className="px-2 py-1 text-xs border border-stone-300 hover:border-black hover:bg-black hover:text-white font-medium transition"
                    >
                      {sz}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 px-3 bg-white text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-900 hover:text-white transition flex items-center justify-center gap-2 shadow"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{selectedSize ? `Add Size ${selectedSize}` : 'Quick Add'}</span>
            </button>
          )}
        </div>

        {/* Notification toast if added */}
        {feedbackMessage && (
          <div className="absolute top-12 inset-x-2 z-20 bg-stone-900 text-white text-[11px] px-3 py-1.5 text-center flex items-center justify-center gap-1 shadow-lg animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span className="truncate">{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-widest mb-1">
            <span>{product.brand?.name || 'BRAND LUST'}</span>
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-stone-800 font-medium lowercase">
                <Star className="w-3 h-3 fill-stone-900 text-stone-900" />
                <span>{product.rating.toFixed(1)} ({product.rating_count})</span>
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="text-xs sm:text-sm font-medium text-stone-900 line-clamp-1 hover:underline">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Sizes and Price Row */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-end justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-stone-950">
              ₹{product.selling_price.toLocaleString('en-IN')}
            </span>
            {product.original_price > product.selling_price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Sizes indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-stone-400 uppercase">
            {uniqueSizes.slice(0, 3).map((s) => (
              <span key={s} className="px-1 border border-stone-200">
                {s}
              </span>
            ))}
            {uniqueSizes.length > 3 && <span>+{uniqueSizes.length - 3}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
