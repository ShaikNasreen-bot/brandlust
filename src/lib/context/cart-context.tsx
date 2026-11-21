'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, ProductVariant, CartItem } from '@/types/database';
import { useAuth } from './auth-context';
import { fetchUserCart, syncCartItemToSupabase, clearUserCartInSupabase } from '@/lib/supabase/cart';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => { success: boolean; message: string };
  clearCart: () => void;
  subtotal: number;
  deliveryCharges: number;
  discountAmount: number;
  totalAmount: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const FREE_DELIVERY_THRESHOLD = 1999;
const STANDARD_DELIVERY_FEE = 149;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart on startup / user change
  useEffect(() => {
    async function loadCart() {
      if (user?.id) {
        const supabaseItems = await fetchUserCart(user.id);
        if (supabaseItems && supabaseItems.length > 0) {
          setItems(supabaseItems);
          setIsInitialized(true);
          return;
        }
      }

      // Guest / local fallback
      try {
        const local = localStorage.getItem('BRAND LUST_cart');
        if (local) {
          setItems(JSON.parse(local));
        }
      } catch (err) {
        console.warn('Error reading local cart:', err);
      }
      setIsInitialized(true);
    }

    loadCart();
  }, [user]);

  // Persist local cart
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('BRAND LUST_cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, variantId: string, quantity = 1): { success: boolean; message: string } => {
    if (!variantId) {
      return { success: false, message: 'Please select a size before adding to cart.' };
    }

    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
      return { success: false, message: 'Selected variant is not available.' };
    }

    if (variant.stock_quantity <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    const existingIndex = items.findIndex((it) => it.variant_id === variantId);
    let newItems = [...items];

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > variant.stock_quantity) {
        return {
          success: false,
          message: `Only ${variant.stock_quantity} units available in stock.`,
        };
      }

      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newQty,
      };

      if (user?.id) {
        syncCartItemToSupabase(user.id, product.id, variantId, newQty);
      }
    } else {
      if (quantity > variant.stock_quantity) {
        return {
          success: false,
          message: `Only ${variant.stock_quantity} units available in stock.`,
        };
      }

      const newItem: CartItem = {
        id: `ci-${Date.now()}`,
        product_id: product.id,
        variant_id: variantId,
        quantity,
        product,
        variant,
      };

      newItems.push(newItem);

      if (user?.id) {
        syncCartItemToSupabase(user.id, product.id, variantId, quantity);
      }
    }

    setItems(newItems);
    setIsCartOpen(true);
    return { success: true, message: `Added "${product.name}" to cart.` };
  };

  const removeFromCart = (variantId: string) => {
    const itemToRemove = items.find((i) => i.variant_id === variantId);
    const newItems = items.filter((i) => i.variant_id !== variantId);
    setItems(newItems);

    if (user?.id && itemToRemove) {
      syncCartItemToSupabase(user.id, itemToRemove.product_id, variantId, 0);
    }
  };

  const updateQuantity = (variantId: string, quantity: number): { success: boolean; message: string } => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return { success: true, message: 'Item removed from cart.' };
    }

    const index = items.findIndex((i) => i.variant_id === variantId);
    if (index === -1) return { success: false, message: 'Item not found' };

    const item = items[index];
    if (quantity > item.variant.stock_quantity) {
      return {
        success: false,
        message: `Maximum available stock is ${item.variant.stock_quantity}.`,
      };
    }

    const newItems = [...items];
    newItems[index] = { ...item, quantity };
    setItems(newItems);

    if (user?.id) {
      syncCartItemToSupabase(user.id, item.product_id, variantId, quantity);
    }

    return { success: true, message: 'Quantity updated.' };
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('BRAND LUST_cart');
    if (user?.id) {
      clearUserCartInSupabase(user.id);
    }
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.selling_price || 0) * item.quantity,
    0
  );

  const originalTotal = items.reduce(
    (sum, item) => sum + (item.product?.original_price || item.product?.selling_price || 0) * item.quantity,
    0
  );

  const discountAmount = Math.max(0, originalTotal - subtotal);
  const deliveryCharges = subtotal >= FREE_DELIVERY_THRESHOLD || items.length === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const totalAmount = subtotal + deliveryCharges;
  const totalCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryCharges,
        discountAmount,
        totalAmount,
        totalCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
