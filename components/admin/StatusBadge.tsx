import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type: 'order' | 'payment' | 'product' | 'inquiry';
  className?: string;
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const getStyles = () => {
    const s = status.toLowerCase();
    
    if (type === 'order') {
      if (['pending', 'processing'].includes(s)) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      if (['confirmed', 'ready', 'shipped'].includes(s)) return 'bg-blue-100 text-blue-800 border-blue-200';
      if (['completed', 'delivered'].includes(s)) return 'bg-green-100 text-green-800 border-green-200';
      if (['cancelled', 'failed'].includes(s)) return 'bg-red-100 text-red-800 border-red-200';
    }
    
    if (type === 'payment') {
      if (s === 'paid') return 'bg-green-100 text-green-800 border-green-200';
      if (s === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      if (s === 'failed') return 'bg-red-100 text-red-800 border-red-200';
      if (s === 'refunded') return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    if (type === 'product') {
      if (s === 'published' || s === 'active') return 'bg-brand-green-50 text-brand-green-700 border-brand-green-200';
      if (s === 'draft' || s === 'inactive') return 'bg-gray-100 text-gray-800 border-gray-200';
      if (s === 'out of stock') return 'bg-red-100 text-red-800 border-red-200';
      if (s === 'low stock') return 'bg-orange-100 text-orange-800 border-orange-200';
    }

    if (type === 'inquiry') {
      if (s === 'new') return 'bg-blue-100 text-blue-800 border-blue-200';
      if (s === 'contacted') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      if (s === 'quoted') return 'bg-purple-100 text-purple-800 border-purple-200';
      if (s === 'converted') return 'bg-green-100 text-green-800 border-green-200';
      if (s === 'closed') return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
      getStyles(),
      className
    )}>
      {status}
    </span>
  );
}
