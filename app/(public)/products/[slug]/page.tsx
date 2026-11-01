import { notFound } from 'next/navigation';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { ProductDetailClient } from './ProductDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

// React cache deduplicates the database query between generateMetadata and ProductDetailPage
const getProduct = cache(async (slug: string) => {
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        brand: true,
      },
    });
  } catch (err) {
    console.error('Error fetching product by slug:', err);
  }

  if (!product) {
    product = DEMO_PRODUCTS.find((p) => p.slug === slug) || null;
  }
  return product;
});

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.slug);

  if (!product) {
    return { title: 'Product Not Found | Agro Base' };
  }

  return {
    title: `${product.name} | Agro Base`,
    description: (product.description || '').slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  let parsedFeatures: string[] = [];
  try {
    parsedFeatures = typeof product.features === 'string' ? JSON.parse(product.features || '[]') : product.features || [];
  } catch {
    parsedFeatures = Array.isArray(product.features) ? product.features : [String(product.features)];
  }

  let parsedSpecs: Record<string, string> = {};
  try {
    parsedSpecs = typeof product.specifications === 'string' ? JSON.parse(product.specifications || '{}') : product.specifications || {};
  } catch {
    parsedSpecs = {};
  }

  const clientProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    discountPrice: product.discountPrice ?? null,
    stock: product.stock,
    features: parsedFeatures,
    specifications: parsedSpecs,
    category: {
      name: product.category?.name || 'General',
      slug: product.category?.slug || 'general',
    },
    brand: product.brand ? {
      name: product.brand.name,
      slug: product.brand.slug,
    } : null,
    images: (product.images && product.images.length > 0)
      ? product.images.map((img: any) => ({
          url: img.url,
          alt: img.alt || product.name,
        }))
      : [
          {
            url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910a451?w=800&auto=format&fit=crop&q=80',
            alt: product.name,
          },
        ],
  };

  return <ProductDetailClient product={clientProduct} />;
}
