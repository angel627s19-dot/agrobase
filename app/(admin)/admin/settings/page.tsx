'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully (Demo)');
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark font-heading">Settings</h1>
        <p className="text-gray-500 text-sm">Manage store configuration and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        <div className="flex border-b border-gray-200">
          {['General', 'Payments', 'Notifications', 'SEO'].map((tab, i) => (
            <button 
              key={tab} 
              className={`px-6 py-4 text-sm font-medium border-b-2 ${i === 0 ? 'border-brand-green-600 text-brand-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark border-b pb-2">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <Input defaultValue="Agro Base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <Input type="email" defaultValue="contact@sevlaniagro.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input defaultValue="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (For Inquiries)</label>
                  <Input defaultValue="+91 9876543210" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <textarea 
                  className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                  defaultValue="123 Agriculture Market, Near Main Highway, City Name, State - 123456"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark border-b pb-2">Store Preferences</h3>
              
              <div className="flex items-center justify-between max-w-md py-2 border-b">
                <div>
                  <div className="font-medium">Enable Guest Checkout</div>
                  <div className="text-sm text-gray-500">Allow users to buy without creating an account</div>
                </div>
                <input type="checkbox" className="w-4 h-4 text-brand-green-600 rounded" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between max-w-md py-2 border-b">
                <div>
                  <div className="font-medium">Enable Inquiry Mode</div>
                  <div className="text-sm text-gray-500">Show "Request Quote" instead of "Add to Cart" for products without prices</div>
                </div>
                <input type="checkbox" className="w-4 h-4 text-brand-green-600 rounded" defaultChecked />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-brand-green-700 hover:bg-brand-green-800 text-white px-8">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
