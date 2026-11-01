'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ArrowRight, Package, Grid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { POPULAR_SEARCHES, CATEGORIES_DATA } from '@/lib/constants';

interface SearchResultProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  category: string;
  categorySlug: string;
  brand?: string | null;
}

interface SearchResultCategory {
  name: string;
  slug: string;
}

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<SearchResultProduct[]>([]);
  const [categories, setCategories] = useState<SearchResultCategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setCategories([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
          setCategories(data.categories || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Autocomplete fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && selectedCategory === 'all') {
      router.push('/products');
      return;
    }

    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);

    setIsOpen(false);
    router.push(`/products?${params.toString()}`);
  };

  const handlePillClick = (term: string) => {
    setQuery(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <section ref={containerRef} className="relative z-30 -mt-20 px-4 md:px-6 mb-16 max-w-4xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 md:p-3 relative">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative w-full md:w-auto shrink-0 flex items-center border-b md:border-b-0 md:border-r border-gray-100 px-4 py-2 md:py-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-transparent font-medium text-xs sm:text-sm text-gray-700 outline-none pr-8 cursor-pointer w-full md:w-36 py-1"
            >
              <option value="all">All Categories</option>
              {CATEGORIES_DATA.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Search Input */}
          <div className="relative flex-grow w-full flex items-center px-4 py-2 md:py-0">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search pipes, fittings, spray hose, HDPE..." 
              className="w-full bg-transparent outline-none px-3 text-sm text-gray-800 placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (products.length > 0 || categories.length > 0) setIsOpen(true);
              }}
            />
            {isLoading && (
              <span className="w-4 h-4 rounded-full border-2 border-brand-green-700 border-t-transparent animate-spin shrink-0" />
            )}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full md:w-auto px-7 py-3 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold text-sm rounded-xl transition-all active:scale-95 shadow-md shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Live Autocomplete Dropdown */}
        {isOpen && (products.length > 0 || categories.length > 0) && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 divide-y divide-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Category Matches */}
            {categories.length > 0 && (
              <div className="p-3 bg-gray-50/70">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-2">
                  Matching Categories
                </span>
                <div className="flex flex-wrap gap-2 px-1">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categories/${c.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-gray-200 hover:border-brand-green-700 text-xs font-semibold text-gray-700 hover:text-brand-green-700 transition"
                    >
                      <Grid className="w-3 h-3 text-brand-green-600" />
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Matches */}
            {products.length > 0 && (
              <div className="p-2 max-h-80 overflow-y-auto">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 px-3 py-1">
                  Products ({products.length})
                </span>
                {products.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-green-50/60 transition group"
                  >
                    <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-brand-green-800 transition truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {item.brand ? `${item.brand} • ` : ''}{item.category}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-brand-green-800">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* View All Matches Footer */}
            <div className="p-2.5 bg-gray-50 text-center border-t border-gray-100">
              <button
                type="button"
                onClick={handleSubmit}
                className="text-xs font-bold text-brand-green-700 hover:text-brand-green-800 inline-flex items-center gap-1 hover:underline"
              >
                <span>View all results for &quot;{query}&quot;</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Popular Search Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
        <span className="text-gray-500 font-semibold">Popular Searches:</span>
        {POPULAR_SEARCHES.map((term) => (
          <button 
            key={term}
            type="button"
            onClick={() => handlePillClick(term)}
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-brand-green-700 hover:text-brand-green-700 font-medium transition-colors shadow-2xs active:scale-95"
          >
            {term}
          </button>
        ))}
      </div>
    </section>
  );
}
