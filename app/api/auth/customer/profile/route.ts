import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getCustomerFromRequest } from '@/lib/customer-auth';

// Update personal details
export async function PUT(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, businessName, userType, email, phone } = body;

    const dataToUpdate: Record<string, any> = {};
    if (name && name.trim()) dataToUpdate.name = name.trim();
    if (businessName !== undefined) dataToUpdate.businessName = businessName ? businessName.trim() : null;
    if (userType) dataToUpdate.userType = userType;
    if (email !== undefined) dataToUpdate.email = email ? email.trim().toLowerCase() : null;

    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const normalizedPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;
      if (normalizedPhone.length === 10) {
        // check if phone is taken by another user
        const existing = await prisma.customer.findFirst({
          where: {
            phone: normalizedPhone,
            NOT: { id: auth.customerId },
          },
        });
        if (existing) {
          return NextResponse.json(
            { success: false, message: 'This mobile number is already in use by another account.' },
            { status: 400 }
          );
        }
        dataToUpdate.phone = normalizedPhone;
      }
    }

    const updated = await prisma.customer.update({
      where: { id: auth.customerId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        userType: true,
        businessName: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      customer: updated,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}

// Change Password
export async function POST(request: NextRequest) {
  try {
    const auth = getCustomerFromRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New passwords do not match.' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: auth.customerId },
    });

    if (!customer || !customer.password) {
      return NextResponse.json(
        { success: false, message: 'Customer account not found.' },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.customer.update({
      where: { id: customer.id },
      data: { password: hashed },
    });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to change password.' },
      { status: 500 }
    );
  }
}
