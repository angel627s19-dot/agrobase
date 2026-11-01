'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('50');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('High durability, Agricultural grade, Weather resistant');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1592417817098-8f3d6910a451?w=800&auto=format&fit=crop&q=80'
  ]);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands')
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        
        if (catData.success && Array.isArray(catData.data)) {
          setCategories(catData.data);
          if (catData.data.length > 0) setCategoryId(catData.data[0].id);
        }
        if (brandData.success && Array.isArray(brandData.data)) {
          setBrands(brandData.data);
          if (brandData.data.length > 0) setBrandId(brandData.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories/brands:', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadMeta();
  }, []);

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
        sku: sku || `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: parseInt(stock, 10),
        lowStockThreshold: parseInt(lowStockThreshold, 10),
        categoryId,
        brandId: brandId || null,
        published,
        featured,
        features: featuresArray,
        images: images.length > 0 ? images : ['/placeholder.jpg'],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMessage(data.message || 'Failed to create product.');
      }
    } catch (err: any) {
      console.error('Error creating product:', err);
      setErrorMessage('Network connection error while saving product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark font-heading">Add New Product</h1>
            <p className="text-gray-500 text-sm">Create a new item in your store inventory</p>
          </div>
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
                placeholder="e.g. Kothari 63mm PVC Agri Pipe 6kg/cm� (6m)" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea 
                className="w-full min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500 text-sm"
                placeholder="Detailed technical and commercial product description..."
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
                placeholder="ISI Marked, High Tensile, UV Resistant" 
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Product Images</h2>
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
                  placeholder="e.g. 1450" 
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
                  placeholder="e.g. 1320" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
                <Input 
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Auto-generated if empty" 
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
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Classification</h2>
            
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
            <h2 className="text-base font-semibold text-brand-dark border-b pb-2">Visibility</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 block">Published</span>
                <span className="text-xs text-gray-500">Visible on storefront catalog</span>
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
                <span className="text-xs text-gray-500">Show in homepage featured grid</span>
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
              disabled={isSaving || loadingData}
              className="flex-1 bg-brand-green-700 hover:bg-brand-green-800 text-white font-semibold shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Save Product
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
