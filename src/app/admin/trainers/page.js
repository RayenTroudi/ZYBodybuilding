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
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>Staff</p>
          <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Trainers
          </h1>
        </div>
        <Link
          href="/admin/trainers/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors"
          style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          + Add Trainer
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Total</p>
          <p className="text-white font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem' }}>{stats.total}</p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Active</p>
          <p className="font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem', color: '#10B981' }}>{stats.active}</p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Inactive</p>
          <p className="font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem', color: '#333' }}>{stats.inactive}</p>
        </div>
      </div>

      {/* Trainers Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : trainers.length === 0 ? (
        <div className="bg-[#0c0c0c] border border-[#161616] py-16 text-center">
          <p className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>No trainers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.$id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#0c0c0c] border overflow-hidden group transition-colors duration-200 ${
                trainer.isActive ? 'border-[#1e1e1e] hover:border-[#2a2a2a]' : 'border-[#111] opacity-60'
              }`}
            >
              {/* Image */}
              <div className="relative h-36 bg-[#0a0a0a]">
                {trainer.imageUrl ? (
                  <Image src={trainer.imageUrl} alt={trainer.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#111]">
                    <span className="text-neutral-700 font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem' }}>
                      {trainer.name.charAt(0)}
                    </span>
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleActive(trainer.$id, trainer.isActive); }}
                  className={`absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${
                    trainer.isActive
                      ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20'
                      : 'bg-[#111] border-[#222] text-neutral-600 hover:text-white'
                  }`}
                  style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {trainer.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Info */}
              <div className="p-4 border-t border-[#161616]">
                <h3 className="text-white font-black uppercase leading-none mb-1 truncate" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', letterSpacing: '0.03em' }}>
                  {trainer.name}
                </h3>
                {trainer.specialty && (
                  <p className="text-primary text-[10px] uppercase font-semibold mb-2" style={{ letterSpacing: '0.08em' }}>{trainer.specialty}</p>
                )}
                {trainer.bio && (
                  <p className="text-neutral-600 text-xs mb-3 line-clamp-2 leading-relaxed">{trainer.bio}</p>
                )}
                <div className="space-y-1 mb-4 text-[10px] text-neutral-600">
                  {trainer.experienceYears > 0 && <p>{trainer.experienceYears} yrs experience</p>}
                  {trainer.email && <p className="truncate">{trainer.email}</p>}
                </div>
                <div className="flex gap-2 border-t border-[#111] pt-3">
                  <Link
                    href={`/admin/trainers/${trainer.$id}`}
                    className="flex-1 py-1.5 border border-[#1e1e1e] text-neutral-600 text-center text-[10px] font-semibold uppercase hover:border-[#2a2a2a] hover:text-white transition-colors"
                    style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ show: true, trainer })}
                    className="px-3 py-1.5 border border-red-600/20 text-red-600/50 text-[10px] font-semibold uppercase hover:border-red-600/40 hover:text-red-500 transition-colors"
                    style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Del
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal({ show: false, trainer: null })}
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
              className="bg-[#0c0c0c] border border-[#1e1e1e] max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-[#161616]">
                <h3 className="text-white font-black uppercase text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}>
                  Delete Trainer
                </h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Delete <span className="text-white font-semibold">{deleteModal.trainer?.name}</span>? This cannot be undone.
                </p>
              </div>
              <div className="flex border-t border-[#161616]">
                <button
                  onClick={() => setDeleteModal({ show: false, trainer: null })}
                  className="flex-1 py-3 text-neutral-600 text-xs font-semibold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                  style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.trainer.$id)}
                  className="flex-1 py-3 text-red-500 text-xs font-semibold uppercase hover:text-white hover:bg-red-600 transition-colors"
                  style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 border-l-2 min-w-[260px] bg-[#0c0c0c] border border-[#1e1e1e] ${
              toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
            }`}
          >
            <p className="text-white text-xs flex-1">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
