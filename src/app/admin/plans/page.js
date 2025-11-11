'use client';

import { useState, useEffect } from 'react';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    type: 'Monthly',
    isActive: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/plans');
      const data = await response.json();
      setPlans(data.documents || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingPlan 
        ? `/api/admin/plans/${editingPlan.$id}`
        : '/api/admin/plans';
      
      const method = editingPlan ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingPlan(null);
        setFormData({
          name: '',
          description: '',
          duration: '',
          price: '',
          type: 'Monthly',
          isActive: true,
        });
        fetchPlans();
        showToast(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!', 'success');
      } else {
        showToast('Failed to save plan', 'error');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      showToast('Failed to save plan', 'error');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      duration: plan.duration,
      price: plan.price,
      type: plan.type,
      isActive: plan.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!planToDelete) return;

    try {
      const response = await fetch(`/api/admin/plans/${planToDelete.$id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setPlanToDelete(null);
        fetchPlans();
        showToast('Plan deleted successfully!', 'success');
      } else {
        showToast('Failed to delete plan', 'error');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      showToast('Failed to delete plan', 'error');
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      const response = await fetch(`/api/admin/plans/${plan.$id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });

      if (response.ok) {
        fetchPlans();
      }
    } catch (error) {
      console.error('Error updating plan status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Plans</h1>
          <p className="text-gray-400">Manage membership plans and pricing</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setFormData({
              name: '',
              description: '',
              duration: '',
              price: '',
              type: 'Monthly',
              isActive: true,
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          ➕ Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-12 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-4">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-gray-400">No subscription plans yet. Create your first plan!</div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.$id}
              className={`bg-gray-800 rounded-lg p-6 border-2 transition-all ${
                plan.isActive ? 'border-red-600' : 'border-gray-700 opacity-60'
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{plan.type}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(plan)}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      plan.isActive
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}
                  >
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/ {plan.duration} days</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 min-h-[60px]">
                {plan.description || 'No description provided'}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    setPlanToDelete(plan);
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Monthly Plan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Brief description of the plan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="3-Month">3-Month</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="50.00"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                  Active (visible to members)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPlan(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Plan Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm">Total Plans</p>
            <p className="text-2xl font-bold text-white mt-1">{plans.length}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm">Active Plans</p>
            <p className="text-2xl font-bold text-green-500 mt-1">
              {plans.filter(p => p.isActive).length}
            </p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm">Price Range</p>
            <p className="text-2xl font-bold text-white mt-1">
              ${Math.min(...plans.map(p => p.price))} - ${Math.max(...plans.map(p => p.price))}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && planToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Delete Plan</h3>
                  <p className="text-gray-400 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300">
                  Are you sure you want to delete the <span className="font-semibold text-white">{planToDelete.name}</span> plan? 
                  This will permanently remove it from your subscription options.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPlanToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Delete Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div
            className={`px-6 py-4 rounded-lg shadow-2xl border-l-4 min-w-[320px] ${
              toast.type === 'success'
                ? 'bg-gray-800 border-green-500 text-white'
                : 'bg-gray-800 border-red-500 text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">
                {toast.type === 'success' ? '✅' : '❌'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
