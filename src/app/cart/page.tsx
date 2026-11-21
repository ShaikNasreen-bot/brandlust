'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    deliveryCharges, 
    discountAmount, 
    totalAmount, 
    totalCount 
  } = useCart();

  const freeDeliveryThreshold = 1999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Explore our tailored jackets, fine linens, and selvedge denim to begin building your capsule wardrobe.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
            Shopping Bag
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {totalCount} {totalCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-red-600 font-medium underline"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Cart Items Table (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Free Shipping Banner */}
          <div className="bg-stone-100 border border-stone-200 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
              <Truck className="w-4 h-4 text-stone-950" />
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="text-stone-950">₹{amountNeeded.toLocaleString('en-IN')}</strong> more for <strong className="text-stone-950">Free Express Delivery</strong>.
                </span>
              ) : (
                <span className="font-semibold text-emerald-800">
                  🎉 You have unlocked complimentary express delivery!
                </span>
              )}
            </div>
            <div className="w-full bg-stone-300 h-1.5 mt-2.5 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
            {items.map((item) => {
              const img = item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';
              const maxStock = item.variant?.stock_quantity || 10;

              return (
                <div key={item.variant_id} className="py-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  
                  {/* Thumbnail & Product Details */}
                  <div className="flex gap-4 items-center">
                    <div className="relative w-24 h-32 bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200">
                      <Image
                        src={img}
                        alt={item.product?.name || 'Product'}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                        {item.product?.brand?.name || 'BRAND LUST'}
                      </p>
                      <Link href={`/products/${item.product?.slug || item.product?.id}`}>
                        <h3 className="text-sm font-semibold text-stone-950 hover:underline">
                          {item.product?.name}
                        </h3>
                      </Link>
                      <div className="text-xs text-stone-500 mt-1 flex items-center gap-3">
                        <span>Size: <strong className="text-stone-800">{item.variant?.size}</strong></span>
                        <span>Color: <strong className="text-stone-800">{item.variant?.color}</strong></span>
                      </div>
                      <p className="text-xs font-bold text-stone-900 mt-2 sm:hidden">
                        ₹{(item.product?.selling_price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-2 sm:pt-0">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-stone-300 bg-white">
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                        className="p-1.5 hover:bg-stone-100 text-stone-600"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className={`p-1.5 text-stone-600 ${item.quantity >= maxStock ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-100'}`}
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-stone-950">
                        ₹{((item.product?.selling_price || 0) * item.quantity).toLocaleString('en-IN')}
                      </p>
                      {item.product?.original_price > item.product?.selling_price && (
                        <p className="text-[11px] text-stone-400 line-through">
                          ₹{((item.product?.original_price || 0) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    {/* Remove Icon */}
                    <button
                      onClick={() => removeFromCart(item.variant_id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 transition"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-black"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

        </div>

        {/* Order Summary Card (4 Columns) */}
        <div className="lg:col-span-4">
          <div className="bg-stone-100 p-6 border border-stone-200 sticky top-28 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-950 border-b border-stone-200 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promotional Savings</span>
                  <span className="font-medium">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-medium text-stone-900">
                  {deliveryCharges === 0 ? <span className="text-emerald-800 font-bold">FREE</span> : `₹${deliveryCharges}`}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-950">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-stone-400 pt-1">
                Inclusive of all applicable goods & services taxes (GST).
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-900 flex-shrink-0" />
                <span>256-bit Bank Grade Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-900 flex-shrink-0" />
                <span>Free Doorstep Exchanges & Returns</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
