'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    // Auth check
    if (pathname !== '/admin/login') {
      const token = document.cookie.includes('admin_token=') || localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  if (!isMounted) return null; // Prevent hydration mismatch
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:pl-[280px] flex flex-col min-h-screen transition-all duration-300">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
