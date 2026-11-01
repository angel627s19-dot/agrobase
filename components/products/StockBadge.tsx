import React from 'react';
import { getStockStatus, cn } from '@/lib/utils';

export const StockBadge = ({ stock, lowStockThreshold = 5 }: { stock: number, lowStockThreshold?: number }) => {
  const status = getStockStatus(stock, lowStockThreshold);
  
  const colors = {
    out_of_stock: 'bg-red-500',
    low_stock: 'bg-orange-500',
    in_stock: 'bg-brand-green-500'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", colors[status.status as keyof typeof colors])} />
      <span className="text-sm font-medium text-gray-700">{status.label}</span>
    </div>
  );
};
