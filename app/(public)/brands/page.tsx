import React from 'react';
import { BRANDS_DATA } from '@/lib/constants';
import Link from 'next/link';

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-brand-dark mb-8">Our Trusted Brands</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {BRANDS_DATA.map(brand => (
          <Link href={`/brands/${brand.slug}`} key={brand.id} className="block group">
            <div className="bg-white border rounded-xl p-8 flex flex-col items-center justify-center transition hover:shadow-card-hover hover:-translate-y-1">
              <span className="text-4xl font-heading font-bold text-brand-green-700 mb-2">{brand.name[0]}</span>
              <h3 className="text-lg font-heading font-medium">{brand.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
