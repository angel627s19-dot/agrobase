import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { MobileFilters } from '@/components/products/MobileFilters';
import { SortDropdown } from '@/components/products/SortDropdown';
import { RotateCcw, PackageSearch, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products Catalogue | Agro Base',
  description: 'Browse high-quality pipes, fittings, irrigation hardware, spray hoses, valves, and agricultural supplies.',
};

interface Props {
  searchParams: {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    stock?: string;
    search?: string;
    sort?: string;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category, brand, minPrice, maxPrice, stock, search, sort } = searchParams;

  let products: Product[] = [];

  try {
    const where: Record<string, any> = {
      published: true,
    };

    if (category && category !== 'all') {
      where.category = { slug: category.toLowerCase() };
    }

    if (brand && brand !== 'all') {
      where.brand = { slug: brand.toLowerCase() };
    }

    if (stock === 'true') {
      where.stock = { gt: 0 };
    }

    const priceConditions: Record<string, number> = {};
    if (minPrice && !isNaN(Number(minPrice))) {
      priceConditions.gte = Number(minPrice);
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      priceConditions.lte = Number(maxPrice);
    }
    if (Object.keys(priceConditions).length > 0) {
      where.price = priceConditions;
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'featured') {
      orderBy = { featured: 'desc' };
    }

    const dbProducts = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        brand: true,
      },
    });

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p) => {
        let featuresArr: string[] = [];
        try {
          featuresArr = JSON.parse(p.features || '[]');
        } catch {
          featuresArr = [];
        }

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          specifications: p.specifications,
          features: Array.isArray(featuresArr) ? featuresArr : [],
          price: p.price,
          discountPrice: p.discountPrice,
          sku: p.sku,
          stock: p.stock,
          lowStockThreshold: p.lowStockThreshold,
          published: p.published,
          featured: p.featured,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          seoKeywords: [],
          categoryId: p.categoryId,
          brandId: p.brandId,
          category: {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
            description: p.category.description || '',
            image: p.category.image || '',
            icon: p.category.icon || '',
            parentId: null,
            order: p.category.order,
            isActive: p.category.isActive,
            parent: null,
            children: [],
            createdAt: p.category.createdAt.toISOString(),
            updatedAt: p.category.updatedAt.toISOString(),
          },
          brand: p.brand ? {
            id: p.brand.id,
            name: p.brand.name,
            slug: p.brand.slug,
            description: p.brand.description || '',
            logo: p.brand.logo || null,
            isActive: p.brand.isActive,
            createdAt: p.brand.createdAt.toISOString(),
            updatedAt: p.brand.updatedAt.toISOString(),
          } : null,
          images: p.images.map((img) => ({
            id: img.id,
            url: img.url,
            publicId: img.publicId,
            alt: img.alt || p.name,
            order: img.order,
            isPrimary: img.isPrimary,
            productId: p.id,
          })),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      });
    }
  } catch (err) {
    console.error('Prisma query error in ProductsPage:', err);
  }

  // Composable fallback filtering over DEMO_PRODUCTS if database had 0 matches or threw
  if (products.length === 0) {
    let filtered = [...DEMO_PRODUCTS];

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category?.slug.toLowerCase() === category.toLowerCase());
    }

    if (brand && brand !== 'all') {
      filtered = filtered.filter((p) => p.brand?.slug.toLowerCase() === brand.toLowerCase());
    }

    if (stock === 'true') {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    products = filtered;
  }

  const activeFilters = [
    search && { label: `Search: "${search}"`, key: 'search' },
    category && { label: `Category: ${category}`, key: 'category' },
    brand && { label: `Brand: ${brand}`, key: 'brand' },
    minPrice && { label: `Min ₹${minPrice}`, key: 'minPrice' },
    maxPrice && { label: `Max ₹${maxPrice}`, key: 'maxPrice' },
    stock === 'true' && { label: 'In Stock Only', key: 'stock' },
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
            Agricultural & Plumbing Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing <span className="font-bold text-gray-800">{products.length}</span> products
            {category && ` in ${category}`}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <MobileFilters />
          <SortDropdown />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs font-semibold text-gray-500">Active Filters:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-green-50 text-brand-green-800 border border-brand-green-200"
            >
              <span>{f.label}</span>
            </span>
          ))}
          <Link
            href="/products"
            prefetch={true}
            className="text-xs font-semibold text-brand-orange-600 hover:text-brand-orange-700 flex items-center gap-1 hover:underline ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </Link>
        </div>
      )}

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="flex items-start">
        <FilterSidebar />

        <div className="flex-1 w-full min-w-0">
          {products.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <PackageSearch className="w-8 h-8 text-brand-green-700" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-gray-900">No products found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  We couldn't find any products matching your current search or filter combination.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-5 py-2.5 rounded-xl bg-brand-green-700 hover:bg-brand-green-800 text-white font-semibold text-xs transition shadow-sm"
                >
                  Clear All Filters
                </Link>
                <Link
                  href="/categories"
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
