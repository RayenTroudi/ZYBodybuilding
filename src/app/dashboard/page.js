'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import {
  CalendarDays, Flame, Dumbbell, BarChart3, ChevronRight,
  Lightbulb, Clock, Zap, CheckCircle2, Target,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';
import StatCard from './components/StatCard';
import GlassCard from './components/GlassCard';
import SkeletonLoader from './components/SkeletonLoader';
import PageTransition from './components/PageTransition';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } },
};

export default function DashboardPage() {
  const { lang } = useLanguage();
  const t = translations[lang].home;
  const tCommon = translations[lang];

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState(null);
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, authRes] = await Promise.all([
        fetch('/api/user/dashboard'),
        fetch('/api/auth/check'),
      ]);
      const dashboardData = await dashboardRes.json();
      const authData = await authRes.json();

      if (dashboardData.success) {
        setStats(dashboardData.stats);
        setRecentWorkouts(dashboardData.recentWorkouts || []);
        setDailyTip(dashboardData.dailyTip);
        setGoals(dashboardData.goals || []);
        setStreak(dashboardData.streak);
      }
      if (authData.success && authData.membership) {
        setMembership(authData.membership);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
        <SkeletonLoader rows={4} />
      </div>
    );
  }

  // Build week calendar
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const workoutDates = recentWorkouts.map((w) => new Date(w.workoutDate));
  const hasWorkout = (day) => workoutDates.some((d) => isSameDay(d, day));

  const membershipDays = membership?.daysRemaining || 0;
  const membershipColor = membershipDays <= 7 ? 'orange' : 'green';

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border border-primary/20 p-6 lg:p-8"
        >
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h1 className="font-display text-3xl lg:text-4xl font-black text-white tracking-tight mb-1">
              {t.welcome}
            </h1>
            {streak?.currentStreak > 0 && (
              <p className="text-neutral-300 text-sm mb-4 flex items-center gap-1.5">
                <Flame size={14} className="text-orange-400" />
                <span className="font-semibold text-orange-400">{streak.currentStreak}</span>
                {lang === 'fr' ? ' jours consécutifs — continuez !' : ' day streak — keep it up!'}
              </p>
            )}
            {!streak?.currentStreak && (
              <p className="text-neutral-400 text-sm mb-4">
                {lang === 'fr' ? 'Prêt à forger votre corps aujourd\'hui ?' : 'Ready to forge your body today?'}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/workouts/log"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(204,19,3,0.4)] hover:bg-primary/90 transition-all hover:shadow-[0_4px_24px_rgba(204,19,3,0.5)]"
              >
                <Zap size={15} />
                {t.startWorkout}
              </Link>
              <Link
                href="/dashboard/progress"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/15 transition-all border border-white/10"
              >
                <BarChart3 size={15} />
                {t.viewProgress}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={CalendarDays}
            label={t.membership}
            value={membershipDays}
            suffix={` ${t.daysLeft}`}
            color={membershipColor}
            subtext={membership?.member?.planName}
          />
          <StatCard
            icon={Flame}
            label={t.streak}
            value={streak?.currentStreak || 0}
            suffix={lang === 'fr' ? ' j' : ' d'}
            color="orange"
            subtext={streak?.longestStreak ? `Best: ${streak.longestStreak}` : null}
          />
          <StatCard
            icon={Dumbbell}
            label={t.thisWeek}
            value={stats?.workoutsThisWeek || 0}
            color="blue"
          />
          <StatCard
            icon={BarChart3}
            label={t.totalVolume}
            value={((stats?.totalVolume || 0) / 1000).toFixed(1)}
            suffix="k kg"
            color="purple"
          />
        </div>

        {/* Week Calendar Strip */}
        <GlassCard className="p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
            {lang === 'fr' ? 'Cette semaine' : 'This week'}
          </p>
          <div className="flex gap-2 justify-between">
            {weekDays.map((day) => {
              const active = hasWorkout(day);
              const today = isToday(day);
              return (
                <div key={day.toISOString()} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${today ? 'text-primary' : 'text-neutral-600'}`}>
                    {format(day, 'EEE').slice(0, 2)}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      active
                        ? 'bg-primary text-white shadow-[0_2px_8px_rgba(204,19,3,0.4)]'
                        : today
                        ? 'bg-white/10 text-white ring-1 ring-white/20'
                        : 'bg-white/5 text-neutral-600'
                    }`}
                  >
                    {active ? <CheckCircle2 size={14} /> : format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Workouts */}
          <GlassCard className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-white tracking-tight">
                {t.recentWorkouts}
              </h2>
              <Link
                href="/dashboard/workouts"
                className="flex items-center gap-1 text-primary text-xs font-semibold hover:opacity-80 transition-opacity"
              >
                {t.viewAll} <ChevronRight size={14} />
              </Link>
            </div>

            {recentWorkouts.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Dumbbell size={20} className="text-neutral-500" />
                </div>
                <p className="text-neutral-400 text-sm mb-4">{t.noWorkouts}</p>
                <Link
                  href="/dashboard/workouts/log"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary text-sm font-semibold rounded-xl hover:bg-primary/30 transition-all border border-primary/30"
                >
                  {t.startWorkout}
                </Link>
              </div>
            ) : (
              <motion.div
                variants={stagger.container}
                initial="initial"
                animate="animate"
                className="space-y-3"
              >
                {recentWorkouts.slice(0, 5).map((log) => (
                  <motion.div key={log.$id} variants={stagger.item}>
                    <Link
                      href={`/dashboard/workouts/${log.$id}`}
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 hover:border-primary/20 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex flex-col items-center justify-center text-primary shrink-0">
                        <span className="text-base font-display font-black leading-none">
                          {format(new Date(log.workoutDate), 'd')}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          {format(new Date(log.workoutDate), 'EEE')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">
                          {log.planName || (lang === 'fr' ? 'Séance rapide' : 'Quick Workout')}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                            <Dumbbell size={10} />
                            {log.exerciseCount || 0} ex.
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                            <Clock size={10} />
                            {log.durationMinutes || 0} min
                          </span>
                        </div>
                      </div>
                      {log.totalVolume > 0 && (
                        <div className="text-right shrink-0">
                          <p className="text-green-400 text-sm font-bold">
                            {(log.totalVolume / 1000).toFixed(1)}k
                          </p>
                          <p className="text-[10px] text-neutral-600">kg</p>
                        </div>
                      )}
                      <ChevronRight
                        size={14}
                        className="text-neutral-700 group-hover:text-neutral-400 transition-colors shrink-0"
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </GlassCard>

          {/* Right column */}
          <div className="space-y-4">
            {/* Active Goals */}
            {goals.length > 0 && (
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-bold text-white tracking-tight">
                    {t.goals || 'Goals'}
                  </h2>
                  <Link href="/dashboard/goals" className="text-primary text-xs font-semibold hover:opacity-80">
                    <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {goals.slice(0, 3).map((goal) => {
                    const pct = goal.targetValue
                      ? Math.min(100, (goal.currentValue / goal.targetValue) * 100)
                      : 0;
                    return (
                      <div key={goal.$id}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-white font-medium truncate pr-2">{goal.title}</p>
                          <span className="text-xs text-neutral-400 shrink-0">{Math.round(pct)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {/* Daily Tip */}
            {dailyTip && (
              <GlassCard className="p-5 border-l-2 border-l-yellow-500/60">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <Lightbulb size={15} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-yellow-500/80 mb-1">
                      {lang === 'fr' ? 'Conseil du jour' : 'Daily Tip'}
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{dailyTip.content}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Quick Actions */}
            <GlassCard className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
                {lang === 'fr' ? 'Actions rapides' : 'Quick Actions'}
              </p>
              <div className="space-y-2">
                {[
                  { href: '/dashboard/workouts/log', icon: Zap, label: t.startWorkout, color: 'text-primary' },
                  { href: '/dashboard/progress', icon: BarChart3, label: t.viewProgress, color: 'text-blue-400' },
                  { href: '/dashboard/goals', icon: Target, label: t.goals || 'Goals', color: 'text-green-400' },
                ].map(({ href, icon: Icon, label, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <Icon size={15} className={color} />
                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors font-medium">
                      {label}
                    </span>
                    <ChevronRight size={13} className="ml-auto text-neutral-700 group-hover:text-neutral-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
