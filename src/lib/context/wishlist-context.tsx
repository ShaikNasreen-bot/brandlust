'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types/database';
import { useAuth } from './auth-context';
import { useCart } from './cart-context';
import { fetchUserWishlist, toggleWishlistItemInSupabase } from '@/lib/supabase/wishlist';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: Product, variantId?: string) => { success: boolean; message: string };
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      if (user?.id) {
        const supabaseWl = await fetchUserWishlist(user.id);
        if (supabaseWl && supabaseWl.length > 0) {
          const prods = supabaseWl.map((w) => w.product).filter(Boolean);
          setWishlist(prods);
          setIsInitialized(true);
          return;
        }
      }

      try {
        const local = localStorage.getItem('BRAND LUST_wishlist');
        if (local) {
          setWishlist(JSON.parse(local));
        }
      } catch (err) {
        console.warn('Error reading local wishlist:', err);
      }
      setIsInitialized(true);
    }

    loadWishlist();
  }, [user]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('BRAND LUST_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    const exists = isInWishlist(product.id);
    let updated: Product[];

    if (exists) {
      updated = wishlist.filter((p) => p.id !== product.id);
      if (user?.id) {
        toggleWishlistItemInSupabase(user.id, product.id, false);
      }
    } else {
      updated = [...wishlist, product];
      if (user?.id) {
        toggleWishlistItemInSupabase(user.id, product.id, true);
      }
    }

    setWishlist(updated);
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter((p) => p.id !== productId);
    setWishlist(updated);
    if (user?.id) {
      toggleWishlistItemInSupabase(user.id, productId, false);
    }
  };

  const moveToCart = (product: Product, variantId?: string): { success: boolean; message: string } => {
    // Pick first available variant if not explicitly provided
    const selectedVariantId = variantId || product.variants.find((v) => v.stock_quantity > 0)?.id;
    if (!selectedVariantId) {
      return { success: false, message: 'No available sizes in stock for this product.' };
    }

    const result = addToCart(product, selectedVariantId, 1);
    if (result.success) {
      removeFromWishlist(product.id);
    }
    return result;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
