import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_CUSTOMER_SECRET = process.env.JWT_SECRET || 'agro-base-customer-secret-key-2026';
export const CUSTOMER_COOKIE_NAME = 'customer-token';

export interface CustomerAuthPayload {
  customerId: string;
  name: string;
  phone: string;
  email: string | null;
  userType: string;
  businessName?: string | null;
  role: 'CUSTOMER';
}

export function generateCustomerToken(payload: CustomerAuthPayload, rememberMe: boolean = false): string {
  const expiresIn = rememberMe ? '30d' : '7d';
  return jwt.sign(payload, JWT_CUSTOMER_SECRET, { expiresIn });
}

export function verifyCustomerToken(token: string): CustomerAuthPayload | null {
  try {
    return jwt.verify(token, JWT_CUSTOMER_SECRET) as CustomerAuthPayload;
  } catch {
    return null;
  }
}

export function getCustomerFromRequest(request: NextRequest): CustomerAuthPayload | null {
  // 1. Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const payload = verifyCustomerToken(authHeader.slice(7));
    if (payload) return payload;
  }

  // 2. Check customer-token cookie
  const cookie = request.cookies.get(CUSTOMER_COOKIE_NAME);
  if (cookie?.value) {
    return verifyCustomerToken(cookie.value);
  }

  return null;
}
