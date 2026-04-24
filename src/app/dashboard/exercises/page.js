'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, ChevronRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';
import GlassCard from '../components/GlassCard';
import PageTransition from '../components/PageTransition';

const muscleGroupIds = ['all','chest','back','shoulders','biceps','triceps','quadriceps','hamstrings','glutes','calves','core','cardio'];
const equipmentIds = ['all','barbell','dumbbell','cable','machine','bodyweight','kettlebell'];

const muscleColors = {
  chest: 'bg-red-500/15 text-red-400 border-red-500/20',
  back: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  shoulders: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  biceps: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  triceps: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  quadriceps: 'bg-green-500/15 text-green-400 border-green-500/20',
  hamstrings: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  glutes: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  calves: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  core: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  cardio: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  all: 'bg-white/10 text-white border-white/15',
};

const difficultyConfig = {
  beginner: 'text-green-400 bg-green-400/12 border-green-400/20',
  intermediate: 'text-yellow-400 bg-yellow-400/12 border-yellow-400/20',
  advanced: 'text-red-400 bg-red-400/12 border-red-400/20',
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

export default function ExercisesPage() {
  const { lang } = useLanguage();
  const t = translations[lang].exercises;
  const tCommon = translations[lang];

  const muscleGroups = muscleGroupIds.map((id) => ({ id, name: t.muscles[id] }));
  const equipmentTypes = equipmentIds.map((id) => ({ id, name: t.equipment[id] }));

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, [selectedMuscle, selectedEquipment]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedMuscle !== 'all') params.append('muscleGroup', selectedMuscle);
      if (selectedEquipment !== 'all') params.append('equipment', selectedEquipment);
      const response = await fetch(`/api/user/exercises?${params}`);
      const data = await response.json();
      if (data.success) setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">{t.title}</h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            {t.subtitle.replace('{n}', exercises.length)}
          </p>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 space-y-4">
          {/* Search + Equipment */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/40 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
            >
              {equipmentTypes.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.name}</option>
              ))}
            </select>
          </div>

          {/* Muscle group pills */}
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle) => {
              const isActive = selectedMuscle === muscle.id;
              const colorCls = muscleColors[muscle.id] || muscleColors.all;
              return (
                <button
                  key={muscle.id}
                  onClick={() => setSelectedMuscle(muscle.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isActive ? colorCls : 'bg-white/5 text-neutral-500 border-white/8 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {muscle.name}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Exercise Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredExercises.length === 0 ? (
          <GlassCard className="text-center py-14">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Search size={20} className="text-neutral-500" />
            </div>
            <p className="text-neutral-400">{t.noResults}</p>
          </GlassCard>
        ) : (
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredExercises.map((exercise) => {
              const muscleCls = muscleColors[exercise.muscleGroup] || muscleColors.all;
              const diffCls = difficultyConfig[exercise.difficulty] || difficultyConfig.intermediate;
              return (
                <motion.div
                  key={exercise.$id}
                  variants={stagger.item}
                  whileHover={{ y: -3 }}
                  onClick={() => setSelectedExercise(exercise)}
                  className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-4 cursor-pointer hover:border-primary/25 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm leading-snug pr-2 group-hover:text-primary transition-colors">
                      {exercise.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${diffCls}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  {exercise.description && (
                    <p className="text-[11px] text-neutral-500 mb-3 line-clamp-2 leading-relaxed">
                      {exercise.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${muscleCls}`}>
                      {exercise.muscleGroup}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/8 text-neutral-400 border border-white/8">
                      {exercise.equipment}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
              onClick={() => setSelectedExercise(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="bg-[#111] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-display text-2xl font-black text-white tracking-tight">
                        {selectedExercise.name}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${muscleColors[selectedExercise.muscleGroup] || muscleColors.all}`}>
                          {selectedExercise.muscleGroup}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-white/8 text-neutral-400 border border-white/8">
                          {selectedExercise.equipment}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${difficultyConfig[selectedExercise.difficulty] || difficultyConfig.intermediate}`}>
                          {selectedExercise.difficulty}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedExercise(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {selectedExercise.description && (
                    <div className="mb-5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{t.sectionDesc}</p>
                      <p className="text-neutral-300 text-sm leading-relaxed">{selectedExercise.description}</p>
                    </div>
                  )}
                  {selectedExercise.instructions && (
                    <div className="mb-5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{t.sectionInstructions}</p>
                      <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">{selectedExercise.instructions}</p>
                    </div>
                  )}
                  {selectedExercise.tips && (
                    <div className="mb-5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{t.sectionTips}</p>
                      <p className="text-neutral-300 text-sm leading-relaxed">{selectedExercise.tips}</p>
                    </div>
                  )}
                  {selectedExercise.secondaryMuscles?.length > 0 && (
                    <div className="mb-5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{t.sectionSecondary}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.secondaryMuscles.map((muscle, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white/5 text-neutral-300 rounded-lg text-xs border border-white/8">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-white/8">
                    <Link
                      href={`/dashboard/workouts/log?exercise=${selectedExercise.$id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-[0_2px_12px_rgba(204,19,3,0.3)]"
                    >
                      <Zap size={14} />
                      {t.addToWorkout}
                    </Link>
                    <button
                      onClick={() => setSelectedExercise(null)}
                      className="px-4 py-2.5 bg-white/5 text-white text-sm rounded-xl hover:bg-white/10 transition-all border border-white/8"
                    >
                      {t.close}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
