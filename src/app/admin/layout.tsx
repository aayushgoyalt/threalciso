import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  Shield,
  LayoutDashboard,
  FileText,
  FolderTree,
  Tag,
  Users,
  Calendar,
  Download,
  Mail,
  MessageSquare,
  Settings,
  UserCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { getSession } from '@/lib/auth';
import { AdminNavLogout } from '@/components/admin/AdminNavLogout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  const session = await getSession();

  // If user is on the login page, render children without sidebar
  if (!session) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  const isAdmin = session.role === 'admin';

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Authors', href: '/admin/authors', icon: Users },
    { name: 'Events & Summits', href: '/admin/events', icon: Calendar },
    { name: 'Resources', href: '/admin/resources', icon: Download },
    { name: 'Leads (CSV)', href: '/admin/leads', icon: Users },
    { name: 'Subscribers (CSV)', href: '/admin/subscribers', icon: Mail },
    { name: 'Inquiries Inbox', href: '/admin/messages', icon: MessageSquare },
  ];

  const adminOnlyItems = [
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
    { name: 'User Management', href: '/admin/users', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-[#0A2540] text-slate-300 flex flex-col justify-between shrink-0 hidden md:flex border-r border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" target="_blank" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded bg-cyan-600 text-white flex items-center justify-center font-bold text-sm">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-white font-serif-headline">
                  THEREAL<span className="text-cyan-400">CISO</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">Editorial Desk</span>
              </div>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-slate-400 hover:text-white"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5">
              Content Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4 text-cyan-400/80" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 mt-4">
                  Administration
                </div>
                {adminOnlyItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded hover:bg-slate-800/80 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4 text-rose-400/80" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">{session.name}</span>
              <span className="text-[11px] text-slate-400 block truncate">{session.email}</span>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                isAdmin ? 'bg-rose-900/60 text-rose-300' : 'bg-cyan-900/60 text-cyan-300'
              }`}
            >
              {session.role}
            </span>
          </div>

          <AdminNavLogout />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Management Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/articles/new"
              className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#123659] text-white text-xs font-semibold rounded transition-colors"
            >
              + Create Article
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-medium text-slate-600 hover:text-[#0A2540] flex items-center gap-1"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Child Pages Container */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

