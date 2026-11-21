import React, { Suspense } from 'react';
import { getCategories, getBrands, getProducts } from '@/lib/supabase/products';
import { ShopClient } from './ShopClient';

export const revalidate = 60;

export default async function ShopPage() {
  const [categories, brands, { products }] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
  ]);

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs uppercase tracking-widest text-stone-500">Loading collection...</div>}>
      <ShopClient
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </Suspense>
  );
}
