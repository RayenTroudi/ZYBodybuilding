'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Check, X, Search, Dumbbell, Clock,
  BarChart3, Star, ChevronDown, Trophy, Zap, ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';
import GlassCard from '../../components/GlassCard';

const SET_TYPE_CONFIG = {
  normal: { label: 'Normal', class: 'bg-white/8 text-neutral-300 border-white/10' },
  warmup: { label: 'W-Up', class: 'bg-blue-500/20 text-blue-400 border-blue-500/25' },
  dropset: { label: 'Drop', class: 'bg-orange-500/20 text-orange-400 border-orange-500/25' },
  failure: { label: 'Fail', class: 'bg-red-500/20 text-red-400 border-red-500/25' },
};

function WorkoutLogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const { lang } = useLanguage();
  const t = translations[lang].log;

  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const workoutStartTime = useRef(null);
  if (!workoutStartTime.current) workoutStartTime.current = new Date();
  const [saving, setSaving] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [workoutRating, setWorkoutRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [elapsed, setElapsed] = useState(0);

  // Live timer
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.round((new Date() - workoutStartTime.current) / 60000));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchExercises();
    if (planId) loadPlanExercises(planId);
  }, [planId]);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/user/exercises');
      const data = await response.json();
      if (data.success) setAllExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const loadPlanExercises = async (id) => {
    try {
      const response = await fetch(`/api/user/workout-plans/${id}`);
      const data = await response.json();
      if (data.success && data.planExercises) {
        setExercises(
          data.planExercises.map((pe) => ({
            exerciseId: pe.exerciseId,
            exerciseName: pe.exerciseName || 'Unknown Exercise',
            targetSets: pe.targetSets,
            targetReps: pe.targetReps,
            sets: Array(pe.targetSets).fill(null).map((_, i) => ({
              setNumber: i + 1,
              weight: '',
              reps: '',
              setType: 'normal',
              completed: false,
            })),
          }))
        );
      }
    } catch (error) {
      console.error('Error loading plan:', error);
    }
  };

  const addExercise = (exercise) => {
    setExercises([...exercises, {
      exerciseId: exercise.$id,
      exerciseName: exercise.name,
      targetSets: 3,
      targetReps: '8-12',
      sets: Array(3).fill(null).map((_, i) => ({
        setNumber: i + 1, weight: '', reps: '', setType: 'normal', completed: false,
      })),
    }]);
    setShowExerciseModal(false);
    setSearchQuery('');
  };

  const removeExercise = (index) => setExercises(exercises.filter((_, i) => i !== index));

  const addSet = (exIdx) => {
    const updated = [...exercises];
    const ex = updated[exIdx];
    ex.sets.push({ setNumber: ex.sets.length + 1, weight: '', reps: '', setType: 'normal', completed: false });
    setExercises(updated);
  };

  const removeSet = (exIdx, setIdx) => {
    const updated = [...exercises];
    updated[exIdx].sets = updated[exIdx].sets.filter((_, i) => i !== setIdx);
    updated[exIdx].sets.forEach((s, i) => { s.setNumber = i + 1; });
    setExercises(updated);
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx][field] = value;
    setExercises(updated);
  };

  const toggleSetComplete = (exIdx, setIdx) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx].completed = !updated[exIdx].sets[setIdx].completed;
    setExercises(updated);
  };

  const totalVolume = exercises.reduce((t, ex) =>
    t + ex.sets.reduce((s, set) =>
      set.weight && set.reps && set.completed
        ? s + parseFloat(set.weight) * parseInt(set.reps) : s, 0), 0);

  const completedSets = exercises.reduce((t, ex) => t + ex.sets.filter((s) => s.completed).length, 0);

  const calculateDuration = () => Math.round((new Date() - workoutStartTime.current) / 60000);

  const handleSaveWorkout = async () => {
    if (exercises.length === 0) { alert(t.alertMin); return; }
    setSaving(true);
    try {
      const response = await fetch('/api/user/workout-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId || null,
          workoutDate: new Date().toISOString(),
          startTime: workoutStartTime.current.toISOString(),
          endTime: new Date().toISOString(),
          durationMinutes: calculateDuration(),
          totalVolume,
          exerciseCount: exercises.length,
          rating: workoutRating || null,
          notes: workoutNotes || null,
          exercises: exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            sets: ex.sets.filter((s) => s.completed).map((s) => ({
              setNumber: s.setNumber,
              weight: parseFloat(s.weight) || 0,
              reps: parseInt(s.reps) || 0,
              setType: s.setType,
            })),
          })),
        }),
      });
      if (response.ok) router.push('/dashboard/workouts');
      else {
        const err = await response.json();
        alert(err.message || t.alertFail);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert(t.alertFail);
    } finally {
      setSaving(false);
    }
  };

  const filteredExercises = allExercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/workouts"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all border border-white/8"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-display text-xl font-black text-white tracking-tight">{t.title}</h1>
            <p className="text-[11px] text-neutral-500">
              {t.durationVol
                .replace('{d}', elapsed)
                .replace('{v}', (totalVolume / 1000).toFixed(1))}
            </p>
          </div>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/8 text-xs">
            <Clock size={11} className="text-neutral-500" />
            <span className="text-neutral-300 font-semibold">{elapsed}min</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/8 text-xs">
            <BarChart3 size={11} className="text-green-400" />
            <span className="text-neutral-300 font-semibold">{(totalVolume / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>

      {/* Exercise Blocks */}
      <AnimatePresence>
        {exercises.map((exercise, exIdx) => (
          <motion.div
            key={exIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <GlassCard>
              {/* Exercise Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Dumbbell size={14} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{exercise.exerciseName}</h3>
                    <p className="text-[11px] text-neutral-500">
                      {t.target.replace('{s}', exercise.targetSets).replace('{r}', exercise.targetReps)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(exIdx)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-neutral-500 hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Sets */}
              <div className="p-4">
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-2 mb-2 px-1">
                  <div className="col-span-1 text-[10px] font-bold uppercase text-neutral-600">#</div>
                  <div className="col-span-3 text-[10px] font-bold uppercase text-neutral-600">{t.colWeight}</div>
                  <div className="col-span-3 text-[10px] font-bold uppercase text-neutral-600">{t.colReps}</div>
                  <div className="col-span-3 text-[10px] font-bold uppercase text-neutral-600">Type</div>
                  <div className="col-span-2 text-[10px] font-bold uppercase text-neutral-600 text-center">{t.colDone}</div>
                </div>

                <div className="space-y-2">
                  {exercise.sets.map((set, setIdx) => {
                    const typeCfg = SET_TYPE_CONFIG[set.setType] || SET_TYPE_CONFIG.normal;
                    return (
                      <motion.div
                        key={setIdx}
                        animate={{ opacity: set.completed ? 0.5 : 1 }}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-1 text-neutral-500 text-xs font-bold">{set.setNumber}</div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                          />
                        </div>
                        <div className="col-span-3">
                          <select
                            value={set.setType}
                            onChange={(e) => updateSet(exIdx, setIdx, 'setType', e.target.value)}
                            className={`w-full px-1.5 py-2 rounded-lg text-[11px] font-bold border focus:outline-none transition-all ${typeCfg.class}`}
                          >
                            <option value="normal">{t.typeNormal}</option>
                            <option value="warmup">{t.typeWarmup}</option>
                            <option value="dropset">{t.typeDropset}</option>
                            <option value="failure">{t.typeFailure}</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <button
                            onClick={() => toggleSetComplete(exIdx, setIdx)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              set.completed
                                ? 'bg-green-500/25 text-green-400 border border-green-500/30'
                                : 'bg-white/5 text-neutral-500 hover:bg-white/10 border border-white/8'
                            }`}
                          >
                            <Check size={13} strokeWidth={3} />
                          </button>
                          {exercise.sets.length > 1 && (
                            <button
                              onClick={() => removeSet(exIdx, setIdx)}
                              className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-red-400 transition-colors"
                            >
                              <X size={11} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <button
                  onClick={() => addSet(exIdx)}
                  className="mt-3 w-full py-2 text-xs text-neutral-500 hover:text-white border border-dashed border-white/10 rounded-lg hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={12} />
                  {t.addSet}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Exercise Button */}
      <button
        onClick={() => setShowExerciseModal(true)}
        className="w-full py-4 bg-white/[0.03] border-2 border-dashed border-white/10 rounded-2xl text-neutral-500 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        <span className="font-semibold text-sm">{t.addExercise}</span>
      </button>

      {/* Notes & Rating */}
      <GlassCard className="p-5 space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">{t.notesLabel}</label>
          <textarea
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            rows={2}
            placeholder={t.notesPlaceholder}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">{t.rateLabel}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setWorkoutRating(star)}
                className="transition-all hover:scale-110"
              >
                <Star
                  size={22}
                  className={star <= workoutRating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-700'}
                />
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Fixed Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#080808]/90 backdrop-blur-xl border-t border-white/5 lg:left-64 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs text-neutral-500 shrink-0">
            <span className="flex items-center gap-1">
              <Check size={11} className="text-green-400" />
              <span className="font-semibold text-white">{completedSets}</span> sets
            </span>
          </div>
          <button
            onClick={handleSaveWorkout}
            disabled={saving || exercises.length === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold text-sm rounded-xl shadow-[0_4px_20px_rgba(204,19,3,0.4)] hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={15} />
            {saving ? t.saving : t.finish}
          </button>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      <AnimatePresence>
        {showExerciseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
            onClick={() => setShowExerciseModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0f0f0f] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-base font-bold text-white">{t.modalTitle}</h3>
                  <button
                    onClick={() => setShowExerciseModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-all"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-10 text-neutral-500 text-sm">{t.noExercises}</div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <button
                      key={exercise.$id}
                      onClick={() => addExercise(exercise)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors text-left border-b border-white/[0.04] last:border-0"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                        <Dumbbell size={15} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm">{exercise.name}</p>
                        <p className="text-[11px] text-neutral-500">
                          {exercise.muscleGroup} · {exercise.equipment}
                        </p>
                      </div>
                      <Plus size={14} className="text-neutral-600 shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LogWorkoutPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 animate-pulse">
          <div className="h-12 bg-white/5 rounded-2xl border border-white/5" />
          <div className="h-48 bg-white/5 rounded-2xl border border-white/5" />
          <div className="h-48 bg-white/5 rounded-2xl border border-white/5" />
        </div>
      }
    >
      <WorkoutLogContent />
    </Suspense>
  );
}
