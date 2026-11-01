import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true, data: { id: params.id, status: 'PENDING', total: 1500 } });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: { id: params.id, ...body } });
}
