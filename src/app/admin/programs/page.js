'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const FL = (text) => (
  <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>{text}</p>
);

export default function ProgramsManagement() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchPrograms(); }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/programs');
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch { setPrograms([]); } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleToggleStatus = async (program) => {
    try {
      const response = await fetch(`/api/admin/programs/${program.$id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !program.isActive }),
      });
      if (response.ok) fetchPrograms();
    } catch {}
  };

  const handleDelete = async () => {
    if (!programToDelete) return;
    try {
      const response = await fetch(`/api/admin/programs/${programToDelete.$id}`, { method: 'DELETE' });
      if (response.ok) {
        setShowDeleteModal(false);
        setProgramToDelete(null);
        fetchPrograms();
        showToast('Program deleted', 'success');
      } else { showToast('Failed to delete program', 'error'); }
    } catch { showToast('Failed to delete program', 'error'); }
  };

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          {FL('Training')}
          <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Programs
          </h1>
        </div>
        <button
          onClick={() => router.push('/admin/programs/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors"
          style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
          <Plus size={12} /> Add Program
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Programs', value: programs.length, color: 'text-white' },
          { label: 'Active', value: programs.filter(p => p.isActive).length, color: 'text-green-400' },
          { label: 'Inactive', value: programs.filter(p => !p.isActive).length, color: 'text-neutral-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#0c0c0c] border border-[#161616] p-5">
            {FL(label)}
            <p className={`font-black leading-none mt-2 ${color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Programs Grid */}
      {loading ? (
        <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
          <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
          <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading...</span>
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-[#0c0c0c] border border-[#161616] py-16 text-center">
          <p className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>No programs yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {programs.map((program) => (
            <div key={program.$id} className={`bg-[#0c0c0c] border flex flex-col overflow-hidden transition-colors ${program.isActive ? 'border-[#1e1e1e] hover:border-[#2a2a2a]' : 'border-[#111] opacity-50'}`}>
              <div className={`h-[2px] ${program.isActive ? 'bg-primary' : 'bg-[#1a1a1a]'}`} />

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', letterSpacing: '0.04em' }}>
                    {program.title}
                  </h3>
                  <button
                    onClick={() => handleToggleStatus(program)}
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${program.isActive ? 'admin-badge badge-active' : 'border-[#222] text-neutral-700 bg-[#0a0a0a]'}`}
                    style={{ letterSpacing: '0.12em' }}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {program.description && (
                  <p className="text-neutral-600 text-xs mb-4 leading-relaxed line-clamp-3">{program.description}</p>
                )}

                <div className="mt-auto space-y-1 pt-3 border-t border-[#161616]">
                  {program.targetAudience && (
                    <p className="text-neutral-700 text-[10px]">{program.targetAudience}</p>
                  )}
                  {program.duration && (
                    <p className="text-neutral-700 text-[10px]">{program.duration}</p>
                  )}
                </div>
              </div>

              <div className="flex border-t border-[#161616]">
                <button
                  onClick={() => router.push(`/admin/programs/${program.$id}`)}
                  className="flex-1 py-3 text-neutral-600 text-[10px] font-bold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                  style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Edit
                </button>
                <button
                  onClick={() => { setProgramToDelete(program); setShowDeleteModal(true); }}
                  className="flex-1 py-3 text-red-600/50 text-[10px] font-bold uppercase hover:text-red-500 hover:bg-[#111] transition-colors"
                  style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && programToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-[#1e1e1e] max-w-sm w-full">
            <div className="px-5 py-4 border-b border-[#161616] flex items-center gap-3">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <h3 className="text-white font-black uppercase text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}>Delete Program</h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-neutral-500 text-xs leading-relaxed">
                Delete <span className="text-white font-semibold">{programToDelete.title}</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#161616]">
              <button
                onClick={() => { setShowDeleteModal(false); setProgramToDelete(null); }}
                className="flex-1 py-3 text-neutral-600 text-xs font-bold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}>Cancel</button>
              <button
                onClick={handleDelete}
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
