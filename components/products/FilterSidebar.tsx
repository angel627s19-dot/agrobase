'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CATEGORIES_DATA, BRANDS_DATA } from '@/lib/constants';
import { RotateCcw } from 'lucide-react';

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const stockOnly = searchParams.get('stock') === 'true';

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset to page 1 on filter changes if pagination exists
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedBrand || minPrice || maxPrice || stockOnly || searchParams.get('search')
  );

  const pricePresets = [
    { label: 'Under ₹500', min: '0', max: '500' },
    { label: '₹500 – ₹1,500', min: '500', max: '1500' },
    { label: '₹1,500 – ₹3,000', min: '1500', max: '3000' },
    { label: 'Above ₹3,000', min: '3000', max: '100000' },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block pr-6 space-y-6 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 hide-scrollbar">
      {/* Header & Clear */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-heading font-bold text-base text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-brand-green-700 hover:text-brand-green-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-gray-700 mb-3">
          Categories
        </h4>
        <div className="space-y-1.5 text-xs text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer hover:text-brand-green-700 py-1">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => updateParam('category', null)}
              className="accent-brand-green-700"
            />
            <span className={!selectedCategory ? 'font-bold text-brand-green-700' : ''}>All Categories</span>
          </label>
          {CATEGORIES_DATA.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer hover:text-brand-green-700 py-1"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory.toLowerCase() === cat.slug.toLowerCase()}
                onChange={() => updateParam('category', cat.slug)}
                className="accent-brand-green-700"
              />
              <span className={selectedCategory.toLowerCase() === cat.slug.toLowerCase() ? 'font-bold text-brand-green-700' : ''}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-gray-700 mb-3">
          Brands
        </h4>
        <div className="space-y-1.5 text-xs text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer hover:text-brand-green-700 py-1">
            <input
              type="radio"
              name="brand"
              checked={!selectedBrand}
              onChange={() => updateParam('brand', null)}
              className="accent-brand-green-700"
            />
            <span className={!selectedBrand ? 'font-bold text-brand-green-700' : ''}>All Brands</span>
          </label>
          {BRANDS_DATA.map((b) => (
            <label
              key={b.id}
              className="flex items-center gap-2 cursor-pointer hover:text-brand-green-700 py-1"
            >
              <input
                type="radio"
                name="brand"
                checked={selectedBrand.toLowerCase() === b.slug.toLowerCase()}
                onChange={() => updateParam('brand', b.slug)}
                className="accent-brand-green-700"
              />
              <span className={selectedBrand.toLowerCase() === b.slug.toLowerCase() ? 'font-bold text-brand-green-700' : ''}>
                {b.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-gray-700 mb-3">
          Price Range
        </h4>
        
        <div className="space-y-1.5 text-xs mb-3">
          {pricePresets.map((preset, idx) => {
            const isSelected = minPrice === preset.min && maxPrice === preset.max;
            return (
              <label key={idx} className="flex items-center gap-2 cursor-pointer hover:text-brand-green-700 py-1">
                <input
                  type="radio"
                  name="pricePreset"
                  checked={isSelected}
                  onChange={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('minPrice', preset.min);
                    params.set('maxPrice', preset.max);
                    params.delete('page');
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className="accent-brand-green-700"
                />
                <span className={isSelected ? 'font-bold text-brand-green-700' : 'text-gray-600'}>
                  {preset.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* Custom Min/Max Inputs */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value || null)}
            className="w-1/2 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-brand-green-700"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value || null)}
            className="w-1/2 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-brand-green-700"
          />
        </div>
      </div>

      {/* Stock Availability Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-gray-700 mb-3">
          Availability
        </h4>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 select-none">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(e) => updateParam('stock', e.target.checked ? 'true' : null)}
            className="w-4 h-4 rounded border-gray-300 text-brand-green-700 focus:ring-brand-green-700 accent-brand-green-700"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}
