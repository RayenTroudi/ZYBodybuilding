'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cachedFetch, invalidateCache } from '@/lib/cache';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, classItem: null });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, trainersData] = await Promise.all([
        cachedFetch('/api/admin/classes', {}, 60000), // 1 min cache
        cachedFetch('/api/admin/trainers', {}, 300000), // 5 min cache
      ]);
      
      if (classesData.success) setClasses(classesData.classes);
      if (trainersData.success) setTrainers(trainersData.trainers);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (classItem) => {
    try {
      const response = await fetch(`/api/admin/classes/${classItem.$id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !classItem.isActive }),
      });

      if (response.ok) {
        invalidateCache('/api/admin/classes');
        fetchData();
        showToast(`Class ${classItem.isActive ? 'deactivated' : 'activated'}`, 'success');
      }
    } catch (error) {
      showToast('Failed to update class', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/classes/${deleteModal.classItem.$id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        invalidateCache('/api/admin/classes');
        fetchData();
        showToast('Class deleted successfully', 'success');
        setDeleteModal({ show: false, classItem: null });
      }
    } catch (error) {
      showToast('Failed to delete class', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.$id === trainerId);
    return trainer ? trainer.name : 'No trainer';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-600';
      case 'Intermédiaire': return 'bg-yellow-600';
      case 'Avancé': return 'bg-red-600';
      default: return 'bg-neutral-600';
    }
  };

  const filteredClasses = selectedDay === 'all' 
    ? classes 
    : classes.filter(c => c.dayOfWeek === selectedDay);

  const stats = {
    total: classes.length,
    active: classes.filter(c => c.isActive).length,
    inactive: classes.filter(c => !c.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Classes</h1>
          <p className="text-neutral-400 mt-1">Manage your gym class schedule</p>
        </div>
        <Link
          href="/admin/classes/new"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Add Class
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
          <div className="text-neutral-400 text-sm">Total Classes</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg border border-green-600">
          <div className="text-neutral-400 text-sm">Active</div>
          <div className="text-3xl font-bold text-green-500 mt-2">{stats.active}</div>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
          <div className="text-neutral-400 text-sm">Inactive</div>
          <div className="text-3xl font-bold text-neutral-500 mt-2">{stats.inactive}</div>
        </div>
      </div>

      {/* Day Filter */}
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedDay === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            All Days
          </button>
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Classes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClasses.map((classItem) => (
            <motion.div
              key={classItem.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-neutral-800 rounded-lg border ${
                classItem.isActive ? 'border-green-600' : 'border-neutral-700'
              } p-6 hover:shadow-xl transition-all`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Class Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{classItem.icon || '🏋️'}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{classItem.title}</h3>
                      <p className="text-neutral-400 text-sm">
                        {classItem.dayOfWeek} • {classItem.startTime} - {classItem.endTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(classItem.difficulty)} text-white`}>
                      {classItem.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                      {classItem.category}
                    </span>
                    {classItem.caloriesBurn > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">
                        🔥 {classItem.caloriesBurn} kcal
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                      👤 {getTrainerName(classItem.trainerId)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white">
                      📍 {classItem.bookedSpots || 0}/{classItem.availableSpots} spots
                    </span>
                  </div>

                  {classItem.description && (
                    <p className="text-neutral-400 text-sm">{classItem.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  <Link
                    href={`/admin/classes/${classItem.$id}`}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded text-center text-sm font-medium transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleActive(classItem)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      classItem.isActive
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {classItem.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, classItem })}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredClasses.length === 0 && !loading && (
        <div className="text-center py-12 bg-neutral-800 rounded-lg border border-neutral-700">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-neutral-400 text-lg">
            {selectedDay === 'all' ? 'No classes found' : `No classes on ${selectedDay}`}
          </p>
          <Link
            href="/admin/classes/new"
            className="inline-block mt-4 text-red-500 hover:text-red-400"
          >
            Add your first class
          </Link>
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-neutral-800 rounded-lg p-6 max-w-md w-full border border-neutral-700"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Class</h3>
                <p className="text-neutral-400 mb-6">
                  Are you sure you want to delete <strong>{deleteModal.classItem?.title}</strong>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({ show: false, classItem: null })}
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg ${
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
