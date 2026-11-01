import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  return NextResponse.json({ success: true, data: { slug: params.slug, name: 'Sample Brand' } });
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  return NextResponse.json({ success: true, message: 'Deleted' });
}
