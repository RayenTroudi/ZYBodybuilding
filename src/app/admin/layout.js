'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    router.push('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👤' },
    { name: 'Members', href: '/admin/members', icon: '👥' },
    { name: 'Payments', href: '/admin/payments', icon: '💳' },
    { name: 'Plans', href: '/admin/plans', icon: '📋' },
    { name: 'Programs', href: '/admin/programs', icon: '🏋️' },
    { name: 'Trainers', href: '/admin/trainers', icon: '👨‍🏫' },
    { name: 'Classes', href: '/admin/classes', icon: '📅' },
    { name: 'Email', href: '/admin/email', icon: '📧' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white">ZY Gym Admin</h2>
              <p className="text-xs text-gray-400">Management Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
            
            {/* View Public Site Link */}
            <div className="pt-4 mt-4 border-t border-gray-700">
              <Link
                href="/"
                target="_blank"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                <span className="mr-3 text-lg">🌐</span>
                View Public Site
              </Link>
            </div>
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
            >
              <span className="mr-3 text-lg">🚪</span>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-sm text-gray-400">
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
