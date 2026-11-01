import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateCustomerToken, CUSTOMER_COOKIE_NAME } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, rememberMe = false } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Email/Mobile number and password are required.' },
        { status: 400 }
      );
    }

    const rawId = String(identifier).trim();
    const cleanDigits = rawId.replace(/[^0-9]/g, '');
    const isMobile = cleanDigits.length >= 10;
    const phoneCandidate = cleanDigits.length > 10 ? cleanDigits.slice(-10) : cleanDigits;
    const emailCandidate = rawId.toLowerCase();

    // 1. Find customer by phone OR email
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          ...(isMobile ? [{ phone: phoneCandidate }] : []),
          { email: emailCandidate },
        ],
      },
    });

    if (!customer || !customer.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials. No account found matching this email or mobile number.',
        },
        { status: 401 }
      );
    }

    // 2. Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    // 3. Generate JWT Token
    const payload = {
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      userType: customer.userType,
      businessName: customer.businessName,
      role: 'CUSTOMER' as const,
    };

    const token = generateCustomerToken(payload, rememberMe);
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

    // 4. Return response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${customer.name}!`,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        userType: customer.userType,
        businessName: customer.businessName,
      },
      token,
    });

    response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error: any) {
    console.error('Customer login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during login. Please try again.' },
      { status: 500 }
    );
  }
}
