import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCustomerFromRequest } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

// GET: Fetch authenticated customer orders
export async function GET(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { customerId: auth.customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('Fetch customer orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders.' },
      { status: 500 }
    );
  }
}

// POST: Save order from checkout - MANDATORY AUTHENTICATION ENFORCED
export async function POST(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);
    
    // Strict authentication enforcement: reject any unauthenticated/guest order
    if (!auth || !auth.customerId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required. Guests are not permitted to place orders. Please sign in or create an account.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderNumber, subtotal, total, notes, paymentMethod, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot place an empty order.' },
        { status: 400 }
      );
    }

    // Create Order with Items in transaction linked strictly to authenticated customer
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: orderNumber || `ORD-${Date.now()}`,
        subtotal: Number(subtotal) || 0,
        total: Number(total) || 0,
        notes: notes || null,
        paymentMethod: paymentMethod || 'WhatsApp / Cash on Delivery',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        customerId: auth.customerId,
        items: {
          create: (items || []).map((item: any) => ({
            productId: item.id || item.productId,
            quantity: item.quantity || 1,
            price: Number(item.discountPrice ?? item.price ?? 0),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order recorded successfully under your account.',
      order: newOrder,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create customer order error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to record order.' },
      { status: 500 }
    );
  }
}
