'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FileText, Star } from 'lucide-react';

export default function WorkoutsPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);
      const [plansRes, logsRes] = await Promise.all([
        fetch('/api/user/workout-plans'),
        fetch('/api/user/workout-logs'),
      ]);
      
      const plansData = await plansRes.json();
      const logsData = await logsRes.json();
      
      if (plansData.success) setWorkoutPlans(plansData.plans || []);
      if (logsData.success) setWorkoutLogs(logsData.logs || []);
    } catch (error) {
      console.error('Error fetching workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Workouts</h1>
          <p className="text-neutral-400">Manage your workout plans and history</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/workouts/log"
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            + Log Workout
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-700">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'plans'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          My Plans
        </button>
      </div>

      {/* Content */}
      {activeTab === 'history' ? (
        <WorkoutHistory logs={workoutLogs} />
      ) : (
        <WorkoutPlans 
          plans={workoutPlans} 
          onNewPlan={() => setShowNewPlanModal(true)}
          onRefresh={fetchWorkoutData}
        />
      )}

      {/* New Plan Modal */}
      {showNewPlanModal && (
        <NewPlanModal
          onClose={() => setShowNewPlanModal(false)}
          onSuccess={() => {
            setShowNewPlanModal(false);
            fetchWorkoutData();
          }}
        />
      )}
    </div>
  );
}

function WorkoutHistory({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
        <p className="text-6xl mb-4">📝</p>
        <p className="text-neutral-400 mb-4">No workouts logged yet</p>
        <Link
          href="/dashboard/workouts/log"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Log Your First Workout
        </Link>
      </div>
    );
  }

  // Group logs by month
  const groupedLogs = logs.reduce((acc, log) => {
    const monthKey = format(new Date(log.workoutDate), 'MMMM yyyy');
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedLogs).map(([month, monthLogs]) => (
        <div key={month}>
          <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">{month}</h3>
          <div className="space-y-3">
            {monthLogs.map((log) => (
              <Link
                key={log.$id}
                href={`/dashboard/workouts/${log.$id}`}
                className="flex items-center gap-4 p-4 bg-neutral-800 border border-neutral-700 rounded-xl hover:border-red-500/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-bold">{format(new Date(log.workoutDate), 'd')}</span>
                  <span className="text-xs">{format(new Date(log.workoutDate), 'EEE')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {log.planName || 'Quick Workout'}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {log.exerciseCount || 0} exercises • {log.durationMinutes || 0} minutes
                  </p>
                </div>
                <div className="text-right">
                  {log.totalVolume > 0 && (
                    <p className="text-green-500 font-semibold">
                      {(log.totalVolume / 1000).toFixed(1)}k kg
                    </p>
                  )}
                  {log.rating && (
                    <p className="text-yellow-500 text-sm">{'⭐'.repeat(log.rating)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkoutPlans({ plans, onNewPlan, onRefresh }) {
  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      const response = await fetch(`/api/user/workout-plans/${planId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
        <p className="text-6xl mb-4">📋</p>
        <p className="text-neutral-400 mb-4">No workout plans yet</p>
        <button
          onClick={onNewPlan}
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Create Your First Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={onNewPlan}
          className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
        >
          + New Plan
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.$id}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-red-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                <p className="text-sm text-neutral-400">{plan.type.replace('_', ' ')}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/workouts/log?plan=${plan.$id}`}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Start
                </Link>
                <button
                  onClick={() => handleDeletePlan(plan.$id)}
                  className="px-3 py-1 bg-neutral-700 text-neutral-300 text-sm rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {plan.description && (
              <p className="text-neutral-400 text-sm mb-3 line-clamp-2">{plan.description}</p>
            )}
            
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                {plan.daysPerWeek} days/week
              </span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                {plan.difficulty}
              </span>
              {plan.estimatedDuration && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                  ~{plan.estimatedDuration} min
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewPlanModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'custom',
    daysPerWeek: 3,
    difficulty: 'intermediate',
    estimatedDuration: 60,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/user/workout-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-800 rounded-2xl max-w-md w-full border border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create Workout Plan</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Plan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Push Day, Leg Day"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Optional description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="push_pull_legs">Push/Pull/Legs</option>
                  <option value="upper_lower">Upper/Lower</option>
                  <option value="full_body">Full Body</option>
                  <option value="bro_split">Bro Split</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Days/Week</label>
                <select
                  value={formData.daysPerWeek}
                  onChange={(e) => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(n => (
                    <option key={n} value={n}>{n} day{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
                  min={15}
                  max={180}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
