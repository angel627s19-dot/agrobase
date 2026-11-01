import { NextResponse } from 'next/server';

export async function GET() {
  const orders = [
    { id: 'ORD-001', customerName: 'John Doe', total: 1500, status: 'PENDING', createdAt: new Date() }
  ];
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: { ...body, orderId: 'ORD-' + Date.now() } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
