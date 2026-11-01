import { NextResponse } from 'next/server';

export async function GET() {
  const settings = {
    general: { siteName: 'Sevlani Agro', contactEmail: 'contact@sevlaniagro.com' },
    shipping: { freeShippingThreshold: 1000 }
  };
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, message: 'Settings updated', data: body });
}
