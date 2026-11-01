import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCustomerFromRequest } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.customerAddress.findMany({
      where: { customerId: auth.customerId },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch addresses.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const address = body.address || body.street;
    const { city, state = 'Maharashtra', pincode, isDefault = false } = body;

    if (!address || !city || !pincode) {
      return NextResponse.json(
        { success: false, message: 'Address, city, and pincode are required.' },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { customerId: auth.customerId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.customerAddress.create({
      data: {
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        isDefault: Boolean(isDefault),
        customerId: auth.customerId,
      },
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to add address.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Address ID required.' }, { status: 400 });
    }

    await prisma.customerAddress.deleteMany({
      where: { id, customerId: auth.customerId },
    });

    return NextResponse.json({ success: true, message: 'Address removed.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to delete address.' }, { status: 500 });
  }
}
