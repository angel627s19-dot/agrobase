import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, otp, newPassword, confirmPassword } = body;

    if (!identifier || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const rawId = String(identifier).trim();
    const cleanDigits = rawId.replace(/[^0-9]/g, '');
    const isMobile = cleanDigits.length >= 10;
    const phoneCandidate = cleanDigits.length > 10 ? cleanDigits.slice(-10) : cleanDigits;
    const emailCandidate = rawId.toLowerCase();

    // 1. Find customer by identifier
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          ...(isMobile ? [{ phone: phoneCandidate }] : []),
          { email: emailCandidate },
        ],
      },
    });

    if (!customer || !customer.resetToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid reset request or no active code found.' },
        { status: 400 }
      );
    }

    // 2. Check if code matches
    if (customer.resetToken.trim() !== String(otp).trim()) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // 3. Check expiration
    if (customer.resetTokenExpiry && new Date() > new Date(customer.resetTokenExpiry)) {
      return NextResponse.json(
        { success: false, message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // 4. Hash new password & update
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error resetting password. Please try again.' },
      { status: 500 }
    );
  }
}
