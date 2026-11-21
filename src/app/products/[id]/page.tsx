import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts } from '@/lib/supabase/products';
import { ProductDetailsClient } from './ProductDetailsClient';

export const revalidate = 60;

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4);

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
