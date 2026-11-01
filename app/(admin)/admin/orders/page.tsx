'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminOrdersPage() {
  const orders = [
    { id: '#ORD-1045', date: '18 Sep 2026, 14:30', customer: 'Ramesh Patel', phone: '+91 9876543210', items: 3, total: '₹14,500', payment: 'paid', status: 'processing' },
    { id: '#ORD-1044', date: '18 Sep 2026, 11:15', customer: 'Suresh Singh', phone: '+91 8765432109', items: 1, total: '₹2,100', payment: 'pending', status: 'pending' },
    { id: '#ORD-1043', date: '17 Sep 2026, 16:45', customer: 'Agro Farms Ltd', phone: '+91 7654321098', items: 12, total: '₹45,000', payment: 'paid', status: 'ready' },
    { id: '#ORD-1042', date: '17 Sep 2026, 09:20', customer: 'Kisan Traders', phone: '+91 6543210987', items: 5, total: '₹8,400', payment: 'paid', status: 'completed' },
    { id: '#ORD-1041', date: '16 Sep 2026, 18:05', customer: 'Vikram Sharma', phone: '+91 5432109876', items: 2, total: '₹3,200', payment: 'failed', status: 'cancelled' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Orders</h1>
          <p className="text-gray-500 text-sm">Manage customer orders and fulfillment</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['All Orders', 'Pending', 'Processing', 'Ready', 'Completed', 'Cancelled'].map((tab, i) => (
              <button 
                key={tab} 
                className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap ${i === 0 ? 'bg-brand-green-50 text-brand-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input className="pl-9 w-full" placeholder="Search order ID or name..." />
          </div>
        </div>

        <AdminTable>
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Order ID & Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Customer</th>
              <th className="px-4 py-3 font-medium text-gray-500">Items</th>
              <th className="px-4 py-3 font-medium text-gray-500">Total Amount</th>
              <th className="px-4 py-3 font-medium text-gray-500">Payment</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3">
                  <div className="font-medium text-brand-dark">{order.id}</div>
                  <div className="text-xs text-gray-500">{order.date}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.phone}</div>
                </td>
                <td className="px-4 py-3">{order.items} items</td>
                <td className="px-4 py-3 font-semibold">{order.total}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.payment} type="payment" />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} type="order" />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1 to 5 of 846 orders</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
