import { NextResponse } from 'next/server';

export async function GET() {
  const customers = [
    { id: '1', name: 'John Doe', phone: '9876543210', totalSpend: 5000, orderCount: 3 }
  ];
  return NextResponse.json({ success: true, data: customers });
}
