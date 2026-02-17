'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Mail } from 'lucide-react';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, trainer: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/trainers', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setTrainers(data.trainers);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to fetch trainers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/trainers/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        showToast('Trainer deleted successfully', 'success');
        fetchTrainers();
        setDeleteModal({ show: false, trainer: null });
      } else {
        showToast(data.error || 'Failed to delete trainer', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to delete trainer', 'error');
    }
  };

  const toggleActive = async (trainerId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/trainers/${trainerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (response.ok) {
        showToast(`Trainer ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
        fetchTrainers();
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to update trainer', 'error');
      }
    } catch (error) {
      console.error('Error updating trainer:', error);
      showToast('Failed to update trainer', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const stats = {
    total: trainers.length,
    active: trainers.filter(t => t.isActive).length,
    inactive: trainers.filter(t => !t.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Trainers</h1>
          <p className="text-neutral-400 mt-1">Manage gym trainers and coaches</p>
        </div>
        <Link
          href="/admin/trainers/new"
          className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
        >
          <span className="mr-2">+</span>
          Add Trainer
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-800 rounded p-6 border border-neutral-700">
          <div className="text-neutral-400 text-sm mb-1">Total Trainers</div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-neutral-800 rounded p-6 border border-green-500/30">
          <div className="text-neutral-400 text-sm mb-1">Active</div>
          <div className="text-3xl font-bold text-green-400">{stats.active}</div>
        </div>
        <div className="bg-neutral-800 rounded p-6 border border-neutral-700">
          <div className="text-neutral-400 text-sm mb-1">Inactive</div>
          <div className="text-3xl font-bold text-neutral-400">{stats.inactive}</div>
        </div>
      </div>

      {/* Trainers Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-12 bg-neutral-800 rounded border border-neutral-700">
          <p className="text-neutral-400">No trainers found. Add your first trainer!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-neutral-800 rounded overflow-hidden border ${
                trainer.isActive ? 'border-green-500/50' : 'border-neutral-700'
              } hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
            >
              {/* Trainer Image */}
              <div className="relative h-32 bg-neutral-700">
                {trainer.imageUrl ? (
                  <Image
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-lg font-bold">
                    <span className="text-4xl font-bold text-white">
                      {trainer.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActive(trainer.$id, trainer.isActive);
                    }}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      trainer.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-600 text-neutral-300'
                    }`}
                  >
                    {trainer.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{trainer.name}</h3>
                {trainer.specialty && (
                  <p className="text-red-400 text-xs font-medium mb-2">{trainer.specialty}</p>
                )}
                {trainer.bio && (
                  <p className="text-neutral-400 text-xs mb-3 line-clamp-2">{trainer.bio}</p>
                )}
                
                {/* Experience & Email */}
                <div className="space-y-1 mb-3 text-xs">
                  {trainer.experienceYears > 0 && (
                    <div className="flex items-center text-neutral-400">
                      <span className="mr-1.5">⭐</span>
                      <span>{trainer.experienceYears} yrs exp</span>
                    </div>
                  )}
                  {trainer.email && (
                    <div className="flex items-center text-neutral-400">
                      <span className="mr-1.5">✉️</span>
                      <span className="truncate">{trainer.email}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/trainers/${trainer.$id}`}
                    className="flex-1 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-center rounded-md transition-colors text-xs font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ show: true, trainer })}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal({ show: false, trainer: null })}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-neutral-800 rounded-md p-6 max-w-md w-full border border-neutral-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Trainer</h3>
                <p className="text-neutral-400">
                  Are you sure you want to delete <span className="text-white font-medium">{deleteModal.trainer?.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, trainer: null })}
                  className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.trainer.$id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded shadow-lg ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white font-medium z-50`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
