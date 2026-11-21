'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile } from '@/types/database';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: 'customer' | 'admin';
  };
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>;
  setDemoAdmin: () => void;
  setDemoCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (isSupabaseConfigured && supabase) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
          };
          setUser(u);
          fetchProfile(session.user.id, u.email);
        } else {
          checkLocalSession();
        }
        setIsLoading(false);
      });

      // 2. Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
          };
          setUser(u);
          fetchProfile(session.user.id, u.email);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      checkLocalSession();
      setIsLoading(false);
    }
  }, []);

  const checkLocalSession = () => {
    try {
      const stored = localStorage.getItem('BRAND LUST_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        const storedProf = localStorage.getItem('BRAND LUST_profile');
        if (storedProf) {
          setProfile(JSON.parse(storedProf));
        } else {
          setProfile({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || 'Customer',
            phone: '+91 98765 43210',
            address: '42, Fashion Boulevard',
            city: 'Mumbai',
            state: 'Maharashtra',
            postal_code: '400001',
            role: u.user_metadata?.role || 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch {
      // ignore
    }
  };

  const fetchProfile = async (userId: string, email: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as Profile);
    } else {
      // create initial profile object
      const fallback: Profile = {
        id: userId,
        email,
        full_name: user?.user_metadata?.full_name || '',
        phone: null,
        address: null,
        city: null,
        state: null,
        postal_code: null,
        role: (user?.user_metadata?.role as 'customer' | 'admin') || 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(fallback);
    }
  };

  const signIn = async (email: string, password?: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    const supabase = getSupabaseClient();

    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);
      if (error) return { error: error.message };
      if (data.user) {
        fetchProfile(data.user.id, data.user.email || '');
      }
      return { error: null };
    }

    // Local / Demo Sign In
    const isAdminUser = email.toLowerCase().includes('admin');
    const demoUser: User = {
      id: `usr-${Date.now()}`,
      email,
      user_metadata: {
        full_name: isAdminUser ? 'Lead Admin' : 'John Doe',
        role: isAdminUser ? 'admin' : 'customer',
      },
    };
    const demoProfile: Profile = {
      id: demoUser.id,
      email,
      full_name: isAdminUser ? 'Lead Admin' : 'John Doe',
      phone: '+91 98765 43210',
      address: '42, Fashion Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400050',
      role: isAdminUser ? 'admin' : 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(demoUser);
    setProfile(demoProfile);
    localStorage.setItem('BRAND LUST_user', JSON.stringify(demoUser));
    localStorage.setItem('BRAND LUST_profile', JSON.stringify(demoProfile));
    setIsLoading(false);
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    const supabase = getSupabaseClient();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'customer',
          },
        },
      });
      setIsLoading(false);
      if (error) return { error: error.message };
      if (data.user) {
        fetchProfile(data.user.id, email);
      }
      return { error: null };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      user_metadata: {
        full_name: fullName,
        role: 'customer',
      },
    };
    const newProfile: Profile = {
      id: newUser.id,
      email,
      full_name: fullName,
      phone: null,
      address: null,
      city: null,
      state: null,
      postal_code: null,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newUser);
    setProfile(newProfile);
    localStorage.setItem('BRAND LUST_user', JSON.stringify(newUser));
    localStorage.setItem('BRAND LUST_profile', JSON.stringify(newProfile));
    setIsLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('BRAND LUST_user');
    localStorage.removeItem('BRAND LUST_profile');
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
    }
    return { error: null };
  };

  const updateProfile = async (data: Partial<Profile>): Promise<{ error: string | null }> => {
    if (!profile) return { error: 'Not authenticated' };
    const updated = { ...profile, ...data, updated_at: new Date().toISOString() };
    setProfile(updated);
    localStorage.setItem('BRAND LUST_profile', JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profile.id);
      if (error) return { error: error.message };
    }
    return { error: null };
  };

  const setDemoAdmin = () => {
    signIn('admin@brandlust.com');
  };

  const setDemoCustomer = () => {
    signIn('customer@brandlust.com');
  };

  const isAdmin = profile?.role === 'admin' || user?.user_metadata?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        setDemoAdmin,
        setDemoCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
