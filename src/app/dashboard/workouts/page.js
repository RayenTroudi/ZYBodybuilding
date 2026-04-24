'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Plus, Clock, BarChart3, Trash2, Zap,
  ChevronRight, ClipboardList, Calendar,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';
import GlassCard from '../components/GlassCard';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

const difficultyConfig = {
  beginner: { label: 'Beginner', class: 'text-green-400 bg-green-400/15 border border-green-400/20' },
  intermediate: { label: 'Intermediate', class: 'text-yellow-400 bg-yellow-400/15 border border-yellow-400/20' },
  advanced: { label: 'Advanced', class: 'text-red-400 bg-red-400/15 border border-red-400/20' },
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  },
};

export default function WorkoutsPage() {
  const { lang } = useLanguage();
  const t = translations[lang].workouts;
  const tCommon = translations[lang];

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

  const tabs = [
    { id: 'history', label: t.history, icon: Calendar },
    { id: 'plans', label: t.plans, icon: ClipboardList },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-white tracking-tight">{t.title}</h1>
            <p className="text-neutral-500 text-sm mt-0.5">{t.subtitle}</p>
          </div>
          <Link
            href="/dashboard/workouts/log"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(204,19,3,0.3)] hover:bg-primary/90 transition-all"
          >
            <Zap size={15} />
            {t.logBtn}
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {activeTab === id && (
                <motion.span
                  layoutId="workoutTab"
                  className="absolute inset-0 bg-primary rounded-lg shadow-[0_2px_12px_rgba(204,19,3,0.3)]"
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader rows={4} />
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'history' ? (
              <WorkoutHistory key="history" logs={workoutLogs} t={t} lang={lang} />
            ) : (
              <WorkoutPlans
                key="plans"
                plans={workoutPlans}
                t={t}
                onNewPlan={() => setShowNewPlanModal(true)}
                onRefresh={fetchWorkoutData}
              />
            )}
          </AnimatePresence>
        )}

        {showNewPlanModal && (
          <NewPlanModal
            t={t}
            onClose={() => setShowNewPlanModal(false)}
            onSuccess={() => { setShowNewPlanModal(false); fetchWorkoutData(); }}
          />
        )}
      </div>
    </PageTransition>
  );
}

function WorkoutHistory({ logs, t, lang }) {
  if (logs.length === 0) {
    return (
      <GlassCard className="text-center py-14">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
          <Dumbbell size={22} className="text-neutral-500" />
        </div>
        <p className="text-neutral-400 mb-4">{t.noHistory}</p>
        <Link
          href="/dashboard/workouts/log"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary text-sm font-semibold rounded-xl hover:bg-primary/30 transition-all border border-primary/30"
        >
          {t.logFirst}
        </Link>
      </GlassCard>
    );
  }

  const groupedLogs = logs.reduce((acc, log) => {
    const monthKey = format(new Date(log.workoutDate), 'MMMM yyyy');
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(log);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {Object.entries(groupedLogs).map(([month, monthLogs]) => (
        <div key={month}>
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-3 px-1">
            {month}
          </p>
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {monthLogs.map((log) => (
              <motion.div key={log.$id} variants={stagger.item}>
                <Link
                  href={`/dashboard/workouts/${log.$id}`}
                  className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/[0.06] rounded-xl hover:border-primary/25 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-display font-black text-primary leading-none">
                      {format(new Date(log.workoutDate), 'd')}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-primary/70">
                      {format(new Date(log.workoutDate), 'EEE')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {log.planName || (lang === 'fr' ? 'Séance rapide' : 'Quick Workout')}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Dumbbell size={10} />
                        {log.exerciseCount || 0} ex.
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Clock size={10} />
                        {log.durationMinutes || 0} min
                      </span>
                      {log.totalVolume > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-green-500 font-semibold">
                          <BarChart3 size={10} />
                          {(log.totalVolume / 1000).toFixed(1)}k kg
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-neutral-700 group-hover:text-neutral-400 transition-colors shrink-0"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

function WorkoutPlans({ plans, t, onNewPlan, onRefresh }) {
  const handleDeletePlan = async (planId) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      const response = await fetch(`/api/user/workout-plans/${planId}`, { method: 'DELETE' });
      if (response.ok) onRefresh();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {plans.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={onNewPlan}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/8 text-white text-sm font-semibold rounded-xl hover:bg-white/12 transition-all border border-white/8"
          >
            <Plus size={15} />
            {t.newPlan}
          </button>
        </div>
      )}

      {plans.length === 0 ? (
        <GlassCard className="text-center py-14">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <ClipboardList size={22} className="text-neutral-500" />
          </div>
          <p className="text-neutral-400 mb-4">{t.noPlans}</p>
          <button
            onClick={onNewPlan}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary text-sm font-semibold rounded-xl hover:bg-primary/30 transition-all border border-primary/30"
          >
            <Plus size={14} />
            {t.createFirst}
          </button>
        </GlassCard>
      ) : (
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 gap-4"
        >
          {plans.map((plan) => {
            const diff = difficultyConfig[plan.difficulty] || difficultyConfig.intermediate;
            return (
              <motion.div
                key={plan.$id}
                variants={stagger.item}
                whileHover={{ y: -2 }}
              >
                <GlassCard className="p-5 hover:border-primary/20 transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-white text-lg tracking-tight truncate">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {t.types?.[plan.type] || plan.type?.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2 shrink-0">
                      <Link
                        href={`/dashboard/workouts/log?plan=${plan.$id}`}
                        className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_2px_8px_rgba(204,19,3,0.3)]"
                      >
                        {t.start}
                      </Link>
                      <button
                        onClick={() => handleDeletePlan(plan.$id)}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 text-neutral-500 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-neutral-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                      {plan.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    <span className="px-2.5 py-1 bg-blue-500/15 text-blue-400 rounded-lg text-[11px] font-semibold border border-blue-500/20">
                      {plan.daysPerWeek}×/{t.perWeek}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${diff.class}`}>
                      {t.difficulties?.[plan.difficulty] || plan.difficulty}
                    </span>
                    {plan.estimatedDuration && (
                      <span className="px-2.5 py-1 bg-white/8 text-neutral-400 rounded-lg text-[11px] font-semibold border border-white/8 flex items-center gap-1">
                        <Clock size={10} />
                        {plan.estimatedDuration} min
                      </span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

function NewPlanModal({ t, onClose, onSuccess }) {
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
      if (response.ok) onSuccess();
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/40 transition-all';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-[#111] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-white mb-5">{t.modalTitle}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">{t.planName}</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputCls} placeholder={t.planNamePlaceholder} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">{t.description}</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className={inputCls} placeholder={t.descPlaceholder} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">{t.type}</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={inputCls}>
                  {Object.entries(t.types || {}).map(([val, label]) => (<option key={val} value={val}>{label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">{t.daysPerWeek}</label>
                <select value={formData.daysPerWeek} onChange={(e) => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) })} className={inputCls}>
                  {[1,2,3,4,5,6,7].map(n => (<option key={n} value={n}>{n} {n > 1 ? t.days_plural : t.day}</option>))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">{t.level}</label>
                <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className={inputCls}>
                  {Object.entries(t.difficulties || {}).map(([val, label]) => (<option key={val} value={val}>{label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">{t.duration}</label>
                <input type="number" value={formData.estimatedDuration} onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })} min={15} max={180} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/5 text-white text-sm rounded-xl hover:bg-white/10 transition-all border border-white/8">{t.cancel}</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-[0_2px_12px_rgba(204,19,3,0.3)]">{saving ? t.creating : t.createPlan}</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
