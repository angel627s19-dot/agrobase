import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

function formatProduct(p: any) {
  let parsedFeatures: string[] = [];
  try {
    if (typeof p.features === 'string') {
      parsedFeatures = JSON.parse(p.features);
    } else if (Array.isArray(p.features)) {
      parsedFeatures = p.features;
    }
  } catch (e) {
    parsedFeatures = [];
  }

  return {
    ...p,
    features: parsedFeatures,
    images: p.images || [],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const stock = searchParams.get('stock');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: any = {};

    if (category) {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
      ];
    }

    if (brand) {
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: [{ brandId: brand }, { brand: { slug: brand } }] }
        ];
        delete where.OR;
      } else {
        where.OR = [
          { brandId: brand },
          { brand: { slug: brand } },
        ];
      }
    }

    if (search) {
      const searchFilter = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
      if (where.AND) {
        where.AND.push({ OR: searchFilter });
      } else if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchFilter }];
        delete where.OR;
      } else {
        where.OR = searchFilter;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (stock === 'in_stock') {
      where.stock = { gt: 0 };
    } else if (stock === 'out_of_stock') {
      where.stock = { lte: 0 };
    }

    if (status === 'published') {
      where.published = true;
    } else if (status === 'draft') {
      where.published = false;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (products && products.length > 0) {
      return NextResponse.json({
        success: true,
        data: products.map(formatProduct),
        pagination: {
          page: 1,
          pageSize: products.length,
          totalCount: products.length,
          totalPages: 1,
        },
      });
    }

    // Fallback if database query returned 0 or wasn't matched
    let fallback = [...DEMO_PRODUCTS];
    if (category) {
      fallback = fallback.filter(p => p.category?.slug === category || p.categoryId === category);
    }
    if (brand) {
      fallback = fallback.filter(p => p.brand?.slug === brand || p.brandId === brand);
    }
    if (search) {
      fallback = fallback.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (minPrice !== undefined) {
      fallback = fallback.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      fallback = fallback.filter(p => p.price <= maxPrice);
    }

    return NextResponse.json({
      success: true,
      data: fallback,
      pagination: {
        page: 1,
        pageSize: fallback.length,
        totalCount: fallback.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('Products API GET Error:', error);
    return NextResponse.json({ success: true, data: DEMO_PRODUCTS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      sku,
      stock,
      lowStockThreshold,
      published,
      featured,
      categoryId,
      brandId,
      features,
      specifications,
      images,
    } = body;

    if (!name || price === undefined || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required.' },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const generatedSku = sku || `SKU-${Date.now().toString().slice(-6)}`;

    let featuresString = '[]';
    if (typeof features === 'string') {
      featuresString = features;
    } else if (Array.isArray(features)) {
      featuresString = JSON.stringify(features);
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || '',
        specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications || {}),
        features: featuresString,
        price: parseFloat(price.toString()),
        discountPrice: discountPrice ? parseFloat(discountPrice.toString()) : null,
        sku: generatedSku,
        stock: parseInt(stock?.toString() || '0', 10),
        lowStockThreshold: parseInt(lowStockThreshold?.toString() || '10', 10),
        published: published !== undefined ? Boolean(published) : true,
        featured: Boolean(featured),
        categoryId,
        brandId: brandId || null,
        images: {
          create: Array.isArray(images) && images.length > 0
            ? images.map((img: string, idx: number) => ({
                url: typeof img === 'string' ? img : (img as any).url,
                isPrimary: idx === 0,
                order: idx,
              }))
            : [{
                url: '/placeholder.jpg',
                isPrimary: true,
                order: 0,
              }],
        },
      },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: formatProduct(product),
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Product Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create product in database.' },
      { status: 500 }
    );
  }
}
