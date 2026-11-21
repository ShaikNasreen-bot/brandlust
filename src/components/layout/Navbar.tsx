'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  Package, 
  ChevronDown 
} from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useAuth } from '@/lib/context/auth-context';

export function Navbar() {
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, profile, isAdmin, signOut, setDemoAdmin, setDemoCustomer } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 text-center tracking-widest uppercase font-medium flex justify-center items-center gap-2">
        <span>Complimentary Express Shipping on Orders Above ₹1,999</span>
        <span className="text-stone-500">•</span>
        <span className="text-sand-300">New Autumn/Winter Collection Live</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-stone-950 uppercase group-hover:text-stone-700 transition">
                BRAND LUST
              </span>
              <span className="text-[9px] tracking-[0.35em] text-stone-400 uppercase -mt-1 font-semibold">
                Men's Fashion
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase text-stone-700">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <Link href="/shop" className="hover:text-black transition">
              Shop All
            </Link>
            <Link href="/shop?category=shirts" className="hover:text-black transition">
              Shirts
            </Link>
            <Link href="/shop?category=jeans" className="hover:text-black transition">
              Denim
            </Link>
            <Link href="/shop?new=true" className="hover:text-black transition flex items-center gap-1">
              <span>New Arrivals</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900"></span>
            </Link>
            <Link href="/shop?bestseller=true" className="hover:text-black transition text-stone-900 font-semibold">
              Best Sellers
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Icon / Input */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search shirts, jeans, jackets..."
                    className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-stone-100 border border-stone-300 rounded-none focus:outline-none focus:border-stone-900 text-stone-900"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 text-stone-400 hover:text-stone-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1.5 text-stone-700 hover:text-black transition"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1.5 text-stone-700 hover:text-black transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-stone-700 hover:text-black transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 text-stone-700 hover:text-black transition"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 shadow-xl py-3 z-50 text-sm"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-semibold text-stone-900">{profile?.full_name || 'Customer'}</p>
                        <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1 text-[10px] font-bold tracking-wider bg-stone-900 text-white uppercase rounded">
                            Admin
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50"
                        >
                          <User className="w-4 h-4" /> Profile & Address
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50"
                        >
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-stone-900 font-semibold bg-stone-100 hover:bg-stone-200"
                          >
                            <ShieldCheck className="w-4 h-4 text-stone-900" /> Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-stone-100 pt-1">
                        <button
                          onClick={() => {
                            signOut();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 text-xs font-medium"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-medium text-stone-900">Welcome to BRAND LUST</p>
                        <p className="text-xs text-stone-500">Sign in to access your orders & wishlist</p>
                      </div>

                      <div className="p-3 space-y-2">
                        <Link
                          href="/auth/login"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block w-full text-center py-2 px-4 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-black transition"
                        >
                          Sign In / Register
                        </Link>

                        {/* Quick 1-click demo buttons for testing */}
                        <div className="pt-2 border-t border-stone-100 space-y-1.5">
                          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                            Instant Demo Access:
                          </p>
                          <button
                            onClick={() => {
                              setDemoAdmin();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left text-xs px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-between"
                          >
                            <span>1-Click Admin Access</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                          </button>
                          <button
                            onClick={() => {
                              setDemoCustomer();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left text-xs px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 flex items-center justify-between"
                          >
                            <span>1-Click Customer Access</span>
                            <User className="w-3.5 h-3.5 text-stone-500" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Brand Lust..."
                className="w-full pl-3 pr-10 py-2 text-sm bg-stone-50 border border-stone-200 rounded-none focus:outline-none focus:border-stone-900"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-stone-500">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex flex-col space-y-3 text-sm font-medium tracking-wider uppercase text-stone-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Shop All
            </Link>
            <Link
              href="/shop?category=t-shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              T-Shirts
            </Link>
            <Link
              href="/shop?category=shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Shirts
            </Link>
            <Link
              href="/shop?category=jeans"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Jeans & Denim
            </Link>
            <Link
              href="/shop?category=trousers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Trousers
            </Link>
            <Link
              href="/shop?category=jackets"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Jackets & Coats
            </Link>
            <Link
              href="/shop?new=true"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black text-stone-950 font-bold"
            >
              New Arrivals
            </Link>
            <Link
              href="/shop?bestseller=true"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Best Sellers
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
