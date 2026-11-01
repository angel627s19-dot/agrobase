'use client';

import React, { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CATEGORIES_DATA, BRANDS_DATA } from '@/lib/constants';

export const MobileFilters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const stockOnly = searchParams.get('stock') === 'true';

  const activeCount = [
    Boolean(selectedCategory),
    Boolean(selectedBrand),
    Boolean(minPrice || maxPrice),
    stockOnly,
  ].filter(Boolean).length;

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border border-gray-200 bg-white shadow-2xs rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800"
      >
        <Filter size={15} className="text-brand-green-700" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-brand-green-700 text-white text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-gray-900">Filter Products</h3>
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-green-100 text-brand-green-800">
                    {activeCount} active
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Categories */}
              <div>
                <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-gray-700 mb-2.5">
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => updateParam('category', null)}
                    className={`px-3 py-2 rounded-lg border text-left font-medium transition ${
                      !selectedCategory
                        ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-800 font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateParam('category', cat.slug)}
                      className={`px-3 py-2 rounded-lg border text-left font-medium transition truncate ${
                        selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                          ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-800 font-bold'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-gray-700 mb-2.5">
                  Brands
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => updateParam('brand', null)}
                    className={`px-3 py-2 rounded-lg border text-left font-medium transition ${
                      !selectedBrand
                        ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-800 font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    All Brands
                  </button>
                  {BRANDS_DATA.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => updateParam('brand', b.slug)}
                      className={`px-3 py-2 rounded-lg border text-left font-medium transition truncate ${
                        selectedBrand.toLowerCase() === b.slug.toLowerCase()
                          ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-800 font-bold'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <input
                    type="checkbox"
                    checked={stockOnly}
                    onChange={(e) => updateParam('stock', e.target.checked ? 'true' : null)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-green-700 accent-brand-green-700"
                  />
                  <span>Show In Stock Items Only</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex gap-3">
              <button 
                className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5" 
                onClick={clearAllFilters}
              >
                <RotateCcw size={14} />
                <span>Reset All</span>
              </button>
              <button 
                className="flex-1 bg-brand-green-700 hover:bg-brand-green-800 text-white py-3 rounded-xl text-xs font-bold shadow-md" 
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
