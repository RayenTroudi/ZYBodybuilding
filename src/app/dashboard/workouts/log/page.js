'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';

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

  useEffect(() => {
    fetchExercises();
    if (planId) {
      loadPlanExercises(planId);
    }
  }, [planId]);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/user/exercises');
      const data = await response.json();
      if (data.success) {
        setAllExercises(data.exercises || []);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const loadPlanExercises = async (id) => {
    try {
      const response = await fetch(`/api/user/workout-plans/${id}`);
      const data = await response.json();
      if (data.success && data.planExercises) {
        const preloadedExercises = data.planExercises.map(pe => ({
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
        }));
        setExercises(preloadedExercises);
      }
    } catch (error) {
      console.error('Error loading plan:', error);
    }
  };

  const addExercise = (exercise) => {
    const newExercise = {
      exerciseId: exercise.$id,
      exerciseName: exercise.name,
      targetSets: 3,
      targetReps: '8-12',
      sets: [
        { setNumber: 1, weight: '', reps: '', setType: 'normal', completed: false },
        { setNumber: 2, weight: '', reps: '', setType: 'normal', completed: false },
        { setNumber: 3, weight: '', reps: '', setType: 'normal', completed: false },
      ],
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseModal(false);
    setSearchQuery('');
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addSet = (exerciseIndex) => {
    const updated = [...exercises];
    const exercise = updated[exerciseIndex];
    exercise.sets.push({
      setNumber: exercise.sets.length + 1,
      weight: '',
      reps: '',
      setType: 'normal',
      completed: false,
    });
    setExercises(updated);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    // Renumber sets
    updated[exerciseIndex].sets.forEach((set, i) => {
      set.setNumber = i + 1;
    });
    setExercises(updated);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const toggleSetComplete = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex].completed = !updated[exerciseIndex].sets[setIndex].completed;
    setExercises(updated);
  };

  const calculateTotalVolume = () => {
    return exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        if (set.weight && set.reps && set.completed) {
          return setTotal + (parseFloat(set.weight) * parseInt(set.reps));
        }
        return setTotal;
      }, 0);
    }, 0);
  };

  const calculateDuration = () => {
    return Math.round((new Date() - workoutStartTime.current) / 60000);
  };

  const handleSaveWorkout = async () => {
    if (exercises.length === 0) {
      alert(t.alertMin);
      return;
    }

    setSaving(true);

    try {
      const workoutData = {
        planId: planId || null,
        workoutDate: new Date().toISOString(),
        startTime: workoutStartTime.current.toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: calculateDuration(),
        totalVolume: calculateTotalVolume(),
        exerciseCount: exercises.length,
        rating: workoutRating || null,
        notes: workoutNotes || null,
        exercises: exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.filter(s => s.completed).map(s => ({
            setNumber: s.setNumber,
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps) || 0,
            setType: s.setType,
          })),
        })),
      };

      const response = await fetch('/api/user/workout-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        router.push('/dashboard/workouts');
      } else {
        const error = await response.json();
        alert(error.message || t.alertFail);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert(t.alertFail);
    } finally {
      setSaving(false);
    }
  };

  const filteredExercises = allExercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-neutral-400">
            {t.durationVol.replace('{d}', calculateDuration()).replace('{v}', (calculateTotalVolume() / 1000).toFixed(1))}
          </p>
        </div>
        <Link
          href="/dashboard/workouts"
          className="text-neutral-400 hover:text-white"
        >
          {t.cancel}
        </Link>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {exercises.map((exercise, exIndex) => (
          <div key={exIndex} className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-neutral-700/50">
              <div>
                <h3 className="font-semibold text-white">{exercise.exerciseName}</h3>
                <p className="text-sm text-neutral-400">{t.target.replace('{s}', exercise.targetSets).replace('{r}', exercise.targetReps)}</p>
              </div>
              <button
                onClick={() => removeExercise(exIndex)}
                className="text-red-500 hover:text-red-400 p-2"
              >
                🗑️
              </button>
            </div>
            
            <div className="p-4">
              {/* Set Headers */}
              <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-neutral-400 uppercase">
                <div className="col-span-2">{t.colSet}</div>
                <div className="col-span-3">{t.colWeight}</div>
                <div className="col-span-3">{t.colReps}</div>
                <div className="col-span-2">{t.colType}</div>
                <div className="col-span-2">{t.colDone}</div>
              </div>
              
              {/* Sets */}
              {exercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className={`grid grid-cols-12 gap-2 items-center py-2 ${
                    set.completed ? 'opacity-50' : ''
                  }`}
                >
                  <div className="col-span-2 text-white font-medium">
                    {set.setNumber}
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 bg-neutral-700 border border-neutral-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 bg-neutral-700 border border-neutral-600 rounded text-white text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={set.setType}
                      onChange={(e) => updateSet(exIndex, setIndex, 'setType', e.target.value)}
                      className="w-full px-1 py-1.5 bg-neutral-700 border border-neutral-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="normal">{t.typeNormal}</option>
                      <option value="warmup">{t.typeWarmup}</option>
                      <option value="dropset">{t.typeDropset}</option>
                      <option value="failure">{t.typeFailure}</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <button
                      onClick={() => toggleSetComplete(exIndex, setIndex)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        set.completed
                          ? 'bg-green-600 text-white'
                          : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                      }`}
                    >
                      ✓
                    </button>
                    {exercise.sets.length > 1 && (
                      <button
                        onClick={() => removeSet(exIndex, setIndex)}
                        className="w-8 h-8 rounded-lg bg-neutral-700 text-neutral-400 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => addSet(exIndex)}
                className="mt-2 w-full py-2 text-sm text-neutral-400 hover:text-white border border-dashed border-neutral-600 rounded-lg hover:border-neutral-500 transition-colors"
              >
                {t.addSet}
              </button>
            </div>
          </div>
        ))}

        {/* Add Exercise Button */}
        <button
          onClick={() => setShowExerciseModal(true)}
          className="w-full py-4 bg-neutral-800 border-2 border-dashed border-neutral-600 rounded-xl text-neutral-400 hover:text-white hover:border-red-500 transition-colors"
        >
          {t.addExercise}
        </button>
      </div>

      {/* Workout Notes & Rating */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">{t.notesLabel}</label>
          <textarea
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            rows={2}
            placeholder={t.notesPlaceholder}
            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">{t.rateLabel}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setWorkoutRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  star <= workoutRating ? 'text-yellow-500' : 'text-neutral-600'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-700 lg:left-64">
        <button
          onClick={handleSaveWorkout}
          disabled={saving || exercises.length === 0}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? t.saving : t.finish}
        </button>
      </div>

      {/* Exercise Selection Modal */}
      {showExerciseModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50"
          onClick={() => setShowExerciseModal(false)}
        >
          <div
            className="bg-neutral-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{t.modalTitle}</h3>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="text-neutral-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="overflow-y-auto max-h-[60vh]">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  {t.noExercises}
                </div>
              ) : (
                filteredExercises.map((exercise) => (
                  <button
                    key={exercise.$id}
                    onClick={() => addExercise(exercise)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-neutral-700 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center text-xl">
                      💪
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{exercise.name}</p>
                      <p className="text-sm text-neutral-400">
                        {exercise.muscleGroup} • {exercise.equipment}
                      </p>
                    </div>
                    <span className="text-neutral-400">+</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LogWorkoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400">{translations['fr'].loading}</p>
        </div>
      </div>
    }>
      <WorkoutLogContent />
    </Suspense>
  );
}
