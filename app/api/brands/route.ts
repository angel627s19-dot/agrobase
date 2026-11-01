import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEMO_BRANDS } from '@/lib/demo-data';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (brands && brands.length > 0) {
      const formatted = brands.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description,
        logo: b.logo,
        isActive: b.isActive,
        productCount: b._count.products,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: DEMO_BRANDS });
  } catch (error) {
    console.error('Brands GET error:', error);
    return NextResponse.json({ success: true, data: DEMO_BRANDS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: body.description || '',
        logo: body.logo || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });
    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    console.error('Brands POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create brand' }, { status: 500 });
  }
}
