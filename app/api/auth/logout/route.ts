import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  // Clear HTTP-only auth cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  // Also clear legacy admin_token cookie if present
  response.cookies.set({
    name: 'admin_token',
    value: '',
    expires: new Date(0),
    path: '/',
  });

  return response;
}
