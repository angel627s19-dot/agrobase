'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminCustomersPage() {
  const customers = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 9876543210', orders: 12, spend: '₹45,200', lastOrder: '12 Sep 2026' },
    { id: 2, name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 8765432109', orders: 3, spend: '₹8,400', lastOrder: '15 Sep 2026' },
    { id: 3, name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 7654321098', orders: 5, spend: '₹12,100', lastOrder: '18 Sep 2026' },
    { id: 4, name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 6543210987', orders: 1, spend: '₹2,100', lastOrder: '10 Sep 2026' },
    { id: 5, name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 5432109876', orders: 8, spend: '₹34,500', lastOrder: '16 Sep 2026' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Customers</h1>
          <p className="text-gray-500 text-sm">Manage your customer base</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b flex justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input className="pl-9 w-full" placeholder="Search customers..." />
          </div>
        </div>

        <AdminTable>
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 font-medium text-gray-500">Contact</th>
              <th className="px-4 py-3 font-medium text-gray-500">Orders</th>
              <th className="px-4 py-3 font-medium text-gray-500">Total Spend</th>
              <th className="px-4 py-3 font-medium text-gray-500">Last Order</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-brand-dark">{customer.name}</td>
                <td className="px-4 py-3">
                  <div className="text-sm">{customer.email}</div>
                  <div className="text-xs text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-4 py-3">{customer.orders}</td>
                <td className="px-4 py-3 font-medium">{customer.spend}</td>
                <td className="px-4 py-3 text-gray-500">{customer.lastOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminLayout>
  );
}
