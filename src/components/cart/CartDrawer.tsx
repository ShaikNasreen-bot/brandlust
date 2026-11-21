'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';

export function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    deliveryCharges, 
    totalAmount 
  } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 1999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer content */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-sm font-bold tracking-widest uppercase text-stone-900">
                Shopping Bag ({items.reduce((acc, it) => acc + it.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-stone-700">
                Add <span className="font-bold text-stone-950">₹{amountNeeded.toLocaleString('en-IN')}</span> more to qualify for <span className="font-semibold text-stone-900">Complimentary Shipping</span>
              </p>
            ) : (
              <p className="font-semibold text-stone-950 flex items-center gap-1">
                <span>🎉 You have unlocked complimentary express shipping!</span>
              </p>
            )}
            <div className="w-full bg-stone-200 h-1.5 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-stone-900 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-stone-300 mb-3 stroke-[1.5]" />
                <p className="text-base font-medium text-stone-900">Your shopping bag is empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">Explore our curated collections of luxury menswear essentials.</p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const img = item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';
                return (
                  <div key={item.variant_id} className="py-4 flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 bg-stone-100 flex-shrink-0 overflow-hidden">
                      <Image
                        src={img}
                        alt={item.product?.name || 'Product'}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                            {item.product?.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.variant_id)}
                            className="text-stone-400 hover:text-red-600 transition p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Size: <span className="text-stone-800 font-medium">{item.variant?.size}</span> | Color: <span className="text-stone-800 font-medium">{item.variant?.color}</span>
                        </p>
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200">
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-stone-950">
                          ₹{((item.product?.selling_price || 0) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600">
                <span>Estimated Shipping</span>
                <span className="font-medium text-stone-900">
                  {deliveryCharges === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryCharges}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-3 text-center border border-stone-300 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-3 text-center bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
