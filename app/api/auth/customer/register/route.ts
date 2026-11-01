import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateCustomerToken, CUSTOMER_COOKIE_NAME } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      password,
      confirmPassword,
      businessName,
      userType = 'Farmer',
      terms,
    } = body;

    // 1. Basic validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Full name is required.' },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const normalizedPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;

    if (!normalizedPhone || normalizedPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    if (!terms) {
      return NextResponse.json(
        { success: false, message: 'You must accept the Terms and Conditions to register.' },
        { status: 400 }
      );
    }

    // 2. Check for duplicate phone
    const existingPhone = await prisma.customer.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existingPhone && existingPhone.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this mobile number is already registered. Please sign in instead.',
        },
        { status: 409 }
      );
    }

    // 3. Check for duplicate email (if provided)
    if (cleanEmail) {
      const existingEmail = await prisma.customer.findFirst({
        where: { email: cleanEmail },
      });

      if (existingEmail && existingEmail.password && existingEmail.phone !== normalizedPhone) {
        return NextResponse.json(
          {
            success: false,
            message: 'An account with this email address is already registered. Please sign in instead.',
          },
          { status: 409 }
        );
      }
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create or update customer in database
    let customer;
    if (existingPhone) {
      customer = await prisma.customer.update({
        where: { id: existingPhone.id },
        data: {
          name: name.trim(),
          email: cleanEmail || existingPhone.email,
          password: hashedPassword,
          businessName: businessName?.trim() || existingPhone.businessName,
          userType: userType || existingPhone.userType || 'Farmer',
          isVerified: true,
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          name: name.trim(),
          phone: normalizedPhone,
          email: cleanEmail || null,
          password: hashedPassword,
          businessName: businessName?.trim() || null,
          userType: userType || 'Farmer',
          isVerified: true,
        },
      });
    }

    // 6. Generate JWT Session Token
    const payload = {
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      userType: customer.userType,
      businessName: customer.businessName,
      role: 'CUSTOMER' as const,
    };

    const token = generateCustomerToken(payload, true);

    // 7. Set HTTP-Only Cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Welcome to Agro Base! Your account has been created successfully.',
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          userType: customer.userType,
          businessName: customer.businessName,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
