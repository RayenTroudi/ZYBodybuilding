'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cachedFetch, invalidateCache } from '@/lib/cache';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DIFFICULTIES = ['Débutant', 'Intermédiaire', 'Avancé'];
const CATEGORIES = ['Cardio', 'Musculation', 'Yoga', 'HIIT', 'Fitness', 'CrossFit', 'Stretching', 'Boxing', 'Pilates', 'Cycling'];
const ICONS = ['🏋️', '🏃', '🧘', '🥊', '🚴', '💪', '⚡', '🔥', '🎯', '💯'];

export default function NewClassPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dayOfWeek: 'Lundi',
    startTime: '07:00',
    endTime: '08:00',
    trainerId: '',
    difficulty: 'Intermédiaire',
    category: 'Fitness',
    caloriesBurn: 300,
    duration: 60,
    availableSpots: 20,
    bookedSpots: 0,
    color: '#CC1303',
    icon: '🏋️',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const data = await cachedFetch('/api/admin/trainers', {}, 300000); // 5 min cache
      if (data.success && data.trainers.length > 0) {
        setTrainers(data.trainers.filter(t => t.isActive));
        setFormData(prev => ({ ...prev, trainerId: data.trainers[0].$id }));
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          caloriesBurn: parseInt(formData.caloriesBurn),
          duration: parseInt(formData.duration),
          availableSpots: parseInt(formData.availableSpots),
          bookedSpots: parseInt(formData.bookedSpots),
          order: parseInt(formData.order),
        }),
      });

      if (response.ok) {
        router.push('/admin/classes');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create class');
      }
    } catch (error) {
      alert('Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/classes"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Class</h1>
          <p className="text-gray-400 mt-1">Create a new class schedule</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="HIIT Explosif"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="High-intensity interval training for maximum results..."
              />
            </div>

            {/* Day and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Day <span className="text-red-500">*</span>
                </label>
                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Trainer */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trainer
              </label>
              <select
                name="trainerId"
                value={formData.trainerId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">No trainer assigned</option>
                {trainers.map(trainer => (
                  <option key={trainer.$id} value={trainer.$id}>
                    {trainer.name} {trainer.specialty && `- ${trainer.specialty}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {DIFFICULTIES.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calories, Duration, Spots */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  name="caloriesBurn"
                  value={formData.caloriesBurn}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (min) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Spots
                </label>
                <input
                  type="number"
                  name="availableSpots"
                  value={formData.availableSpots}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Icon and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`text-2xl p-3 rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-red-500 bg-gray-700'
                          : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full h-12 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
              />
              <label className="ml-2 text-sm text-gray-300">Active</label>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Link
                href="/admin/classes"
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">
                    {formData.title || 'Class Title'}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {formData.startTime} - {formData.endTime}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  formData.difficulty === 'Débutant' ? 'bg-green-600' :
                  formData.difficulty === 'Intermédiaire' ? 'bg-yellow-600' : 'bg-red-600'
                } text-white`}>
                  {formData.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                  {formData.category}
                </span>
                {formData.caloriesBurn > 0 && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">
                    🔥 {formData.caloriesBurn}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
