'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, ShieldCheck, Truck, ArrowLeft, UserCheck, Lock } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { CartSummary } from '@/components/cart/CartSummary';
import { formatPrice, generateOrderWhatsAppMessage, generateOrderNumber } from '@/lib/utils';
import { checkoutSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, clearCart, subtotal, total } = useCartStore();
  const { customer, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      notes: '',
      paymentMethod: 'WHATSAPP',
    }
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Strict Authentication Guard: Redirect guests to login immediately
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout&notice=auth_required');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (customer) {
      const defaultAddr = customer.addresses?.find((a: any) => a.isDefault) || customer.addresses?.[0];
      reset({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: defaultAddr?.street || defaultAddr?.address || '',
        city: defaultAddr?.city || '',
        state: defaultAddr?.state || 'Maharashtra',
        pincode: defaultAddr?.pincode || '',
        paymentMethod: 'WHATSAPP',
      });
    }
  }, [customer, reset]);

  useEffect(() => {
    if (items.length === 0 && !isSuccess && !isLoading) {
      router.push('/cart');
    }
  }, [items.length, isSuccess, isLoading, router]);

  // While verifying auth or if guest, protect the page
  if (isLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 border-4 border-brand-green-200 border-t-brand-green-700 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Verifying Customer Authentication...</h2>
        <p className="text-sm text-gray-500 mt-1">
          Redirecting to login. Guests must sign in before checking out.
        </p>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return null;
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    const generatedOrderNum = generateOrderNumber();
    setOrderNumber(generatedOrderNum);
    setCustomerInfo({ name: data.name, phone: data.phone });

    // Save order strictly under authenticated customer in database
    try {
      const res = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: generatedOrderNum,
          subtotal: subtotal(),
          total: total(),
          notes: data.notes,
          paymentMethod: 'WhatsApp / Cash on Delivery',
          customerInfo: {
            name: data.name,
            phone: data.phone,
            email: data.email,
          },
          items: items.map(i => ({
            id: i.id,
            productId: i.id,
            quantity: i.quantity,
            price: i.discountPrice ?? i.price,
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error('Order creation error:', errData.message);
      }
    } catch (err) {
      console.warn('Could not save order directly in database:', err);
    }

    const rawNumber = SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '');
    const message = generateOrderWhatsAppMessage({
      items: items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.discountPrice ?? i.price,
      })),
      customerName: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state || 'Maharashtra',
      pincode: data.pincode,
      notes: data.notes,
      orderNumber: generatedOrderNum,
    });

    const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white rounded-2xl shadow-card p-8 sm:p-10 text-center max-w-lg w-full border border-gray-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-green-100 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <CheckCircle className="w-10 h-10 text-brand-green-700" />
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
            Order Sent to WhatsApp!
          </h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Your order details have been composed and sent directly to the Agro Base owner on WhatsApp.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-mono font-bold text-brand-green-800 text-sm">#{orderNumber}</span>
            </div>
            {customerInfo && (
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-semibold text-gray-800">{customerInfo.name} ({customerInfo.phone})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Owner Contact:</span>
              <span className="font-semibold text-gray-800">{SITE_CONFIG.whatsapp}</span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 mb-6 text-xs text-green-800 text-left flex items-start gap-2.5">
            <MessageCircle className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
            <span>The owner will review your order items and message you on WhatsApp to confirm delivery details and dispatch.</span>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full bg-brand-green-700 hover:bg-brand-green-800 py-6 text-base font-semibold">
              <Link href="/account?tab=orders">View Order in My Account</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full text-xs text-gray-500">
              <Link href="/products">Browse More Products</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-green-700">Home</Link>
        <span>&gt;</span>
        <Link href="/cart" className="hover:text-brand-green-700">Cart</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Checkout via WhatsApp</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Direct WhatsApp Order</h1>
          <p className="text-sm text-gray-500 mt-1">
            No online payment required. Your complete order and delivery details will be sent directly to the owner on WhatsApp.
          </p>
        </div>
      </div>

      {/* Authenticated user notification */}
      {customer && (
        <div className="mb-6 p-4 bg-brand-green-50/80 border border-brand-green-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-brand-green-700" />
            <div>
              <p className="text-xs font-bold text-brand-green-900">
                Ordering as {customer.name} ({customer.userType || 'Customer'})
              </p>
              <p className="text-[11px] text-brand-green-700">
                Your delivery details have been prefilled and this order will be saved to your dashboard.
              </p>
            </div>
          </div>
          <Link href="/account" className="text-xs font-semibold text-brand-green-800 hover:underline">
            Manage Account
          </Link>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Column */}
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-100">
            <input type="hidden" {...register('paymentMethod')} value="WHATSAPP" />
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-bold text-brand-dark font-heading flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-green-700" />
                Delivery Information
              </h2>
              <span className="text-xs text-brand-green-700 font-semibold bg-brand-green-50 px-2.5 py-1 rounded-full border border-brand-green-200">
                Direct to Owner
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                <input 
                  {...register('name')} 
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none text-sm" 
                  placeholder="e.g. Ramesh Patil" 
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">WhatsApp / Mobile Number *</label>
                <input 
                  {...register('phone')} 
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none text-sm" 
                  placeholder="10-digit mobile number" 
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-gray-700">Email Address (Optional)</label>
              <input 
                {...register('email')} 
                type="email" 
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none text-sm" 
                placeholder="ramesh@example.com" 
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-gray-700">Delivery Address *</label>
              <textarea 
                {...register('address')} 
                rows={3} 
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none resize-none text-sm" 
                placeholder="Village / Town, Farm location, House/Plot number, Landmark" 
              />
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">City / District *</label>
                <input 
                  {...register('city')} 
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none text-sm" 
                  placeholder="Sangli, Miraj, etc." 
                />
                {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State *</label>
                <select {...register('state')} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none bg-white text-sm">
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
                {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Pincode *</label>
                <input 
                  {...register('pincode')} 
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none text-sm" 
                  placeholder="e.g. 416416" 
                />
                {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Order Notes / Special Requirements (Optional)</label>
              <textarea 
                {...register('notes')} 
                rows={2} 
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green-700 outline-none resize-none text-sm" 
                placeholder="Pipe sizes, custom fittings, delivery vehicle accessibility, etc." 
              />
            </div>
          </form>
        </div>

        {/* Sidebar Summary Column */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24 border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900 font-heading">Order Summary</h3>
              <span className="text-xs text-gray-500">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
            </div>
            
            {/* Products List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                      <img 
                        src={item.image || '/placeholder.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592417817098-8f3d6910a451?w=100&auto=format&fit=crop&q=60';
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-brand-dark text-xs whitespace-nowrap ml-2">
                    {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <CartSummary />
            </div>

            {/* Payment & Order Method Note */}
            <div className="p-3.5 bg-green-50 rounded-xl border border-green-200 space-y-1 text-xs text-green-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>WhatsApp Order Process</span>
              </div>
              <p className="text-green-800 leading-relaxed text-[11px]">
                No payment is charged on this website. Clicking the button below sends your complete order directly to the owner on WhatsApp for immediate confirmation.
              </p>
            </div>
            
            <Button 
              type="submit" 
              form="checkout-form"
              disabled={isSubmitting} 
              className="w-full h-14 text-base font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{isSubmitting ? 'Composing...' : 'Send Order to Owner on WhatsApp'}</span>
            </Button>

            <div className="text-center">
              <Link href="/cart" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-green-700 transition-colors">
                <ArrowLeft size={14} /> Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
