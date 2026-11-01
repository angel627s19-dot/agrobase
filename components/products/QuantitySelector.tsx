'use client';
import React from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  max: number;
}

export const QuantitySelector = ({ value, onChange, max }: QuantitySelectorProps) => {
  return (
    <div className="flex items-center border rounded-lg overflow-hidden w-fit">
      <button 
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
      >-</button>
      <div className="px-4 py-1 font-medium">{value}</div>
      <button 
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
      >+</button>
    </div>
  );
};
