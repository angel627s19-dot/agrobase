import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    return NextResponse.json({ success: true, data: { slug: params.slug, name: 'Sample Category' } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  return NextResponse.json({ success: true, message: 'Deleted' });
}
