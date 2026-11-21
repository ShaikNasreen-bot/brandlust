'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { signIn, setDemoAdmin, setDemoCustomer } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push(redirect);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-stone-200 shadow-xl">
      {/* Header */}
      <div className="text-center">
        <span className="text-2xl font-black tracking-[0.25em] text-stone-950 uppercase block">
          BRAND LUST
        </span>
        <p className="text-xs uppercase tracking-widest text-stone-400 mt-1 font-semibold">
          Member Authentication
        </p>
        <h2 className="mt-6 text-xl font-extrabold uppercase tracking-tight text-stone-900">
          Sign in to your account
        </h2>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-stone-500 hover:text-black underline"
            >
              Forgot password?
            </Link>
          </div>
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
            {loading ? <span>Verifying...</span> : <span>Sign In</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* 1-Click Fast Demo Credentials */}
      <div className="pt-6 border-t border-stone-200 space-y-2">
        <p className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider text-center">
          Instant One-Click Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setDemoCustomer();
              router.push(redirect);
            }}
            className="p-2 border border-stone-300 text-[11px] font-semibold text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-1.5 transition"
          >
            <User className="w-3.5 h-3.5 text-stone-600" />
            <span>Demo Customer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDemoAdmin();
              router.push(redirect);
            }}
            className="p-2 bg-stone-900 text-white text-[11px] font-semibold hover:bg-black flex items-center justify-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Demo Admin</span>
          </button>
        </div>
      </div>

      {/* Register link */}
      <div className="text-center pt-2">
        <p className="text-xs text-stone-500">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-bold text-stone-900 underline hover:text-stone-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="p-12 text-center text-xs uppercase text-stone-400">Loading authentication...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
