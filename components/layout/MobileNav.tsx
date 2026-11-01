'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Package, Grid, Info, ShieldCheck, PhoneCall, Shield, MessageCircle, UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth-store';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Grid },
  { name: 'Brands', href: '/brands', icon: ShieldCheck },
  { name: 'About Us', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: PhoneCall },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-heading font-extrabold text-lg text-brand-green-700 tracking-tight">
                AGRO BASE
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Auth Profile / Login Area */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              {isAuthenticated && customer ? (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-brand-green-700 text-white font-bold flex items-center justify-center text-sm uppercase shadow-xs">
                      {customer.name ? customer.name[0] : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{customer.name}</p>
                      <p className="text-xs text-gray-500 truncate">{customer.phone || customer.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-brand-green-100 text-brand-green-800 text-[10px] font-medium rounded-full">
                        {customer.userType || 'Customer'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-brand-green-50 hover:text-brand-green-700 transition-colors"
                    >
                      <UserCircle className="w-3.5 h-3.5 text-brand-green-700" />
                      <span>Account</span>
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-brand-green-50 hover:text-brand-green-700 transition-colors"
                    >
                      <Package className="w-3.5 h-3.5 text-brand-green-700" />
                      <span>Orders</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Welcome to Agro Base!</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs"
                    >
                      <LogIn className="w-4 h-4 text-brand-green-700" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-green-700 text-white rounded-xl text-xs font-bold hover:bg-brand-green-800 transition-colors shadow-2xs"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-3">
              <nav className="flex flex-col gap-1 px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={true}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-brand-green-700 hover:bg-brand-green-50 font-medium transition-colors"
                  >
                    <link.icon className="w-5 h-5 opacity-70" />
                    {link.name}
                  </Link>
                ))}

                <div className="my-2 border-t border-gray-100" />

                {/* Owner Login in Mobile Menu */}
                <Link
                  href="/admin/login"
                  prefetch={true}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-green-700 hover:bg-brand-green-50 font-semibold transition-colors bg-brand-green-50/50"
                >
                  <Shield className="w-5 h-5 text-brand-green-700" />
                  <span>Owner Portal Login</span>
                </Link>

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Bottom Contact */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-colors shadow-sm text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
              <p className="text-[11px] text-center text-gray-400">
                Sangli, Maharashtra • 4.6★ Google Rating
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
