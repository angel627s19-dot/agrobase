'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Menu, Shield, User, LogOut, ChevronDown, Package, MapPin, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { MobileNav } from '@/components/layout/MobileNav';

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = useCartStore((state) => state.totalItems());
  const openCart = useCartStore((state) => state.openCart);

  const { customer, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [checkAuth]);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Brands', href: '/brands' },
    { name: 'Contact', href: '/contact' },
  ];

  const firstName = customer?.name ? customer.name.split(' ')[0] : 'Account';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/90 backdrop-blur-md py-2.5 shadow-sm border-b border-gray-100'
            : 'bg-white py-4 shadow-none'
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" prefetch={true} className="flex items-center gap-2 group">
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-brand-green-700 group-hover:text-brand-green-800 transition-colors">
                AGRO BASE
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  className="text-sm font-medium text-gray-700 hover:text-brand-green-700 transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-brand-green-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Shortcut */}
              <button
                onClick={() => router.push('/products')}
                className="p-2 text-gray-600 hover:text-brand-green-700 hover:bg-brand-green-50 rounded-full transition-colors hidden sm:block"
                aria-label="Search"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* WhatsApp Quick Chat */}
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-full text-xs font-semibold transition-colors"
                title="Chat on WhatsApp"
              >
                <span>WhatsApp</span>
              </a>

              {/* Customer Auth Actions (Hydration-Safe) */}
              {mounted && (
                isAuthenticated && customer ? (
                  /* Authenticated Customer Pill & Dropdown */
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-800 text-xs font-semibold border border-brand-green-200 transition-colors shadow-2xs"
                      aria-expanded={userDropdownOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-5 h-5 rounded-full bg-brand-green-700 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                        {customer.name ? customer.name[0] : 'U'}
                      </div>
                      <span className="max-w-[90px] truncate hidden sm:inline">{firstName}</span>
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-brand-green-700", userDropdownOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden"
                        >
                          {/* User Header */}
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-900 truncate">{customer.name}</p>
                            <p className="text-[11px] text-gray-500 truncate">{customer.email || customer.phone}</p>
                            <span className="inline-block mt-1.5 px-2 py-0.5 bg-brand-green-100 text-brand-green-800 text-[10px] font-medium rounded-full">
                              {customer.userType || 'Customer'}
                            </span>
                          </div>

                          {/* Menu Items */}
                          <Link
                            href="/account"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-800 transition-colors"
                          >
                            <UserCircle className="w-4 h-4 text-brand-green-700" />
                            <span>My Profile & Account</span>
                          </Link>

                          <Link
                            href="/account?tab=orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-800 transition-colors"
                          >
                            <Package className="w-4 h-4 text-brand-green-700" />
                            <span>My Orders</span>
                          </Link>

                          <Link
                            href="/account?tab=addresses"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-800 transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-brand-green-700" />
                            <span>Saved Addresses</span>
                          </Link>

                          <div className="border-t border-gray-100 my-1" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Unauthenticated Customer Buttons */
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Link
                      href="/login"
                      prefetch={true}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-brand-green-700 rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      prefetch={true}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-green-700 hover:bg-brand-green-800 rounded-lg shadow-2xs transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )
              )}

              {/* Owner Login Button (Dedicated Separate Portal) */}
              <Link
                href="/admin/login"
                prefetch={true}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-brand-green-700/20 text-brand-green-700 hover:bg-brand-green-50 text-xs font-semibold transition-all shadow-2xs"
                title="Owner Portal"
              >
                <Shield className="w-3.5 h-3.5 text-brand-green-700" />
                <span className="hidden md:inline">Owner Login</span>
                <span className="md:hidden">Owner</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="p-2 relative text-gray-700 hover:text-brand-green-700 hover:bg-brand-green-50 rounded-full transition-colors active:scale-95"
                aria-label="Shopping Cart"
                title="View Cart"
                suppressHydrationWarning
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-brand-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-gray-700 hover:text-brand-green-700 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
