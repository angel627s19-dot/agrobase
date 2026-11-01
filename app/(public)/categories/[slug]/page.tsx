import React from 'react';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CATEGORIES_DATA } from '@/lib/constants';
import { notFound } from 'next/navigation';

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = CATEGORIES_DATA.find(c => c.slug === params.slug);
  if (!category) return notFound();
  
  const products = DEMO_PRODUCTS.filter(p => p.category?.slug === params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-brand-dark mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      <ProductGrid products={products} />
    </div>
  );
}
