'use client';

import type { CartItem } from '@/types';

export interface PendingShoppingAction {
  type: 'ADD_TO_CART' | 'BUY_NOW';
  product: CartItem;
  returnUrl?: string;
  timestamp: number;
}

const STORAGE_KEY = 'agro_pending_shopping_action';

export function savePendingAction(action: Omit<PendingShoppingAction, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const payload: PendingShoppingAction = {
    ...action,
    timestamp: Date.now(),
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save pending action:', err);
  }
}

export function getPendingAction(): PendingShoppingAction | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const action = JSON.parse(raw) as PendingShoppingAction;
    // Expire pending actions after 2 hours
    if (Date.now() - action.timestamp > 2 * 60 * 60 * 1000) {
      clearPendingAction();
      return null;
    }
    return action;
  } catch {
    return null;
  }
}

export function clearPendingAction(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear pending action:', err);
  }
}
