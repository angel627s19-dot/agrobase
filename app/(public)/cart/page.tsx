'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MessageCircle, Lock, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';
import { generateCartWhatsAppMessage, generateWhatsAppUrl } from '@/lib/utils';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, clearCart } = useCartStore();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const handleWhatsAppOrder = () => {
    if (!isAuthenticated) {
      toast.info('Please log in or create an account to start shopping and placing orders!');
      router.push('/login?redirect=/checkout&notice=auth_required');
      return;
    }

    const rawNumber = SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '');
    const message = generateCartWhatsAppMessage(
      items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }))
    );
    const url = generateWhatsAppUrl(rawNumber, message);
    window.open(url, '_blank');
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info('Please log in or create an account to proceed to checkout!');
      router.push('/login?redirect=/checkout&notice=auth_required');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Cart</span>
      </div>

      <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
          <ShoppingBag className="w-24 h-24 text-gray-200 mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Explore our high-quality pipes, fittings, and irrigation solutions.</p>
          <Button size="lg" className="bg-brand-green-700 hover:bg-brand-green-800 text-white" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {mounted && !isAuthenticated && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Login required to place orders:</strong> Please sign in to proceed with checkout.
                  </span>
                </div>
                <Link 
                  href="/login?redirect=/checkout&notice=auth_required" 
                  className="px-3 py-1 bg-brand-green-700 text-white rounded-lg font-bold hover:bg-brand-green-800 transition-colors shadow-2xs"
                >
                  Sign In
                </Link>
              </div>
            )}

            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-4">
              <span className="font-semibold text-gray-700">{items.reduce((s, i) => s + i.quantity, 0)} Total Items</span>
              <button 
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear Cart
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[380px]">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Order Summary</h3>
              <CartSummary />

              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <span className="text-base">💬</span> Direct WhatsApp Ordering
                </div>
                <p>No online payment required. Orders are sent directly to the owner on WhatsApp for immediate confirmation and delivery.</p>
              </div>
              
              <div className="space-y-2.5 pt-2">
                <Button 
                  size="lg" 
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-6 text-base shadow-md flex items-center justify-center gap-2"
                  onClick={handleWhatsAppOrder}
                >
                  {mounted && !isAuthenticated ? (
                    <Lock className="w-5 h-5 text-amber-200" />
                  ) : (
                    <MessageCircle className="w-5 h-5 fill-white" />
                  )}
                  <span>Order via WhatsApp</span>
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-5 font-semibold"
                  onClick={handleCheckoutClick}
                  asChild
                >
                  <Link href="/checkout">
                    {mounted && !isAuthenticated && <Lock className="w-4 h-4 text-amber-600 mr-2" />}
                    <span>Add Delivery Address & Order</span>
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full text-xs text-gray-500" asChild>
                  <Link href="/products">← Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
