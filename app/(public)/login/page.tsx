'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Wheat,
  Truck,
  Users2,
  Award,
  CheckCircle2,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { getPendingAction, clearPendingAction, PendingShoppingAction } from '@/lib/pending-action';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const setCustomer = useAuthStore((state) => state.setCustomer);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingShoppingAction | null>(null);
  const [isAuthRequiredNotice, setIsAuthRequiredNotice] = useState(false);

  useEffect(() => {
    // Check if there is an intent-preserved shopping action
    const pending = getPendingAction();
    if (pending) {
      setPendingAction(pending);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('notice') === 'auth_required') {
        setIsAuthRequiredNotice(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(`Welcome back, ${data.customer.name}!`);
        setCustomer(data.customer);

        // Resume intended shopping action
        const pending = getPendingAction();
        setTimeout(() => {
          if (pending) {
            if (pending.type === 'ADD_TO_CART') {
              addItem(pending.product);
              openCart();
              toast.success(`Added ${pending.product.quantity}x ${pending.product.name} to your cart!`);
              clearPendingAction();
              const target = pending.returnUrl || '/products/' + pending.product.slug;
              router.push(target);
            } else if (pending.type === 'BUY_NOW') {
              addItem(pending.product);
              toast.success(`Taking you to checkout for ${pending.product.name}...`);
              clearPendingAction();
              router.push('/checkout');
            }
          } else {
            const redirectParam = typeof window !== 'undefined'
              ? new URLSearchParams(window.location.search).get('redirect')
              : null;
            router.push(redirectParam || '/');
          }
          router.refresh();
        }, 1100);
      } else {
        setErrorMessage(data.message || 'Invalid email/mobile or password. Please try again.');
      }
    } catch (err) {
      console.error('Customer login network error:', err);
      setErrorMessage('Network connection error. Please verify your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-stretch">
      {/* LEFT COLUMN: Agricultural Hero Banner (Desktop Only) */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#12381f] via-[#1E5631] to-[#256a3c] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Subtle background overlay */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1592417817098-8f3d6910a451?w=1600&auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo & Tagline */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group cursor-pointer">
            <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-xl">
              🌱
            </span>
            <span className="font-heading font-black text-2xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              AGRO BASE
            </span>
          </Link>
          <p className="text-emerald-200/80 text-xs mt-1.5 font-medium tracking-wide uppercase">
            Agricultural & Industrial Commerce
          </p>
        </div>

        {/* Center: Mission Statement */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Wheat className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer & Dealer Portal</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-heading font-extrabold text-white leading-tight">
            Growing Businesses,<br />Empowering Agriculture.
          </h2>

          <p className="text-white/80 text-sm leading-relaxed max-w-md">
            Your trusted destination for agricultural products and solutions. Manage your wholesale orders, track supplies, and access verified farm equipment.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/15">
              <Truck className="w-5 h-5 text-amber-300 mb-1.5" />
              <p className="text-xs font-bold text-white">Wholesale Delivery</p>
              <p className="text-[11px] text-emerald-200/70">Direct from factory to farm</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/15">
              <ShieldCheck className="w-5 h-5 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold text-white">ISI Certified</p>
              <p className="text-[11px] text-emerald-200/70">High pressure tested pipes</p>
            </div>
          </div>
        </div>

        {/* Bottom: Sangli Badge */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/80">
          <span>Sangli, Maharashtra</span>
          <span>WhatsApp: +91 7249621323</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Login Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand-green-700 text-white flex items-center justify-center text-sm font-bold">
                🌱
              </span>
              <span className="font-heading font-black text-xl text-brand-green-800">
                AGRO BASE
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Your trusted destination for agricultural products and solutions.
            </p>
          </div>

          {/* Mandatory Shopping Authentication Notice */}
          {(pendingAction || isAuthRequiredNotice) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl mb-6 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-green-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-emerald-950">
                    Please log in or create an account to start shopping!
                  </p>
                  {pendingAction ? (
                    <div className="mt-1.5 p-2 bg-white rounded-lg border border-emerald-200 text-xs text-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {pendingAction.type === 'BUY_NOW' ? (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">Buy Now</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Cart Item</span>
                        )}
                        <span className="font-semibold truncate max-w-[170px]">{pendingAction.product.name}</span>
                        <span className="text-gray-400">×{pendingAction.product.quantity}</span>
                      </div>
                      <span className="font-bold text-brand-green-800">Preserved ✓</span>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-800 mt-1">
                      Authentication is required to add items to your cart and place orders.
                    </p>
                  )}

                  {/* Two Options: 1. Login (current) 2. Create Account */}
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-emerald-800 font-medium">New visitor?</span>
                    <Link
                      href="/signup?notice=auth_required"
                      className="px-2.5 py-1 bg-white border border-emerald-300 text-brand-green-800 font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Create Account Instead →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error & Success Alerts */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5 flex items-start gap-2.5 text-xs text-red-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl mb-5 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email or Mobile */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9822012345 or user@example.com"
                  required
                  className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-green-700 font-semibold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-11 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-green-700 border-gray-300 focus:ring-brand-green-600 cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium">Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#1E5631] hover:bg-[#164326] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transform active:scale-98"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Agro Base</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#1E5631] font-bold hover:underline cursor-pointer">
                Sign Up here
              </Link>
            </p>

            <div className="mt-4 pt-3 border-t border-dashed border-gray-100">
              <p className="text-[11px] text-gray-400">
                Are you an Agro Base Owner / Admin?{' '}
                <Link href="/admin/login" className="text-gray-600 font-semibold hover:underline cursor-pointer">
                  Owner Portal →
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
