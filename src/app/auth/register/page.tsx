'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await signUp(email, password, fullName);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push('/shop');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-stone-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-2xl font-black tracking-[0.25em] text-stone-950 uppercase block">
            BRAND LUST
          </span>
          <p className="text-xs uppercase tracking-widest text-stone-400 mt-1 font-semibold">
            Join The Atelier
          </p>
          <h2 className="mt-6 text-xl font-extrabold uppercase tracking-tight text-stone-900">
            Create your account
          </h2>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Julian Vance"
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="julian@example.com"
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password (minimum 6 characters)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? <span>Creating Account...</span> : <span>Register Account</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-stone-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-stone-900 underline hover:text-stone-700">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
