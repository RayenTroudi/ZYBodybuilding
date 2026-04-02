'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import {
  LayoutDashboard, Users, UserCog, CreditCard, ClipboardList,
  Dumbbell, GraduationCap, Calendar, Mail, Settings,
  Globe, LogOut, Menu,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    router.push('/admin/ironcore/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Members', href: '/admin/members', icon: UserCog },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Plans', href: '/admin/plans', icon: ClipboardList },
    { name: 'Programs', href: '/admin/programs', icon: Dumbbell },
    { name: 'Trainers', href: '/admin/trainers', icon: GraduationCap },
    { name: 'Classes', href: '/admin/classes', icon: Calendar },
    { name: 'Email', href: '/admin/email', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (pathname === '/admin/ironcore/login') {
    return <div className="min-h-screen bg-[#080808]">{children}</div>;
  }

  const currentPage = navigation.find(
    item => pathname === item.href || pathname.startsWith(item.href + '/')
  )?.name || 'Admin';

  return (
    <div className="min-h-screen bg-[#080808] flex">

      {/* ── Sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex flex-col bg-[#060606] border-r border-[#141414] transition-all duration-200 overflow-hidden"
        style={{ width: sidebarOpen ? '220px' : '0px' }}
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-5 border-b border-[#141414] flex-shrink-0 gap-3">
          <div className="w-7 h-7 bg-primary flex items-center justify-center flex-shrink-0">
            <span
              className="text-white font-black text-xs"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}
            >
              ZY
            </span>
          </div>
          <div className="min-w-0">
            <p
              className="text-white text-xs font-bold uppercase truncate"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.14em' }}
            >
              Bodybuilding
            </p>
            <p
              className="text-primary text-[9px] font-semibold uppercase"
              style={{ letterSpacing: '0.2em' }}
            >
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 overflow-y-auto overflow-x-hidden">
          <p
            className="px-5 mb-3 text-neutral-800 text-[9px] font-semibold uppercase"
            style={{ letterSpacing: '0.22em' }}
          >
            Navigation
          </p>

          <div className="space-y-px">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-5 py-2.5 text-[11px] font-semibold uppercase whitespace-nowrap transition-colors duration-150 ${
                    isActive
                      ? 'text-white bg-[#0f0f0f]'
                      : 'text-neutral-700 hover:text-neutral-400 hover:bg-[#0a0a0a]'
                  }`}
                  style={{ letterSpacing: '0.1em' }}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
                  )}
                  <Icon
                    className="flex-shrink-0"
                    size={14}
                    style={{ color: isActive ? 'var(--primary-color)' : undefined }}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-[#141414]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-semibold uppercase text-neutral-800 hover:text-neutral-500 transition-colors whitespace-nowrap"
              style={{ letterSpacing: '0.1em' }}
            >
              <Globe size={14} className="flex-shrink-0" />
              Public Site
            </Link>
          </div>
        </nav>

        {/* Sign Out */}
        <div className="border-t border-[#141414] flex-shrink-0">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-[11px] font-semibold uppercase text-neutral-800 hover:text-neutral-400 transition-colors disabled:opacity-40 whitespace-nowrap"
            style={{ letterSpacing: '0.1em' }}
          >
            <LogOut size={14} className="flex-shrink-0" />
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div
        className="flex flex-col flex-1 min-h-screen min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? '220px' : '0px' }}
      >
        {/* Header */}
        <header className="h-14 bg-[#060606] border-b border-[#141414] flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-neutral-700 hover:text-white transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span
                className="text-neutral-700 text-[10px] uppercase"
                style={{ letterSpacing: '0.18em' }}
              >
                Admin
              </span>
              <span className="text-neutral-800 text-xs">/</span>
              <span
                className="text-white text-[10px] font-bold uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.18em' }}
              >
                {currentPage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full pulse-glow" />
            <span
              className="text-neutral-700 text-[10px] font-semibold uppercase"
              style={{ letterSpacing: '0.18em' }}
            >
              Live
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
