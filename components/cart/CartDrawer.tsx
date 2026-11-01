'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, MessageCircle, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';
import { generateCartWhatsAppMessage, generateWhatsAppUrl } from '@/lib/utils';
import { toast } from 'sonner';

export function CartDrawer() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isOpen, setIsOpen, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleWhatsAppEnquiry = () => {
    if (!isAuthenticated) {
      setIsOpen(false);
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
      setIsOpen(false);
      toast.info('Please log in or create an account to proceed to checkout!');
      router.push('/login?redirect=/checkout&notice=auth_required');
    } else {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-heading font-bold text-gray-900">Your Cart</h2>
                  <p className="text-xs text-gray-500">{items.reduce((s, i) => s + i.quantity, 0)} total items</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">Your cart is empty</p>
                    <p className="text-xs text-gray-500 mt-1">Explore our pipes, fittings, and agriculture catalog</p>
                  </div>
                  <Button onClick={() => setIsOpen(false)} asChild className="bg-brand-green-700 hover:bg-brand-green-800 text-white">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50/90 space-y-3">
                <CartSummary />

                {/* WhatsApp Direct Ordering Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-green-800">
                  <span className="text-base">💬</span>
                  <div className="leading-tight">
                    <strong className="block">Direct WhatsApp Orders</strong>
                    <span>No online payment needed. Your order details will be sent directly to the owner.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Primary WhatsApp Order Button */}
                  <Button
                    type="button"
                    onClick={handleWhatsAppEnquiry}
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-6 flex items-center justify-center gap-2 text-base font-bold shadow-md transform hover:-translate-y-0.5 transition-all"
                  >
                    {!isAuthenticated ? <Lock className="w-5 h-5 text-amber-200" /> : <MessageCircle className="w-5 h-5 fill-white" />}
                    <span>Order via WhatsApp (Instant)</span>
                  </Button>

                  {/* Add Delivery Details Button */}
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-5 text-sm" 
                    onClick={handleCheckoutClick}
                    asChild
                  >
                    <Link href="/checkout" className="flex items-center justify-center gap-2">
                      {!isAuthenticated && <Lock className="w-4 h-4 text-amber-600" />}
                      <span>Add Delivery Address & Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="text-brand-green-700 font-semibold hover:underline"
                    >
                      View Detailed Cart
                    </Link>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
