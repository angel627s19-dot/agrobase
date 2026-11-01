'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminCategoriesPage() {
  const categories = [
    { id: 1, name: 'Fertilizers', slug: 'fertilizers', productsCount: 45, status: 'active', order: 1 },
    { id: 2, name: 'Seeds', slug: 'seeds', productsCount: 120, status: 'active', order: 2 },
    { id: 3, name: 'Pesticides', slug: 'pesticides', productsCount: 38, status: 'active', order: 3 },
    { id: 4, name: 'Machinery Parts', slug: 'machinery-parts', productsCount: 85, status: 'active', order: 4 },
    { id: 5, name: 'Irrigation', slug: 'irrigation', productsCount: 24, status: 'inactive', order: 5 },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Categories</h1>
          <p className="text-gray-500 text-sm">Manage product categories</p>
        </div>
        <Button className="bg-brand-green-700 hover:bg-brand-green-800 w-full sm:w-auto">
          <Plus size={16} className="mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b flex justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input className="pl-9 w-full" placeholder="Search categories..." />
          </div>
        </div>

        <AdminTable>
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="px-4 py-3 font-medium text-gray-500">Products</th>
              <th className="px-4 py-3 font-medium text-gray-500">Order</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-brand-dark">{category.name}</td>
                <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                <td className="px-4 py-3">{category.productsCount}</td>
                <td className="px-4 py-3">{category.order}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={category.status} type="product" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminLayout>
  );
}
