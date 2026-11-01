'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, Loader2, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [deleteModalItem, setDeleteModalItem] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteModalItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteModalItem.slug || deleteModalItem.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== deleteModalItem.id));
        setActionMessage({ type: 'success', text: `Product "${deleteModalItem.name}" deleted successfully.` });
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to delete product.' });
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setActionMessage({ type: 'error', text: 'Error communicating with server.' });
    } finally {
      setIsDeleting(false);
      setDeleteModalItem(null);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTab === 'All') return true;
    if (selectedTab === 'Published') return product.published === true;
    if (selectedTab === 'Draft') return product.published === false;
    if (selectedTab === 'Low Stock') return product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);
    if (selectedTab === 'Out of Stock') return product.stock <= 0;

    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark font-heading">Products Catalog</h1>
          <p className="text-gray-500 text-sm">Real-time inventory and storefront catalog management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchProducts} 
            disabled={loading}
            className="border-gray-300"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Link href="/admin/products/new">
            <Button className="bg-brand-green-700 hover:bg-brand-green-800 text-white shadow-sm">
              <Plus size={16} className="mr-2" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className={`mb-4 p-4 rounded-lg flex items-center justify-between text-sm font-medium ${
          actionMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs underline ml-4">Dismiss</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['All', 'Published', 'Draft', 'Low Stock', 'Out of Stock'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                  selectedTab === tab 
                    ? 'bg-brand-green-700 text-white shadow-sm' 
                    : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-white h-9 text-sm" 
              placeholder="Search by name, SKU, brand..." 
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-green-700" />
            <p className="text-sm font-medium">Loading catalog from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-base font-semibold text-gray-700">No products found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search query or tab filters</p>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="mt-4">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <AdminTable>
            <thead className="bg-gray-50/80 border-b text-xs uppercase font-semibold tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left w-16">Image</th>
                <th className="px-4 py-3 text-left">Product Details</th>
                <th className="px-4 py-3 text-left">Category & Brand</th>
                <th className="px-4 py-3 text-left">Price (?)</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.map((product) => {
                const imgUrl = product.images?.[0]?.url || product.img || '/placeholder.jpg';
                const statusStr = !product.published ? 'draft' : product.stock <= 0 ? 'out of stock' : product.stock <= (product.lowStockThreshold || 10) ? 'low stock' : 'published';

                return (
                  <tr key={product.id} className="hover:bg-brand-green-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border overflow-hidden flex items-center justify-center relative">
                        <img 
                          src={imgUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592417817098-8f3d6910a451?w=100&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-brand-dark leading-snug">{product.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-700">{product.category?.name || 'General'}</div>
                      <div className="text-xs text-brand-green-700 font-semibold">{product.brand?.name || 'Agro Base'}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-dark">
                      ?{Number(product.price).toLocaleString('en-IN')}
                      {product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">
                          ?{Number(product.discountPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.stock <= 0 ? 'text-red-600 font-bold' : product.stock <= (product.lowStockThreshold || 10) ? 'text-amber-600 font-bold' : 'text-gray-700'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={statusStr} type="product" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link 
                          href={`/products/${product.slug || product.id}`} 
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-brand-green-700 hover:bg-brand-green-50 rounded transition-colors" 
                          title="View on Storefront"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <button 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteModalItem(product)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" 
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </AdminTable>
        )}
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>
            Showing <span className="font-semibold text-gray-700">{filteredProducts.length}</span> of <span className="font-semibold text-gray-700">{products.length}</span> products in database
          </div>
          <div className="text-gray-400">
            Instant sync with storefront
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center font-heading">Delete Product</h3>
            <p className="text-sm text-gray-600 text-center mt-2">
              Are you sure you want to permanently delete <strong className="text-gray-900">"{deleteModalItem.name}"</strong>? This will remove it from the online catalog and database.
            </p>
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1 border-gray-300"
                disabled={isDeleting}
                onClick={() => setDeleteModalItem(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
