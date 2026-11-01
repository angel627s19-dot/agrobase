'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: { url: string; alt: string }[];
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]?.url || '/images/placeholder-product.jpg');

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square bg-gray-100 rounded-xl relative overflow-hidden">
        <Image src={mainImage} alt="Product" fill className="object-cover transition-transform hover:scale-110" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setMainImage(img.url)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg relative overflow-hidden border-2 ${mainImage === img.url ? 'border-brand-green-700' : 'border-transparent'}`}
          >
            <Image src={img.url} alt={img.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
