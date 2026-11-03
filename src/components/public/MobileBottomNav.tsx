'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Calendar, Mail } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  // If in admin portal or admin login, do not show public bottom dock
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      name: 'Explore',
      href: '/category/news',
      icon: Compass,
      isActive: pathname.startsWith('/category') || pathname.startsWith('/tag'),
    },
    {
      name: 'Search',
      href: '/search',
      icon: Search,
      isActive: pathname === '/search',
    },
    {
      name: 'Summits',
      href: '/events',
      icon: Calendar,
      isActive: pathname.startsWith('/events'),
    },
    {
      name: 'Briefing',
      href: '/newsletter',
      icon: Mail,
      isActive: pathname === '/newsletter',
      badge: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] px-2 py-1.5"
      style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors relative ${
                item.isActive
                  ? 'text-[#0E7490] font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.isActive ? 'scale-110 text-[#0E7490]' : ''
                  }`}
                  strokeWidth={item.isActive ? 2.5 : 1.75}
                />
                {item.badge && !item.isActive && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
