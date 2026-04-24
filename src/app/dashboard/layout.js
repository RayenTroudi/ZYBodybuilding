'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Dumbbell, BookOpen, TrendingUp, Target, User,
  Home, LogOut, Menu, X, Globe,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const navigation = [
    { name: t.nav.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.workouts, href: '/dashboard/workouts', icon: Dumbbell },
    { name: t.nav.exercises, href: '/dashboard/exercises', icon: BookOpen },
    { name: t.nav.progress, href: '/dashboard/progress', icon: TrendingUp },
    { name: t.nav.goals, href: '/dashboard/goals', icon: Target },
    { name: t.nav.profile, href: '/dashboard/profile', icon: User },
  ];

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

      if (data.membership?.requiresPasswordReset) {
        router.push('/reset-password');
        return;
      }

      // Only block access when the user has a real membership that is no longer valid.
      // 'not_found' means they never had one — let them through.
      if (
        data.membership &&
        !data.membership.isValid &&
        data.membership.status !== 'not_found'
      ) {
        router.push('/membership-expired');
        return;
      }

      setUser(data.user);
      setMembership(data.membership);
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
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
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="space-y-3 w-48 animate-pulse">
          <div className="h-3 bg-white/10 rounded-full" />
          <div className="h-3 bg-white/7 rounded-full w-4/5" />
          <div className="h-3 bg-white/5 rounded-full w-3/5" />
        </div>
      </div>
    );
  }

  const initials = (user?.name || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/images/logoNobg.png"
                alt="ZY Bodybuilding"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-display text-base font-bold text-white tracking-wider uppercase">
                ZY Bodybuilding
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-[0_4px_16px_rgba(204,19,3,0.3)]'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full"
                    />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm ring-2 ring-primary/30 shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 bg-white/5 rounded-xl hover:bg-white/8 hover:text-white transition-all"
              >
                <Home size={13} />
                {t.nav.home}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-primary/80 rounded-xl hover:bg-primary transition-all"
              >
                <LogOut size={13} />
                {t.nav.logout}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#080808]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <Menu size={20} />
            </button>

            <div className="flex-1 lg:flex-none">
              <h1 className="text-base font-semibold text-white lg:hidden px-2">
                {navigation.find(
                  (n) =>
                    pathname === n.href ||
                    (n.href !== '/dashboard' && pathname.startsWith(n.href))
                )?.name || 'Dashboard'}
              </h1>
            </div>

            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
              <Globe size={13} className="text-neutral-500 ml-1" />
              {['fr', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    lang === l
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Membership warning banners */}
          {membership?.isInGracePeriod && (
            <div className="bg-primary/90 px-4 py-2.5 text-center border-t border-white/10">
              <p className="text-white text-xs font-medium">
                ⚠️ {t.gracePeriod} —{' '}
                {t.gracePeriodMsg.replace('{n}', membership.graceDaysLeft)}{' '}
                <Link href="/#pricing" className="underline font-bold hover:opacity-80">
                  {t.renewNow}
                </Link>
              </p>
            </div>
          )}

          {membership?.daysRemaining > 0 &&
            membership?.daysRemaining <= 7 &&
            !membership?.isInGracePeriod && (
              <div className="bg-yellow-600/90 px-4 py-2.5 text-center border-t border-white/10">
                <p className="text-white text-xs font-medium">
                  ⏰ {t.expiringTitle} —{' '}
                  {t.expiringMsg.replace('{n}', membership.daysRemaining)}{' '}
                  <Link href="/#pricing" className="underline font-bold hover:opacity-80">
                    {t.renewNow}
                  </Link>
                </p>
              </div>
            )}
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
