'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Workouts', href: '/dashboard/workouts', icon: '💪' },
  { name: 'Exercises', href: '/dashboard/exercises', icon: '🏋️' },
  { name: 'Progress', href: '/dashboard/progress', icon: '📈' },
  { name: 'Goals', href: '/dashboard/goals', icon: '🎯' },
  { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      
      if (!data.success || !data.user) {
        router.push('/login');
        return;
      }

      // Check if user requires password reset (first login)
      if (data.membership?.requiresPasswordReset) {
        router.push('/reset-password');
        return;
      }

      // Check if membership is valid
      if (data.membership && !data.membership.isValid) {
        router.push('/membership-expired');
        return;
      }

      setUser(data.user);
      setMembership(data.membership);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/images/logoNobg.png" 
                alt="ZY Bodybuilding Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="text-lg font-bold text-white tracking-wide">ZY BODYBUILDING</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="flex-1 px-3 py-2 text-sm text-center text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Home
              </Link>
              <button
                onClick={handleSignOut}
                className="flex-1 px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex-1 lg:flex-none">
              <h1 className="text-lg font-semibold text-white lg:hidden">
                {navigation.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)))?.name || 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Membership Warning Banner */}
          {membership?.isInGracePeriod && (
            <div className="bg-gradient-to-r from-orange-600/90 to-red-600/90 px-4 py-3 text-center">
              <p className="text-white text-sm">
                <span className="font-semibold">⚠️ Grace Period Active:</span>{' '}
                Your membership expired. You have {membership.graceDaysLeft} day(s) to renew.{' '}
                <Link href="/#pricing" className="underline font-semibold hover:text-orange-200">
                  Renew Now
                </Link>
              </p>
            </div>
          )}
          
          {membership?.daysRemaining > 0 && membership?.daysRemaining <= 7 && !membership?.isInGracePeriod && (
            <div className="bg-gradient-to-r from-yellow-600/90 to-orange-600/90 px-4 py-3 text-center">
              <p className="text-white text-sm">
                <span className="font-semibold">⏰ Expiring Soon:</span>{' '}
                Your membership expires in {membership.daysRemaining} day(s).{' '}
                <Link href="/#pricing" className="underline font-semibold hover:text-yellow-200">
                  Renew Now
                </Link>
              </p>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
