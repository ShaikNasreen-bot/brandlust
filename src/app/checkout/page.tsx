'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  AlertCircle, 
  Check, 
  ArrowRight, 
  Lock 
} from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useAuth } from '@/lib/context/auth-context';
import { createOrder } from '@/lib/supabase/orders';
import { PaymentMethod } from '@/types/database';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { items, subtotal, deliveryCharges, discountAmount, totalAmount, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.email) setEmail(profile.email);
      if (profile.phone) setPhone(profile.phone);
      if (profile.address) setAddress(profile.address);
      if (profile.city) setCity(profile.city);
      if (profile.state) setState(profile.state);
      if (profile.postal_code) setPostalCode(profile.postal_code);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [profile, user]);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-stone-900">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500">Please add items to your shopping bag before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Authentication barrier as required: "Require authentication before placing an order."
  if (!authLoading && !user) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 sm:px-6">
        <div className="bg-white p-8 border border-stone-200 shadow-xl text-center space-y-6">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-700">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-stone-950">
              Sign In Required to Checkout
            </h1>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              To safeguard your purchase and ensure real-time shipment tracking, please sign in or create an account to proceed.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/auth/login?redirect=/checkout"
              className="block w-full py-3.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition"
            >
              Sign In to Continue
            </Link>
            <Link
              href="/auth/register"
              className="block w-full py-3 border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-50 transition"
            >
              Register New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName || !email || !phone || !address || !city || !state || !postalCode) {
      setErrorMsg('Please complete all delivery details before placing your order.');
      return;
    }

    // Check payment gateway rule: "Never mark an online payment as successful without verified payment gateway confirmation."
    if (paymentMethod === 'Razorpay' || paymentMethod === 'Card') {
      // In production without live API key, inform user to use Cash on Delivery for instant confirmation
      setErrorMsg(
        'Online payment gateway test mode: Please select "Cash on Delivery" for instant verified order completion, or link your live Razorpay credentials.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = await createOrder({
        userId: user?.id || null,
        items: items.map((it) => ({
          productId: it.product_id,
          variantId: it.variant_id,
          productName: it.product.name,
          size: it.variant.size,
          color: it.variant.color,
          unitPrice: it.product.selling_price,
          quantity: it.quantity,
          totalPrice: it.product.selling_price * it.quantity,
        })),
        subtotal,
        deliveryCharges,
        discountAmount,
        totalAmount,
        paymentMethod,
        shipping: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          postalCode,
        },
      });

      // Clear cart upon successful order creation
      clearCart();

      // Navigate to order confirmation
      router.push(`/orders/${orderData.order_number}`);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setErrorMsg(err.message || 'An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Checkout Title */}
      <div className="border-b border-stone-200 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
          Secure Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete your delivery coordinates and select payment preference.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Delivery Details & Payment Method (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Contact Information */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>1. Contact Information</span>
              <span className="text-[11px] text-stone-400 font-normal">Logged in as {user?.email}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Julian Hayes"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="julian@example.com"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
              />
            </div>
          </div>

          {/* Section 2: Shipping Destination */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
              2. Shipping Destination
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Complete Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/Flat No., Apartment, Street, Landmark"
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="400050"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Preference */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
              3. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery (Working) */}
              <label className={`flex items-start gap-3 p-4 border cursor-pointer transition ${
                paymentMethod === 'COD' ? 'border-stone-950 bg-stone-50' : 'border-stone-200 hover:border-stone-400'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-0.5 text-stone-950 focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-stone-900" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-950">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Pay securely in cash or via UPI upon doorstep receipt of your order.
                  </p>
                </div>
              </label>

              {/* Online Payment Gateway (Razorpay Architecture) */}
              <label className={`flex items-start gap-3 p-4 border cursor-pointer transition ${
                paymentMethod === 'Razorpay' ? 'border-stone-950 bg-stone-50' : 'border-stone-200 hover:border-stone-400'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="mt-0.5 text-stone-950 focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-stone-900" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-950">
                      Razorpay / Cards / UPI / NetBanking
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Direct integration structure ready for payment gateway authentication.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary & Placement (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-stone-100 p-6 border border-stone-200 sticky top-28 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-950 border-b border-stone-200 pb-3">
              Order Summary ({items.reduce((acc, it) => acc + it.quantity, 0)} items)
            </h2>

            {/* Compact Item list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-stone-200 pr-1">
              {items.map((it) => (
                <div key={it.variant_id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-stone-200 flex-shrink-0 overflow-hidden">
                      <Image
                        src={it.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80'}
                        alt={it.product?.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 line-clamp-1">{it.product?.name}</p>
                      <p className="text-[11px] text-stone-500">
                        Size: {it.variant?.size} • Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-950">
                    ₹{((it.product?.selling_price || 0) * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-200 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promotional Discount</span>
                  <span className="font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Expedited Shipping</span>
                <span className="font-semibold text-stone-900">
                  {deliveryCharges === 0 ? <span className="text-emerald-800 font-bold">FREE</span> : `₹${deliveryCharges}`}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-950">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order (₹{totalAmount.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] text-stone-500 space-y-1.5 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-stone-800 flex-shrink-0" />
                <span>SSL Encrypted transaction. Instant confirmation generated.</span>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
