'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, MapPin, Phone, Mail, Package, ShieldCheck, Check, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isAdmin, updateProfile, signOut, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setPostalCode(profile.postal_code || '');
    }
  }, [profile]);

  if (isLoading) {
    return <div className="p-16 text-center text-xs uppercase tracking-wider text-stone-500">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-stone-900">Sign In Required</h2>
        <p className="text-xs text-stone-500">Please sign in to view and manage your profile details.</p>
        <Link
          href="/auth/login?redirect=/profile"
          className="inline-block px-6 py-2.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      full_name: fullName,
      phone,
      address,
      city,
      state,
      postal_code: postalCode,
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
            Client Profile
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your personal contact details and saved delivery address.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="px-4 py-2 border border-stone-300 text-xs font-bold uppercase tracking-wider hover:bg-stone-100 flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Account Overview Card */}
        <div className="bg-stone-100 p-6 border border-stone-200 h-fit space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-950 text-white flex items-center justify-center text-xl font-bold">
            {(fullName || user.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900">{fullName || 'BRAND LUST Member'}</h3>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
            <div className="mt-2">
              <span className="inline-block px-2.5 py-0.5 bg-stone-200 text-stone-800 text-[10px] font-bold uppercase tracking-wider">
                {profile?.role === 'admin' ? 'Atelier Administrator' : 'Verified Member'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <button
              onClick={() => {
                signOut();
                router.push('/');
              }}
              className="w-full py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 border border-stone-200">
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-950 mb-4 pb-2 border-b border-stone-100">
              Personal & Delivery Coordinates
            </h2>

            {savedSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Profile and shipping details successfully updated.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email (Account Identifier)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full p-2.5 text-xs bg-stone-100 border border-stone-200 text-stone-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Mobile Number
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Primary Street Address
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment, building, street, landmark"
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
