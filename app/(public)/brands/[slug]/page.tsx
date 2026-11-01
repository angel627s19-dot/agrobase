import React from 'react';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BRANDS_DATA } from '@/lib/constants';
import { notFound } from 'next/navigation';

export default function BrandDetailPage({ params }: { params: { slug: string } }) {
  const brand = BRANDS_DATA.find(b => b.slug === params.slug);
  if (!brand) return notFound();
  
  const products = DEMO_PRODUCTS.filter(p => p.brand?.slug === params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-brand-dark mb-8">{brand.name} Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
