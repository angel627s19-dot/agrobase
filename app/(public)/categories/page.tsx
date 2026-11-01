import React from 'react';
import { CATEGORIES_DATA } from '@/lib/constants';
import Link from 'next/link';

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-brand-dark mb-8">Product Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES_DATA.map(cat => (
          <Link href={`/categories/${cat.slug}`} key={cat.id} className="block group">
            <div className="bg-brand-green-700 text-white rounded-xl p-8 h-48 flex flex-col justify-end transition hover:shadow-card-hover hover:-translate-y-1">
              <h3 className="text-xl font-heading font-bold">{cat.name}</h3>
              <p className="text-white/80 mt-2 text-sm">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
