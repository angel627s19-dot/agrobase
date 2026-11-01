'use client';

import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';

export function CartSummary() {
  const { items } = useCartStore();
  
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 0; // Implement discount logic here if needed
  const total = subtotal - discount;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-brand-orange-500">
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold text-base pt-2 border-t">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
