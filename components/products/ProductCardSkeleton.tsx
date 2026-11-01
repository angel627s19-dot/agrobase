import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl bg-white shadow-card overflow-hidden">
      <div className="aspect-square w-full animate-pulse bg-gray-200" />
      <div className="flex flex-1 flex-col p-4 space-y-3">
        <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
        
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full animate-pulse bg-gray-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-1">
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
};
