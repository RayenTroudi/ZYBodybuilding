'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProgramsManagement() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/programs');
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
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
        body: JSON.stringify({ isActive: !program.isActive })
      });

      if (response.ok) {
        fetchPrograms();
      }
    } catch (error) {
      console.error('Error updating program status:', error);
    }
  };

  const handleDelete = async () => {
    if (!programToDelete) return;

    try {
      const response = await fetch(`/api/admin/programs/${programToDelete.$id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setProgramToDelete(null);
        fetchPrograms();
        showToast('Program deleted successfully!', 'success');
      } else {
        showToast('Failed to delete program', 'error');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      showToast('Failed to delete program', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Workout Programs</h1>
          <p className="text-neutral-400">Manage training programs and offerings</p>
        </div>
        <button
          onClick={() => router.push('/admin/programs/new')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          ➕ Add Program
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-12 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-400 mt-4">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-neutral-400">No workout programs yet. Create your first program!</div>
        ) : (
          programs.map((program) => (
            <div
              key={program.$id}
              className={`bg-neutral-800 rounded-lg p-6 border-2 transition-all ${
                program.isActive ? 'border-red-600' : 'border-neutral-700 opacity-60'
              }`}
            >
              {/* Program Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{program.icon || '🏋️'}</span>
                  <h3 className="text-xl font-bold text-white">{program.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(program)}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      program.isActive
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-neutral-500/20 text-neutral-500'
                    }`}
                  >
                    {program.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-400 text-sm mb-4 min-h-[60px]">
                {program.description || 'No description provided'}
              </p>

              {/* Meta Info */}
              {(program.targetAudience || program.duration) && (
                <div className="text-xs text-neutral-500 mb-4 space-y-1">
                  {program.targetAudience && <p>👥 {program.targetAudience}</p>}
                  {program.duration && <p>⏱️ {program.duration}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/programs/${program.$id}`)}
                  className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    setProgramToDelete(program);
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

      {/* Stats */}
      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <h2 className="text-xl font-bold text-white mb-4">Program Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-700 rounded-lg">
            <p className="text-neutral-400 text-sm">Total Programs</p>
            <p className="text-2xl font-bold text-white mt-1">{programs.length}</p>
          </div>
          <div className="p-4 bg-neutral-700 rounded-lg">
            <p className="text-neutral-400 text-sm">Active Programs</p>
            <p className="text-2xl font-bold text-green-500 mt-1">
              {programs.filter(p => p.isActive).length}
            </p>
          </div>
          <div className="p-4 bg-neutral-700 rounded-lg">
            <p className="text-neutral-400 text-sm">Inactive Programs</p>
            <p className="text-2xl font-bold text-neutral-500 mt-1">
              {programs.filter(p => !p.isActive).length}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && programToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg max-w-md w-full border border-neutral-700 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Delete Program</h3>
                  <p className="text-neutral-400 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-neutral-300">
                  Are you sure you want to delete the <span className="font-semibold text-white">{programToDelete.title}</span> program? 
                  This will permanently remove it from your workout offerings.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProgramToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Delete Program
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
                ? 'bg-neutral-800 border-green-500 text-white'
                : 'bg-neutral-800 border-red-500 text-white'
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
                className="flex-shrink-0 text-neutral-400 hover:text-white transition-colors"
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
