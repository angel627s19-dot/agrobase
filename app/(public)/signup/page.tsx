'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Wheat,
  Truck,
  Users2,
  Award,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { getPendingAction, clearPendingAction, PendingShoppingAction } from '@/lib/pending-action';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const setCustomer = useAuthStore((state) => state.setCustomer);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [userType, setUserType] = useState('Farmer');
  const [terms, setTerms] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingShoppingAction | null>(null);
  const [isAuthRequiredNotice, setIsAuthRequiredNotice] = useState(false);

  useEffect(() => {
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

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const normalPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;
    if (normalPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!terms) {
      setErrorMessage('Please agree to the Terms and Conditions to proceed.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalPhone,
          email: email.trim() || undefined,
          password,
          confirmPassword,
          businessName: businessName.trim() || undefined,
          userType,
          terms,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Welcome to Agro Base! Your account has been created successfully.');
        setCustomer(data.customer);

        // Resume intended shopping action
        const pending = getPendingAction();
        setTimeout(() => {
          if (pending) {
            if (pending.type === 'ADD_TO_CART') {
              addItem(pending.product);
              openCart();
              toast.success(`Welcome! Added ${pending.product.quantity}x ${pending.product.name} to your cart.`);
              clearPendingAction();
              const target = pending.returnUrl || '/products/' + pending.product.slug;
              router.push(target);
            } else if (pending.type === 'BUY_NOW') {
              addItem(pending.product);
              toast.success(`Welcome! Proceeding to checkout for ${pending.product.name}...`);
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
        }, 1300);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration network error:', err);
      setErrorMessage('Network connection error. Please check your internet and try again.');
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
            <span>Direct Wholesale & Retail Platform</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-heading font-extrabold text-white leading-tight">
            Growing Businesses,<br />Empowering Agriculture.
          </h2>

          <p className="text-white/80 text-sm leading-relaxed max-w-md">
            Join thousands of agro dealers, farmers, distributors, and contractors. Get wholesale rates, genuine pipes, precision drip irrigation, and verified farm supplies delivered directly.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <Truck className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Direct Farm Delivery</div>
              <div className="text-xs text-white/70 mt-0.5">Prompt logistics across Maharashtra</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <Users2 className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-sm font-bold text-white">Dealer & Farmer Rates</div>
              <div className="text-xs text-white/70 mt-0.5">Wholesale tiered pricing</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">100% Genuine Supplies</div>
              <div className="text-xs text-white/70 mt-0.5">Certified brands (Kothari, Paras)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <Award className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-sm font-bold text-white">Technical Support</div>
              <div className="text-xs text-white/70 mt-0.5">Expert guidance for farm projects</div>
            </div>
          </div>
        </div>

        {/* Bottom: Support Contact */}
        <div className="relative z-10 text-xs text-emerald-200/80 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Sangli, Maharashtra 416416</span>
          <span className="font-semibold text-white">WhatsApp: +91 7249621323</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign Up Form Card */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-5 sm:p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="lg:hidden flex items-center gap-2 mb-3">
                <span className="text-xl">🌱</span>
                <span className="font-heading font-extrabold text-xl text-brand-green-700">AGRO BASE</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Join Agro Base to access member wholesale pricing, manage farm orders, and receive direct dispatches.
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
                      Registration is required before adding products to your cart and placing orders.
                    </p>
                  )}

                  {/* Two Options: 1. Login 2. Create Account (current) */}
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-emerald-800 font-medium">Already registered?</span>
                    <Link
                      href="/login?notice=auth_required"
                      className="px-2.5 py-1 bg-white border border-emerald-300 text-brand-green-800 font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Log In Instead →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">{successMessage}</div>
                  <div className="text-xs text-emerald-700 mt-0.5">Setting up your session and restoring shopping items...</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* User Type & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  I am a <span className="text-red-500">*</span>
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:bg-white focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none transition-all cursor-pointer"
                >
                  <option value="Farmer">Farmer (Individual / Cultivator)</option>
                  <option value="Dealer">Agro Dealer (Hardware / Pipes)</option>
                  <option value="Distributor">Distributor / Stockist</option>
                  <option value="Retailer">Retail Store Owner</option>
                  <option value="Wholesaler">Bulk Wholesaler</option>
                  <option value="Individual Customer">Individual Customer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    required
                    className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Used for order updates & login</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Business / Farm Name (Optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Business / Farm Name <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Patil Agro Agencies / Patil Farm"
                  className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-green-600 focus:ring-1 focus:ring-brand-green-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className={`w-full h-11 pl-10 pr-10 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-1 outline-none transition-all ${
                      confirmPassword && !passwordsMatch
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                        : 'border-gray-200 focus:border-brand-green-600 focus:ring-brand-green-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords do not match</p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                  className="w-4 h-4 mt-0.5 rounded text-brand-green-700 border-gray-300 focus:ring-brand-green-600 cursor-pointer"
                />
                <span className="text-xs text-gray-600 leading-snug">
                  I agree to the{' '}
                  <Link href="/terms" className="text-brand-green-700 font-semibold hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-brand-green-700 font-semibold hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  of Agro Base.
                </span>
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
                    <span>Creating Your Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Agro Base Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#1E5631] font-bold hover:underline cursor-pointer">
                Sign In here
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
