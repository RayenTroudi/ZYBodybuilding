'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const muscleGroups = [
  { id: 'all', name: 'All Muscles', icon: '💪' },
  { id: 'chest', name: 'Chest', icon: '🫁' },
  { id: 'back', name: 'Back', icon: '🔙' },
  { id: 'shoulders', name: 'Shoulders', icon: '🤷' },
  { id: 'biceps', name: 'Biceps', icon: '💪' },
  { id: 'triceps', name: 'Triceps', icon: '💪' },
  { id: 'quadriceps', name: 'Quads', icon: '🦵' },
  { id: 'hamstrings', name: 'Hamstrings', icon: '🦵' },
  { id: 'glutes', name: 'Glutes', icon: '🍑' },
  { id: 'calves', name: 'Calves', icon: '🦵' },
  { id: 'core', name: 'Core', icon: '🎯' },
  { id: 'cardio', name: 'Cardio', icon: '❤️' },
];

const equipmentTypes = [
  { id: 'all', name: 'All Equipment' },
  { id: 'barbell', name: 'Barbell' },
  { id: 'dumbbell', name: 'Dumbbell' },
  { id: 'cable', name: 'Cable' },
  { id: 'machine', name: 'Machine' },
  { id: 'bodyweight', name: 'Bodyweight' },
  { id: 'kettlebell', name: 'Kettlebell' },
];

export default function ExercisesPage() {
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
      
      if (data.success) {
        setExercises(data.exercises || []);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-500/20';
      case 'intermediate': return 'text-yellow-500 bg-yellow-500/20';
      case 'advanced': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
          <p className="text-gray-400">Browse and learn {exercises.length} exercises</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          {/* Equipment Filter */}
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {equipmentTypes.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.name}</option>
            ))}
          </select>
        </div>

        {/* Muscle Group Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {muscleGroups.map(muscle => (
            <button
              key={muscle.id}
              onClick={() => setSelectedMuscle(muscle.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMuscle === muscle.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {muscle.icon} {muscle.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400">Loading exercises...</p>
          </div>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-gray-400">No exercises found matching your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map(exercise => (
            <div
              key={exercise.$id}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-red-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-red-500/10"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white">{exercise.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {exercise.description || 'No description available'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                  {exercise.muscleGroup}
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                  {exercise.equipment}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedExercise.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {selectedExercise.muscleGroup}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {selectedExercise.equipment}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(selectedExercise.difficulty)}`}>
                      {selectedExercise.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {selectedExercise.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Description</h3>
                  <p className="text-gray-300">{selectedExercise.description}</p>
                </div>
              )}

              {selectedExercise.instructions && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Instructions</h3>
                  <p className="text-gray-300 whitespace-pre-line">{selectedExercise.instructions}</p>
                </div>
              )}

              {selectedExercise.tips && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">💡 Pro Tips</h3>
                  <p className="text-gray-300">{selectedExercise.tips}</p>
                </div>
              )}

              {selectedExercise.secondaryMuscles?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Secondary Muscles</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.secondaryMuscles.map((muscle, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <Link
                  href={`/dashboard/workouts/log?exercise=${selectedExercise.$id}`}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-center hover:bg-red-700 transition-colors"
                >
                  Add to Workout
                </Link>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
