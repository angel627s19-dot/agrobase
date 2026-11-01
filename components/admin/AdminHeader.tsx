'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<{ name?: string; role?: string; username?: string }>({
    name: 'Agro Base Owner',
    role: 'OWNER',
    username: 'AGRO',
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name && parsed.name.includes('Sevlani')) {
          parsed.name = 'Agro Base Owner';
          localStorage.setItem('admin_user', JSON.stringify(parsed));
        }
        setUser(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);
  
  const breadcrumbs = pathname.split('/').filter(Boolean);
  const displayName = 'Agro Base Owner';
  const roleName = user.role || 'OWNER';
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 px-6 backdrop-blur shadow-sm">
      <button 
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-500 hover:text-gray-700 cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>
      
      <div className="flex-1">
        <h1 className="text-lg font-medium text-brand-dark hidden sm:block capitalize">
          {breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1].replace(/-/g, ' ') : 'Dashboard'}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" title="Notifications">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-orange-500"></span>
        </button>
        
        {/* Right Corner Owner Badge & Logo Avatar */}
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-brand-dark tracking-tight">{displayName}</span>
            <span className="text-xs text-brand-green-700 font-semibold uppercase">{roleName}</span>
          </div>
          <div 
            className="h-9 w-9 rounded-full bg-[#1E5631] flex items-center justify-center text-white font-black text-sm shadow-sm border border-white/20 select-none"
            title="Agro Base Owner"
          >
            A
          </div>
        </div>
      </div>
    </header>
  );
}
