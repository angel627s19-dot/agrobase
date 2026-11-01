'use client';
import React from 'react';
import { PRODUCT_SORT_OPTIONS } from '@/lib/constants';

export const SortDropdown = () => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-600">Sort by:</label>
      <select className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green-700">
        {PRODUCT_SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};
