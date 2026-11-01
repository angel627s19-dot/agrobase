'use client';
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="absolute left-3 text-gray-400" size={18} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full border rounded-lg pl-10 pr-10 py-2 outline-none focus:ring-2 focus:ring-brand-green-200"
      />
      {query && (
        <button onClick={() => setQuery('')} className="absolute right-3 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      )}
    </div>
  );
};
