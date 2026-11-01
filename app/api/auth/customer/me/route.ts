import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCustomerFromRequest } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);

    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: auth.customerId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        userType: true,
        businessName: true,
        isVerified: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error: any) {
    console.error('Customer me error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to authenticate user.' },
      { status: 500 }
    );
  }
}
