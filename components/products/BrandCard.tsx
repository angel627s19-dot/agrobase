import React from 'react';
import Link from 'next/link';

export const BrandCard = ({ brand }: { brand: any }) => {
  return (
    <Link href={`/brands/${brand.slug}`} className="block group">
      <div className="bg-white border rounded-xl p-8 flex flex-col items-center justify-center transition hover:shadow-card-hover hover:-translate-y-1">
        <span className="text-4xl font-heading font-bold text-brand-green-700 mb-2">{brand.name[0]}</span>
        <h3 className="text-lg font-heading font-medium">{brand.name}</h3>
        <span className="text-sm text-gray-500 mt-2">View Products &rarr;</span>
      </div>
    </Link>
  );
};
