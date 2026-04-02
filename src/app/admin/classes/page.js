'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const FL = (text) => (
  <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>{text}</p>
);

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, classItem: null });
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, trainersData] = await Promise.all([
        fetch('/api/admin/classes', { cache: 'no-store' }).then(r => r.json()),
        fetch('/api/admin/trainers', { cache: 'no-store' }).then(r => r.json()),
      ]);
      if (classesData.success) setClasses(classesData.classes);
      if (trainersData.success) setTrainers(trainersData.trainers);
    } catch { showToast('Failed to load classes', 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/classes/${deleteModal.classItem.$id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
        showToast('Class deleted', 'success');
        setDeleteModal({ show: false, classItem: null });
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to delete class', 'error');
      }
    } catch { showToast('Failed to delete class', 'error'); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.$id === trainerId);
    return trainer ? trainer.name : 'No trainer';
  };

  const filteredClasses = selectedDay === 'all' ? classes : classes.filter(c => c.dayOfWeek === selectedDay);

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          {FL('Schedule')}
          <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Classes
          </h1>
        </div>
        <Link
          href="/admin/classes/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors"
          style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
          <Plus size={12} /> Add Class
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {FL('Total Classes')}
          <p className="text-white font-black leading-none mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem' }}>{classes.length}</p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {FL('Showing')}
          <p className="font-black leading-none mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem', color: '#CC1303' }}>{filteredClasses.length}</p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {FL('Days')}
          <p className="text-neutral-600 font-black leading-none mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem' }}>{DAYS_OF_WEEK.length}</p>
        </div>
      </div>

      {/* Day Filter */}
      <div className="bg-[#0c0c0c] border border-[#161616]">
        <div className="px-4 py-3 border-b border-[#111]">
          {FL('Filter by Day')}
        </div>
        <div className="flex flex-wrap gap-px p-1 bg-[#111]">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors ${selectedDay === 'all' ? 'bg-primary text-white' : 'bg-[#0c0c0c] text-neutral-600 hover:text-white hover:bg-[#111]'}`}
            style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
            All
          </button>
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors ${selectedDay === day ? 'bg-primary text-white' : 'bg-[#0c0c0c] text-neutral-600 hover:text-white hover:bg-[#111]'}`}
              style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Classes List */}
      {loading ? (
        <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
          <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
          <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading...</span>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-[#0c0c0c] border border-[#161616] py-16 text-center">
          <p className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>
            {selectedDay === 'all' ? 'No classes found' : `No classes on ${selectedDay}`}
          </p>
        </div>
      ) : (
        <div className="bg-[#0c0c0c] border border-[#161616] overflow-hidden">
          {filteredClasses.map((classItem, i) => (
            <div
              key={classItem.$id}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-[#0f0f0f] transition-colors group ${i < filteredClasses.length - 1 ? 'border-b border-[#111]' : ''}`}>
              {/* Left accent */}
              <div className="w-[2px] h-10 bg-[#1a1a1a] group-hover:bg-primary transition-colors flex-shrink-0" />

              {/* Image */}
              {classItem.imageFileId && (
                <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-[#111]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_TRAINER_IMAGES_BUCKET_ID}/files/${classItem.imageFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                    alt={classItem.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-black uppercase leading-none truncate" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                  {classItem.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-primary text-[10px] font-semibold uppercase" style={{ letterSpacing: '0.08em' }}>{classItem.dayOfWeek}</span>
                  <span className="text-neutral-700 text-[10px]">{classItem.startTime} — {classItem.endTime}</span>
                </div>
                <p className="text-neutral-600 text-[10px] mt-0.5">{getTrainerName(classItem.trainerId)}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-px flex-shrink-0">
                <Link
                  href={`/admin/classes/${classItem.$id}`}
                  className="px-4 py-2 border border-[#1e1e1e] text-neutral-600 text-[10px] font-bold uppercase hover:border-[#2a2a2a] hover:text-white transition-colors"
                  style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteModal({ show: true, classItem })}
                  className="px-4 py-2 border border-red-600/20 text-red-600/50 text-[10px] font-bold uppercase hover:border-red-600/40 hover:text-red-500 transition-colors"
                  style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && deleteModal.classItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-[#1e1e1e] max-w-sm w-full">
            <div className="px-5 py-4 border-b border-[#161616] flex items-center gap-3">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <h3 className="text-white font-black uppercase text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}>Delete Class</h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-neutral-500 text-xs leading-relaxed">
                Delete <span className="text-white font-semibold">{deleteModal.classItem.title}</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#161616]">
              <button
                onClick={() => setDeleteModal({ show: false, classItem: null })}
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
