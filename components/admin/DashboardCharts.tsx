'use client';

import React from 'react';
// Simulating recharts since we might not have it installed
// In a real scenario, this would use Recharts components

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Revenue */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
        <h3 className="font-semibold text-brand-dark mb-4">Revenue Overview (Last 30 Days)</h3>
        <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-gray-200 pt-4 pb-0 pl-2">
          {/* Mock bars */}
          {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="w-full bg-brand-green-700/80 hover:bg-brand-green-700 rounded-t-sm transition-all relative group" style={{ height: `${h}%` }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                ₹{h * 1000}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      {/* Chart 2: Order Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
        <h3 className="font-semibold text-brand-dark mb-4">Order Status Distribution</h3>
        <div className="h-64 flex items-center justify-center relative">
          {/* Mock Pie Chart via CSS */}
          <div className="w-48 h-48 rounded-full" 
               style={{ 
                 background: 'conic-gradient(#1E5631 0% 45%, #FF8C00 45% 70%, #3B82F6 70% 85%, #EF4444 85% 100%)' 
               }}>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
              <span className="text-2xl font-bold text-brand-dark">128</span>
              <span className="text-xs text-gray-500 uppercase font-medium">Total Orders</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-[#1E5631] mr-1"></span> Delivered (45%)</div>
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-[#FF8C00] mr-1"></span> Processing (25%)</div>
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-[#3B82F6] mr-1"></span> Pending (15%)</div>
          <div className="flex items-center text-xs"><span className="w-3 h-3 rounded-full bg-[#EF4444] mr-1"></span> Cancelled (15%)</div>
        </div>
      </div>
    </div>
  );
}
