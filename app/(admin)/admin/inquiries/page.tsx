'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminInquiriesPage() {
  const inquiries = [
    { id: 1, name: 'Suresh Patel', business: 'Patel Farms', phone: '+91 9876543210', products: 'Bulk Tractor Parts', status: 'new', date: 'Today, 10:30 AM' },
    { id: 2, name: 'Kisan Traders', business: 'Wholesale', phone: '+91 8765432109', products: 'Pesticide Quotation', status: 'contacted', date: 'Yesterday' },
    { id: 3, name: 'Ramesh Singh', business: 'Singh Agriculture', phone: '+91 7654321098', products: 'Irrigation System', status: 'quoted', date: '12 Sep 2026' },
    { id: 4, name: 'Agro Foods', business: 'Retailer', phone: '+91 6543210987', products: 'Wholesale Seeds', status: 'converted', date: '10 Sep 2026' },
    { id: 5, name: 'Deepak Verma', business: 'Individual', phone: '+91 5432109876', products: 'Fertilizer Stock', status: 'closed', date: '08 Sep 2026' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Inquiries</h1>
          <p className="text-gray-500 text-sm">Manage B2B and product inquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['All', 'New', 'Contacted', 'Quoted', 'Converted', 'Closed'].map((tab, i) => (
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
            <Input className="pl-9 w-full" placeholder="Search inquiries..." />
          </div>
        </div>

        <AdminTable>
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Contact</th>
              <th className="px-4 py-3 font-medium text-gray-500">Business</th>
              <th className="px-4 py-3 font-medium text-gray-500">Inquiry About</th>
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-brand-dark">{inq.name}</div>
                  <div className="text-xs text-gray-500">{inq.phone}</div>
                </td>
                <td className="px-4 py-3">{inq.business}</td>
                <td className="px-4 py-3 text-gray-600">{inq.products}</td>
                <td className="px-4 py-3 text-sm">{inq.date}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={inq.status} type="inquiry" />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" className="mr-2">WhatsApp</Button>
                  <Button variant="outline" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminLayout>
  );
}
