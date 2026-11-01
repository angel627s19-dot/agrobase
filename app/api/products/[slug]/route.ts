import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

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

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug },
        ],
      },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (product) {
      return NextResponse.json({ success: true, data: formatProduct(product) });
    }

    const fallback = DEMO_PRODUCTS.find(p => p.slug === slug || p.id === slug);
    if (!fallback) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: fallback });
  } catch (error) {
    console.error('Fetch Product Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const body = await request.json();

    // Find existing product first
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug },
        ],
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Product not found to update' }, { status: 404 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price.toString());
    if (body.discountPrice !== undefined) {
      updateData.discountPrice = body.discountPrice ? parseFloat(body.discountPrice.toString()) : null;
    }
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock.toString(), 10);
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(body.lowStockThreshold.toString(), 10);
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.published !== undefined) updateData.published = Boolean(body.published);
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.categoryId) updateData.categoryId = body.categoryId;
    if (body.brandId !== undefined) updateData.brandId = body.brandId || null;
    if (body.specifications !== undefined) {
      updateData.specifications = typeof body.specifications === 'string' ? body.specifications : JSON.stringify(body.specifications);
    }
    if (body.features !== undefined) {
      updateData.features = typeof body.features === 'string' ? body.features : JSON.stringify(body.features);
    }

    // Handle images if provided
    if (Array.isArray(body.images) && body.images.length > 0) {
      // Remove previous images and create new
      await prisma.productImage.deleteMany({
        where: { productId: existing.id },
      });
      await prisma.productImage.createMany({
        data: body.images.map((img: string, idx: number) => ({
          productId: existing.id,
          url: typeof img === 'string' ? img : (img as any).url,
          isPrimary: idx === 0,
          order: idx,
        })),
      });
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully in database',
      data: formatProduct(updated),
    });
  } catch (error: any) {
    console.error('Update Product Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;

    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug },
        ],
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Product not found to delete' }, { status: 404 });
    }

    // Cascade delete images
    await prisma.productImage.deleteMany({
      where: { productId: existing.id },
    });

    await prisma.product.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product permanently deleted from database',
    });
  } catch (error: any) {
    console.error('Delete Product Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
