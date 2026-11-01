import React from 'react';
import Link from 'next/link';

export const CategoryCard = ({ category }: { category: any }) => {
  return (
    <Link prefetch={true} href={`/categories/${category.slug}`} className="block group">
      <div className="relative overflow-hidden rounded-xl h-48 bg-brand-green-700 flex flex-col justify-end p-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="relative z-20">
          <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:translate-x-2 transition-transform">{category.name}</h3>
          <span className="text-white/80 text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
            View Products &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};
