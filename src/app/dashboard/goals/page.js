'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';

const goalTypes = [
  { id: 'weight_loss', name: 'Weight Loss', icon: '⚖️', unit: 'kg' },
  { id: 'weight_gain', name: 'Weight Gain', icon: '📈', unit: 'kg' },
  { id: 'strength', name: 'Strength', icon: '💪', unit: 'kg' },
  { id: 'muscle_gain', name: 'Muscle Gain', icon: '🏋️', unit: 'kg' },
  { id: 'endurance', name: 'Endurance', icon: '🏃', unit: 'min' },
  { id: 'body_recomposition', name: 'Body Recomp', icon: '🔄', unit: '%' },
  { id: 'habit', name: 'Habit', icon: '✅', unit: 'days' },
  { id: 'custom', name: 'Custom', icon: '🎯', unit: '' },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchGoals();
  }, [filter]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/goals?status=${filter}`);
      const data = await response.json();
      
      if (data.success) {
        setGoals(data.goals || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (goalId, updates) => {
    try {
      const response = await fetch(`/api/user/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const response = await fetch(`/api/user/goals/${goalId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400">Loading goals...</p>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fitness Goals</h1>
          <p className="text-neutral-400">Track your progress towards your goals</p>
        </div>
        <button
          onClick={() => setShowNewGoalModal(true)}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-colors"
        >
          + New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <p className="text-3xl font-bold text-white">{activeGoals.length}</p>
          <p className="text-sm text-neutral-400">Active Goals</p>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <p className="text-3xl font-bold text-green-500">{completedGoals.length}</p>
          <p className="text-sm text-neutral-400">Completed</p>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <p className="text-3xl font-bold text-yellow-500">
            {activeGoals.filter(g => g.priority === 'high').length}
          </p>
          <p className="text-sm text-neutral-400">High Priority</p>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <p className="text-3xl font-bold text-purple-500">
            {activeGoals.filter(g => {
              if (!g.targetDate) return false;
              const daysLeft = differenceInDays(new Date(g.targetDate), new Date());
              return daysLeft <= 7 && daysLeft >= 0;
            }).length}
          </p>
          <p className="text-sm text-neutral-400">Due This Week</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['active', 'completed', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
          <p className="text-6xl mb-4">🎯</p>
          <p className="text-neutral-400 mb-4">No {filter} goals yet</p>
          {filter === 'active' && (
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Create Your First Goal
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.$id}
              goal={goal}
              onUpdate={(updates) => handleUpdateGoal(goal.$id, updates)}
              onDelete={() => handleDeleteGoal(goal.$id)}
            />
          ))}
        </div>
      )}

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <NewGoalModal
          onClose={() => setShowNewGoalModal(false)}
          onSuccess={() => {
            setShowNewGoalModal(false);
            fetchGoals();
          }}
        />
      )}
    </div>
  );
}

function GoalCard({ goal, onUpdate, onDelete }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  const progress = goal.targetValue 
    ? Math.min(100, (goal.currentValue / goal.targetValue) * 100)
    : 0;

  const goalType = goalTypes.find(t => t.id === goal.goalType) || goalTypes[7];
  
  const daysLeft = goal.targetDate 
    ? differenceInDays(new Date(goal.targetDate), new Date())
    : null;

  const priorityColors = {
    high: 'border-red-500 bg-red-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    low: 'border-primary/50 bg-primary/10',
  };

  return (
    <div className={`bg-neutral-900 rounded-xl border ${
      goal.status === 'completed' ? 'border-green-500' : 'border-neutral-800'
    } p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goalType.icon}</span>
          <div>
            <h3 className="font-bold text-white text-lg">{goal.title}</h3>
            <p className="text-sm text-neutral-400">{goalType.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[goal.priority]}`}>
            {goal.priority}
          </span>
          {goal.status === 'completed' && (
            <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-medium">
              ✓ Completed
            </span>
          )}
        </div>
      </div>

      {goal.description && (
        <p className="text-neutral-400 text-sm mb-4">{goal.description}</p>
      )}

      {/* Progress */}
      {goal.targetValue && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-neutral-400">Progress</span>
            <span className="text-white font-medium">
              {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                goal.status === 'completed'
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-right text-sm text-neutral-400 mt-1">{Math.round(progress)}%</p>
        </div>
      )}

      {/* Dates */}
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <div>
          <span className="text-neutral-400">Started: </span>
          <span className="text-white">{format(new Date(goal.startDate), 'MMM dd, yyyy')}</span>
        </div>
        {goal.targetDate && (
          <div>
            <span className="text-neutral-400">Target: </span>
            <span className={`${daysLeft !== null && daysLeft < 0 ? 'text-red-500' : 'text-white'}`}>
              {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
              {daysLeft !== null && daysLeft >= 0 && (
                <span className="text-neutral-400 ml-1">({daysLeft} days left)</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {goal.status === 'active' && (
        <div className="flex gap-2 pt-4 border-t border-neutral-800">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Update Progress
          </button>
          <button
            onClick={() => onUpdate({ status: 'completed', completedDate: new Date().toISOString() })}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Mark Complete
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Update Progress Modal */}
      {showUpdateModal && (
        <UpdateProgressModal
          goal={goal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={(value) => {
            onUpdate({ currentValue: value });
            setShowUpdateModal(false);
          }}
        />
      )}
    </div>
  );
}

function UpdateProgressModal({ goal, onClose, onUpdate }) {
  const [value, setValue] = useState(goal.currentValue || '');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 rounded-2xl max-w-sm w-full border border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Update Progress</h3>
          <p className="text-neutral-400 mb-4">{goal.title}</p>
          
          <div className="mb-4">
            <label className="block text-sm text-neutral-300 mb-2">
              Current Value ({goal.unit})
            </label>
            <input
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={`Target: ${goal.targetValue}`}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onUpdate(parseFloat(value))}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewGoalModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: 'custom',
    targetValue: '',
    currentValue: '',
    unit: '',
    targetDate: '',
    priority: 'medium',
  });
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (type) => {
    const goalType = goalTypes.find(t => t.id === type);
    setFormData({
      ...formData,
      goalType: type,
      unit: goalType?.unit || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/user/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null,
          currentValue: formData.currentValue ? parseFloat(formData.currentValue) : 0,
          startDate: new Date().toISOString(),
          targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create New Goal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Goal Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Goal Type</label>
              <div className="grid grid-cols-4 gap-2">
                {goalTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeChange(type.id)}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      formData.goalType === type.id
                        ? 'bg-primary text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <span className="text-xl block">{type.icon}</span>
                    <span className="text-xs">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Goal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Bench Press 100kg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional description..."
              />
            </div>

            {/* Target & Current Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Target Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="kg"
                />
              </div>
            </div>

            {/* Target Date & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
