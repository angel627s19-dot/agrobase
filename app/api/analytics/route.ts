import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Analytics Event:', body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  const analyticsData = {
    totalSales: 150000,
    totalOrders: 145,
    topProducts: []
  };
  return NextResponse.json({ success: true, data: analyticsData });
}
