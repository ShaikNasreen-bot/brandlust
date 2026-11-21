'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await resetPassword(email);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-stone-200 shadow-xl">
        
        <div className="text-center">
          <span className="text-2xl font-black tracking-[0.25em] text-stone-950 uppercase block">
            BRAND LUST
          </span>
          <h2 className="mt-6 text-xl font-extrabold uppercase tracking-tight text-stone-900">
            Reset Your Password
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Enter the email address associated with your account and we'll send a password recovery link.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-900 text-xs space-y-3 text-center">
            <Check className="w-8 h-8 text-green-600 mx-auto" />
            <p className="font-semibold">Password recovery link dispatched.</p>
            <p className="text-stone-600">Please check your email inbox to complete your credentials update.</p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-stone-900 underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Sending link...' : 'Send Recovery Link'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
