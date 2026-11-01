'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Save, Trash2, Loader2, AlertCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [productSlug, setProductSlug] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('0');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catRes, brandRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
          fetch(`/api/products/${productId}`)
        ]);

        const catData = await catRes.json();
        const brandData = await brandRes.json();
        const prodData = await prodRes.json();

        if (catData.success && Array.isArray(catData.data)) {
          setCategories(catData.data);
        }
        if (brandData.success && Array.isArray(brandData.data)) {
          setBrands(brandData.data);
        }

        if (prodData.success && prodData.data) {
          const p = prodData.data;
          setName(p.name || '');
          setProductSlug(p.slug || p.id);
          setDescription(p.description || '');
          setPrice(p.price?.toString() || '');
          setDiscountPrice(p.discountPrice ? p.discountPrice.toString() : '');
          setSku(p.sku || '');
          setStock(p.stock !== undefined ? p.stock.toString() : '0');
          setLowStockThreshold(p.lowStockThreshold ? p.lowStockThreshold.toString() : '10');
          setCategoryId(p.categoryId || p.category?.id || '');
          setBrandId(p.brandId || p.brand?.id || '');
          setPublished(p.published !== undefined ? p.published : true);
          setFeatured(Boolean(p.featured));

          if (Array.isArray(p.features)) {
            setFeaturesInput(p.features.join(', '));
          } else if (typeof p.features === 'string') {
            try {
              const parsed = JSON.parse(p.features);
              setFeaturesInput(Array.isArray(parsed) ? parsed.join(', ') : p.features);
            } catch {
              setFeaturesInput(p.features);
            }
          }

          if (Array.isArray(p.images) && p.images.length > 0) {
            setImages(p.images.map((img: any) => typeof img === 'string' ? img : img.url));
          } else if (p.img) {
            setImages([p.img]);
          } else {
            setImages(['/placeholder.jpg']);
          }
        } else {
          setErrorMessage('Product not found.');
        }
      } catch (err) {
        console.error('Failed to load product for editing:', err);
        setErrorMessage('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSaving(true);

    try {
      const featuresArray = featuresInput
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      const payload = {
        name,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        sku,
        stock: parseInt(stock, 10),
        lowStockThreshold: parseInt(lowStockThreshold, 10),
        categoryId,
        brandId: brandId || null,
        published,
        featured,
        features: featuresArray,
        images: images.length > 0 ? images : ['/placeholder.jpg'],
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMessage(data.message || 'Failed to update product.');
      }
    } catch (err: any) {
      console.error('Error updating product:', err);
      setErrorMessage('Network error while saving updates.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMessage(data.message || 'Failed to delete product.');
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setErrorMessage('Network error while deleting product.');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green-700 mb-3" />
          <p className="text-sm font-medium">Loading product details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-heading">Edit Product</h1>
            <p className="text-gray-500 text-sm">Dashboard / Products / Edit / {name || productId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {productSlug && (
            <Link
              href={`/products/${productSlug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={16} /> View on Store
            </Link>
          )}
          <Button 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" 
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <Input 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea 
                className="w-full min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features / Key Highlights (comma separated)</label>
              <Input 
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Media & Gallery</h2>
            <ImageUploader images={images} onChange={setImages} maxImages={5} />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (?) *</label>
                <Input 
                  type="number" 
                  required 
                  min="0" 
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale / Discount Price (?)</label>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <Input 
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <Input 
                  type="number" 
                  min="0" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                <Input 
                  type="number" 
                  min="0" 
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Organization</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select 
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500 text-sm bg-white"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select 
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500 text-sm bg-white"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
              >
                <option value="">Select Brand (Optional)</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Status</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 block">Published</span>
                <span className="text-xs text-gray-500">Live on storefront</span>
              </div>
              <input 
                type="checkbox" 
                className="w-4 h-4 text-brand-green-600 rounded" 
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 block">Featured Product</span>
                <span className="text-xs text-gray-500">Featured in homepage showcase</span>
              </div>
              <input 
                type="checkbox" 
                className="w-4 h-4 text-brand-green-600 rounded" 
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 bg-brand-green-700 hover:bg-brand-green-800 text-white font-semibold shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Update Product
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center font-heading">Delete Product</h3>
            <p className="text-sm text-gray-600 text-center mt-2">
              Are you sure you want to permanently delete <strong className="text-gray-900">"{name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1 border-gray-300"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
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
