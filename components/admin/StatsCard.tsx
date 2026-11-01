import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'red';
}

const colorMap = {
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
};

export function StatsCard({ title, value, change, icon: Icon, color = 'green' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6 flex flex-col transition-shadow hover:shadow-card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-lg", colorMap[color])}>
          <Icon size={24} />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center text-sm font-medium px-2 py-1 rounded-full",
            change >= 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
          )}>
            {change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-heading font-semibold text-brand-dark mb-1">{value}</h3>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}
