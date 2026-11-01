import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Mock Cloudinary upload
    return NextResponse.json({
      success: true,
      url: '/placeholder-product.jpg',
      public_id: 'mock_public_id_123'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
