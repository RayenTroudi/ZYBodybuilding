'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  CreditCard, 
  ClipboardList, 
  Dumbbell, 
  GraduationCap, 
  Calendar, 
  Mail, 
  Settings,
  Globe,
  LogOut
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

  // Don't show layout on login page
  if (pathname === '/admin/ironcore/login') {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-neutral-900 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-900">
            <div>
              <h2 className="text-lg font-bold text-white">ZY Gym Admin</h2>
              <p className="text-xs text-neutral-500 font-medium">Management Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <IconComponent className="mr-3 w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            
          {/* View Public Site Link */}
            <div className="pt-4 mt-4 border-t border-neutral-900">
              <Link
                href="/"
                target="_blank"
                className="flex items-center px-4 py-2.5 text-sm font-semibold text-neutral-400 hover:bg-neutral-900 hover:text-white rounded transition-colors"
              >
                <Globe className="mr-3 w-5 h-5" />
                View Public Site
              </Link>
            </div>
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-neutral-900">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-neutral-400 rounded hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-50"
            >
              <LogOut className="mr-3 w-5 h-5" />
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-14 bg-black border-b border-neutral-900 flex items-center justify-between px-5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-sm font-semibold text-neutral-400">
            Welcome, Admin
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
