import React from 'react';
import { ProductCard } from './ProductCard';

export const RelatedProducts = ({ products }: { products: any[] }) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-heading font-bold mb-6">Related Products</h2>
      <div className="flex overflow-x-auto gap-6 pb-4">
        {products.map(p => (
          <div key={p.id} className="min-w-[280px] w-[280px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};
