'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Truck, RefreshCw, Award } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-stone-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Artisanal Quality</h4>
              <p className="text-xs text-stone-400 mt-1">Sourced from the finest global mills with uncompromising craftsmanship.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Truck className="w-6 h-6 text-stone-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Express Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">Complimentary expedited shipping on all orders exceeding ₹1,999.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <RefreshCw className="w-6 h-6 text-stone-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Seamless Returns</h4>
              <p className="text-xs text-stone-400 mt-1">Hassle-free 15-day return and exchange policy with doorstep pickup.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-stone-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Secure Checkout</h4>
              <p className="text-xs text-stone-400 mt-1">Encrypted 256-bit payment security with Cash on Delivery available.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-extrabold tracking-[0.25em] text-white uppercase block">
              BRAND LUST
            </span>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              An architectural approach to menswear. We curate essentials, tailoring, and modern streetwear for the discerning gentleman.
            </p>

            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-2">
                Join the Private Circle
              </h5>
              <p className="text-[11px] text-stone-400 mb-3">
                Receive curated seasonal previews, exclusive capsule drops, and 10% off your first order.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400 text-xs py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome to BRAND LUST. Check your inbox for your code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-stone-900 border border-stone-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-stone-500 placeholder-stone-500"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black px-4 py-2.5 text-xs font-semibold tracking-wider uppercase hover:bg-stone-200 transition flex items-center gap-1"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collection Links */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/shop?category=t-shirts" className="hover:text-white transition">Heavyweight Tees</Link>
              </li>
              <li>
                <Link href="/shop?category=shirts" className="hover:text-white transition">Linen & Oxford Shirts</Link>
              </li>
              <li>
                <Link href="/shop?category=jeans" className="hover:text-white transition">Selvedge Denim</Link>
              </li>
              <li>
                <Link href="/shop?category=trousers" className="hover:text-white transition">Pleated Trousers</Link>
              </li>
              <li>
                <Link href="/shop?category=jackets" className="hover:text-white transition">Leather & Overcoats</Link>
              </li>
              <li>
                <Link href="/shop?category=ethnic-wear" className="hover:text-white transition">Ceremonial & Kurtas</Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/orders" className="hover:text-white transition">Track Your Order</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition">Account & Profile</Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition">Saved Items</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition">Shopping Bag</Link>
              </li>
              <li>
                <span className="text-stone-500">Shipping & Returns Guide</span>
              </li>
              <li>
                <span className="text-stone-500">Size & Measurement Matrix</span>
              </li>
            </ul>
          </div>

          {/* Contact & Store */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Our Store
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <p className="text-stone-300 font-semibold">Jaffar Saddiq</p>
              <p>Opp to Omni Hospital,</p>
              <p>BudhawarPet, Kurnool,</p>
              <p>Andhra Pradesh – 518002</p>
              <p className="pt-2 text-stone-300 font-medium">sjafar7@gmail.com</p>
              <p className="text-stone-300 font-medium">+91 99635 41449</p>
              <p className="text-[11px] text-stone-500 pt-1">Mon – Sat: 10:00 AM – 8:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 text-stone-500 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} BRAND LUST. All rights reserved.</p>
        <div className="flex items-center space-x-6 text-[11px]">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Preferences</span>
          <span>Supply Chain Transparency</span>
        </div>
      </div>
    </footer>
  );
}
