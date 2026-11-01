'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { DashboardCharts } from '@/components/admin/DashboardCharts';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Package, FolderTree, ShoppingCart, MessageSquare, IndianRupee, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, Agro Base Owner. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Link href="/" target="_blank"><Button className="bg-brand-green-700 hover:bg-brand-green-800 cursor-pointer" size="sm">View Live Site</Button></Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Products" value="1,248" change={12} icon={Package} color="blue" />
        <StatsCard title="Categories" value="32" icon={FolderTree} color="purple" />
        <StatsCard title="Total Orders" value="846" change={5.4} icon={ShoppingCart} color="green" />
        <StatsCard title="New Inquiries" value="18" change={22} icon={MessageSquare} color="orange" />
        <StatsCard title="Total Revenue" value="₹4.2L" change={14} icon={IndianRupee} color="green" />
        <StatsCard title="Low Stock Items" value="12" change={-8} icon={AlertTriangle} color="red" />
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-brand-dark">Recent Orders</h3>
            <Link href="/admin/orders" className="text-brand-green-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <AdminTable>
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Order ID</th>
                <th className="px-4 py-3 font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: '#ORD-092', user: 'Rahul Sharma', amount: '₹12,450', status: 'processing' },
                { id: '#ORD-091', user: 'Priya Patel', amount: '₹4,890', status: 'pending' },
                { id: '#ORD-090', user: 'Amit Kumar', amount: '₹18,200', status: 'completed' },
                { id: '#ORD-089', user: 'Neha Gupta', amount: '₹2,100', status: 'completed' },
                { id: '#ORD-088', user: 'Vikram Singh', amount: '₹34,500', status: 'ready' },
              ].map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.user}</td>
                  <td className="px-4 py-3 font-medium">{order.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} type="order" />
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-brand-dark">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-brand-orange-500 text-sm font-medium hover:underline">View All</Link>
          </div>
          <AdminTable>
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">Subject</th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'Suresh Patel', subject: 'Bulk Tractor Parts', date: 'Today, 10:30 AM', status: 'new' },
                { name: 'Kisan Traders', subject: 'Pesticide Quotation', date: 'Yesterday', status: 'contacted' },
                { name: 'Ramesh Singh', subject: 'Irrigation System', date: '12 Sep 2026', status: 'quoted' },
                { name: 'Agro Foods', subject: 'Wholesale Seeds', date: '10 Sep 2026', status: 'converted' },
                { name: 'Deepak Verma', subject: 'Fertilizer Stock', date: '08 Sep 2026', status: 'closed' },
              ].map((inq, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{inq.name}</td>
                  <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{inq.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{inq.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inq.status} type="inquiry" />
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </div>
      </div>
    </AdminLayout>
  );
}
