'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, startOfWeek, endOfWeek, isToday, parseISO } from 'date-fns';

export default function DashboardPage() {
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
      
      // Fetch both dashboard data and membership info in parallel
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 💪</h1>
        <p className="opacity-90">Ready to crush your workout today?</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/workouts/log"
            className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Workout
          </Link>
          <Link
            href="/dashboard/progress"
            className="px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            View Progress
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Membership Days Card */}
        <div className={`bg-gray-800 rounded-xl border p-4 ${
          membership?.daysRemaining <= 7 
            ? 'border-orange-500/50' 
            : 'border-gray-700'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
              membership?.daysRemaining <= 7 
                ? 'bg-orange-600/20' 
                : 'bg-green-600/20'
            }`}>
              📅
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Membership</p>
              <p className={`text-lg font-bold ${
                membership?.daysRemaining <= 7 
                  ? 'text-orange-400' 
                  : 'text-green-400'
              }`}>
                {membership?.daysRemaining || 0} days left
              </p>
            </div>
          </div>
          {membership?.member?.planName && (
            <p className="text-xs text-gray-500 truncate">{membership.member.planName}</p>
          )}
        </div>
        
        <StatCard
          icon="🔥"
          label="Current Streak"
          value={`${streak?.currentStreak || 0} days`}
          color="orange"
        />
        <StatCard
          icon="🏋️"
          label="This Week"
          value={`${stats?.workoutsThisWeek || 0} workouts`}
          color="blue"
        />
        <StatCard
          icon="💪"
          label="Total Volume"
          value={`${((stats?.totalVolume || 0) / 1000).toFixed(1)}k kg`}
          color="green"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Workouts</h2>
            <Link href="/dashboard/workouts" className="text-red-500 text-sm hover:text-red-400">
              View all →
            </Link>
          </div>
          
          {recentWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-6xl mb-4">🏃</p>
              <p className="text-gray-400 mb-4">No workouts logged yet</p>
              <Link
                href="/dashboard/workouts/log"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Log Your First Workout
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.slice(0, 5).map((workout) => (
                <Link
                  key={workout.$id}
                  href={`/dashboard/workouts/${workout.$id}`}
                  className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center text-2xl">
                    💪
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {workout.planName || 'Quick Workout'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(workout.workoutDate), 'MMM dd, yyyy')} • {workout.exerciseCount || 0} exercises
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{workout.durationMinutes || 0} min</p>
                    {workout.rating && (
                      <p className="text-yellow-500 text-sm">{'⭐'.repeat(workout.rating)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Tip */}
          {dailyTip && (
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-white">Daily Tip</h3>
              </div>
              <p className="text-sm font-medium text-blue-400 mb-2">{dailyTip.title}</p>
              <p className="text-gray-300 text-sm">{dailyTip.content}</p>
            </div>
          )}

          {/* Active Goals */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Active Goals</h3>
              <Link href="/dashboard/goals" className="text-red-500 text-sm hover:text-red-400">
                Manage →
              </Link>
            </div>
            
            {goals.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-3">No goals set yet</p>
                <Link
                  href="/dashboard/goals/new"
                  className="text-red-500 text-sm hover:text-red-400"
                >
                  + Add Goal
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.slice(0, 3).map((goal) => (
                  <GoalProgress key={goal.$id} goal={goal} />
                ))}
              </div>
            )}
          </div>

          {/* Streak Info */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="text-2xl font-bold text-white">{streak?.currentStreak || 0}</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
              <div>
                <p className="text-gray-400 text-xs">Longest Streak</p>
                <p className="text-white font-semibold">{streak?.longestStreak || 0} days</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Workouts</p>
                <p className="text-white font-semibold">{streak?.totalWorkouts || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Week Overview */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">This Week</h2>
        <WeekCalendar workouts={recentWorkouts} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    orange: 'from-orange-600/20 to-red-600/20 border-orange-500/30',
    blue: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30',
    purple: 'from-purple-600/20 to-pink-600/20 border-purple-500/30',
    green: 'from-green-600/20 to-emerald-600/20 border-green-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-4`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function GoalProgress({ goal }) {
  const progress = goal.targetValue 
    ? Math.min(100, (goal.currentValue / goal.targetValue) * 100)
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white truncate">{goal.title}</p>
        <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function WeekCalendar({ workouts }) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const workoutDates = workouts.map(w => 
    format(new Date(w.workoutDate), 'yyyy-MM-dd')
  );

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + index);
        const dateStr = format(date, 'yyyy-MM-dd');
        const hasWorkout = workoutDates.includes(dateStr);
        const isCurrentDay = isToday(date);

        return (
          <div
            key={day}
            className={`text-center p-3 rounded-lg transition-colors ${
              isCurrentDay
                ? 'bg-red-600/20 border border-red-500'
                : hasWorkout
                ? 'bg-green-600/20 border border-green-500/50'
                : 'bg-gray-700/50'
            }`}
          >
            <p className="text-xs text-gray-400 mb-1">{day}</p>
            <p className={`font-semibold ${isCurrentDay ? 'text-red-500' : 'text-white'}`}>
              {format(date, 'd')}
            </p>
            {hasWorkout && <p className="text-green-500 text-lg mt-1">✓</p>}
          </div>
        );
      })}
    </div>
  );
}
