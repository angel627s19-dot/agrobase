import React from 'react';
import { StatusBadge } from './StatusBadge';

export function AdminTableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {Array(columns).fill(0).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array(rows).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array(columns).fill(0).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full max-w-[120px]"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Minimal standard table component wrapper
export function AdminTable({ 
  children, 
  loading = false,
  columns = 5
}: { 
  children: React.ReactNode; 
  loading?: boolean;
  columns?: number;
}) {
  if (loading) return <AdminTableSkeleton columns={columns} />;
  
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
          {children}
        </table>
      </div>
    </div>
  );
}
