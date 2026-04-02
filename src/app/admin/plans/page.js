'use client';

import { useState, useEffect } from 'react';
import { cachedFetch, invalidateCache } from '@/lib/cache';
import { Plus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const FL = (text) => (
  <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>{text}</p>
);

const inputCls = "w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-primary transition-colors";
const inputStyle = { borderRadius: 0, fontFamily: "'DM Sans', sans-serif" };

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', duration: '', price: '', isActive: true });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await cachedFetch('/api/admin/plans', {}, 120000);
      setPlans(data.documents || []);
    } catch { setPlans([]); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPlan ? `/api/admin/plans/${editingPlan.$id}` : '/api/admin/plans';
      const res = await fetch(url, {
        method: editingPlan ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        invalidateCache('/api/admin/plans');
        setShowModal(false);
        setEditingPlan(null);
        setFormData({ name: '', description: '', duration: '', price: '', isActive: true });
        fetchPlans();
        showToast(editingPlan ? 'Plan updated' : 'Plan created', 'success');
      } else { showToast('Failed to save plan', 'error'); }
    } catch { showToast('Failed to save plan', 'error'); }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({ name: plan.name, description: plan.description || '', duration: plan.duration, price: plan.price, isActive: plan.isActive });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      const res = await fetch(`/api/admin/plans/${planToDelete.$id}`, { method: 'DELETE' });
      if (res.ok) {
        invalidateCache('/api/admin/plans');
        setShowDeleteModal(false);
        setPlanToDelete(null);
        fetchPlans();
        showToast('Plan deleted', 'success');
      } else { showToast('Failed to delete plan', 'error'); }
    } catch { showToast('Failed to delete plan', 'error'); }
  };

  const handleToggle = async (plan) => {
    try {
      await fetch(`/api/admin/plans/${plan.$id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      fetchPlans();
    } catch {}
  };

  const openNew = () => {
    setEditingPlan(null);
    setFormData({ name: '', description: '', duration: '', price: '', isActive: true });
    setShowModal(true);
  };

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          {FL('Subscriptions')}
          <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Plans
          </h1>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors"
          style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
          <Plus size={12} /> Add Plan
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Plans', value: plans.length, color: 'text-white' },
          { label: 'Active', value: plans.filter(p => p.isActive).length, color: 'text-green-400' },
          { label: 'Inactive', value: plans.filter(p => !p.isActive).length, color: 'text-neutral-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#0c0c0c] border border-[#161616] p-5">
            {FL(label)}
            <p className={`font-black leading-none mt-2 ${color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
          <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
          <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-[#0c0c0c] border border-[#161616] py-16 text-center">
          <p className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>No plans yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div key={plan.$id} className={`bg-[#0c0c0c] border flex flex-col overflow-hidden transition-colors ${plan.isActive ? 'border-[#1e1e1e] hover:border-[#2a2a2a]' : 'border-[#111] opacity-50'}`}>
              {/* Top accent */}
              <div className={`h-[2px] ${plan.isActive ? 'bg-primary' : 'bg-[#1a1a1a]'}`} />

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', letterSpacing: '0.04em' }}>
                    {plan.name}
                  </h3>
                  <button onClick={() => handleToggle(plan)}
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${plan.isActive ? 'admin-badge badge-active' : 'border-[#222] text-neutral-700 bg-[#0a0a0a]'}`}
                    style={{ letterSpacing: '0.12em' }}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {plan.description && (
                  <p className="text-neutral-600 text-xs mb-4 leading-relaxed line-clamp-2">{plan.description}</p>
                )}

                <div className="flex-1 flex flex-col justify-center py-4 border-y border-[#161616] my-3">
                  <p className="text-primary font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem' }}>
                    {parseFloat(plan.price).toFixed(0)}<span className="text-neutral-600 text-base ml-1">TND</span>
                  </p>
                  <p className="text-neutral-700 text-[10px] mt-1">{plan.duration} days</p>
                </div>
              </div>

              <div className="flex border-t border-[#161616]">
                <button onClick={() => handleEdit(plan)}
                  className="flex-1 py-3 text-neutral-600 text-[10px] font-bold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                  style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Edit
                </button>
                <button onClick={() => { setPlanToDelete(plan); setShowDeleteModal(true); }}
                  className="flex-1 py-3 text-red-600/50 text-[10px] font-bold uppercase hover:text-red-500 hover:bg-[#111] transition-colors"
                  style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-[#1e1e1e] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#161616]">
              <h2 className="text-white font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', letterSpacing: '0.06em' }}>
                {editingPlan ? 'Edit Plan' : 'New Plan'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {[
                { label: 'Plan Name', key: 'name', type: 'text', placeholder: 'e.g. Monthly' },
                { label: 'Duration (days)', key: 'duration', type: 'number', placeholder: '30', min: '1' },
                { label: 'Price (TND)', key: 'price', type: 'number', placeholder: '50.00', step: '0.01', min: '0' },
              ].map(({ label, key, ...rest }) => (
                <div key={key}>
                  <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>{label}</label>
                  <input value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} required className={inputCls} style={inputStyle} {...rest} />
                </div>
              ))}
              <div>
                <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}
                  className={inputCls} style={inputStyle} placeholder="Brief description..." />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-3.5 h-3.5 accent-red-600" />
                <label htmlFor="isActive" className="text-xs text-neutral-500">Active (visible to members)</label>
              </div>
              <div className="flex border-t border-[#161616] pt-4 gap-3">
                <button type="button" onClick={() => { setShowModal(false); setEditingPlan(null); }}
                  className="flex-1 py-2.5 border border-[#1e1e1e] text-neutral-600 text-xs font-bold uppercase hover:text-white hover:border-[#2a2a2a] transition-colors"
                  style={{ borderRadius: 0, letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors"
                  style={{ borderRadius: 0, letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && planToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-[#1e1e1e] max-w-sm w-full">
            <div className="px-5 py-4 border-b border-[#161616] flex items-center gap-3">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <h3 className="text-white font-black uppercase text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}>Delete Plan</h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-neutral-500 text-xs leading-relaxed">
                Delete <span className="text-white font-semibold">{planToDelete.name}</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#161616]">
              <button onClick={() => { setShowDeleteModal(false); setPlanToDelete(null); }}
                className="flex-1 py-3 text-neutral-600 text-xs font-bold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>Cancel</button>
              <button onClick={handleDelete}
                className="flex-1 py-3 text-red-500 text-xs font-bold uppercase hover:text-white hover:bg-red-600 transition-colors"
                style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-5 py-3.5 border-l-2 min-w-[260px] bg-[#0c0c0c] border border-[#1e1e1e] ${toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'}`}>
            {toast.type === 'success' ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
            <p className="text-white text-xs flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-neutral-600 hover:text-white transition-colors text-xs">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
