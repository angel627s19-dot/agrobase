import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier } = body;

    if (!identifier || !String(identifier).trim()) {
      return NextResponse.json(
        { success: false, message: 'Please enter your registered mobile number or email address.' },
        { status: 400 }
      );
    }

    const rawId = String(identifier).trim();
    const cleanDigits = rawId.replace(/[^0-9]/g, '');
    const isMobile = cleanDigits.length >= 10;
    const phoneCandidate = cleanDigits.length > 10 ? cleanDigits.slice(-10) : cleanDigits;
    const emailCandidate = rawId.toLowerCase();

    // 1. Check if user exists in database
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          ...(isMobile ? [{ phone: phoneCandidate }] : []),
          { email: emailCandidate },
        ],
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: 'No registered Agro Base account found with this email or mobile number.',
        },
        { status: 404 }
      );
    }

    // 2. Generate secure 6-digit verification code & token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // 3. Save to database
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        resetToken: otp,
        resetTokenExpiry: expiry,
      },
    });

    // 4. Return success response (includes code for immediate user testing & simulation)
    return NextResponse.json({
      success: true,
      message: `A password recovery verification code has been generated for ${customer.phone ? '+91 ' + customer.phone : customer.email}.`,
      identifier: customer.phone || customer.email,
      otp, // Provided for instant testing
      expiresInMinutes: 15,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing password recovery. Please try again.' },
      { status: 500 }
    );
  }
}
