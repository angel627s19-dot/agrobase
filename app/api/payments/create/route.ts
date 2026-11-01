import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items, customer } = await request.json();
    
    // Calculate total amount
    const amount = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    
    // Mock Razorpay Order Creation
    // In a real app:
    // const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await instance.orders.create({ amount: amount * 100, currency: "INR", receipt: "receipt#1" });
    
    const mockOrderId = 'order_' + Math.random().toString(36).substring(2, 15);
    
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amount * 100,
      currency: 'INR'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create payment order' }, { status: 500 });
  }
}
