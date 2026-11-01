'use client';

import { create } from 'zustand';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  userType: string;
  businessName?: string | null;
  createdAt?: string;
  addresses?: any[];
  _count?: { orders: number };
}

interface AuthState {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCustomer: (customer: CustomerUser | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  isAuthenticated: false,
  isLoading: true,

  setCustomer: (customer) =>
    set({
      customer,
      isAuthenticated: !!customer,
      isLoading: false,
    }),

  checkAuth: async () => {
    try {
      const res = await fetch('/api/auth/customer/me', {
        method: 'GET',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.customer) {
          set({
            customer: data.customer,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
      set({ customer: null, isAuthenticated: false, isLoading: false });
    } catch (err) {
      set({ customer: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/customer/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    set({ customer: null, isAuthenticated: false, isLoading: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
}));
