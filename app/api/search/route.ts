import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';

    if (!q) {
      return NextResponse.json({ success: true, products: [], categories: [] });
    }

    let matchingProducts: any[] = [];
    let matchingCategories: any[] = [];

    try {
      const [dbProducts, dbCategories] = await Promise.all([
        prisma.product.findMany({
          where: {
            published: true,
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
              { brand: { name: { contains: q } } },
            ],
          },
          take: 8,
          include: {
            images: { take: 1, orderBy: { order: 'asc' } },
            category: { select: { name: true, slug: true } },
            brand: { select: { name: true, slug: true } },
          },
        }),
        prisma.category.findMany({
          where: {
            name: { contains: q },
          },
          take: 4,
          select: { name: true, slug: true },
        }),
      ]);

      matchingProducts = dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discountPrice: p.discountPrice,
        image: p.images[0]?.url || '/placeholder-product.jpg',
        category: p.category.name,
        categorySlug: p.category.slug,
        brand: p.brand?.name || null,
      }));

      matchingCategories = dbCategories;
    } catch (dbErr) {
      console.error('Database search error:', dbErr);
    }

    if (matchingProducts.length === 0) {
      const lower = q.toLowerCase();
      matchingProducts = DEMO_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.brand?.name.toLowerCase().includes(lower) ||
        p.category?.name.toLowerCase().includes(lower)
      ).slice(0, 8).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.discountPrice || p.price,
        discountPrice: p.discountPrice,
        image: p.images[0]?.url || '/placeholder-product.jpg',
        category: p.category.name,
        categorySlug: p.category.slug,
        brand: p.brand?.name || null,
      }));

      matchingCategories = DEMO_CATEGORIES.filter((c) =>
        c.name.toLowerCase().includes(lower)
      ).slice(0, 4).map((c) => ({
        name: c.name,
        slug: c.slug,
      }));
    }

    return NextResponse.json({
      success: true,
      products: matchingProducts,
      categories: matchingCategories,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ success: false, message: 'Search failed' }, { status: 500 });
  }
}
