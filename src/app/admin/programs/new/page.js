'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProgram() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '🏋️',
    color: '#CC1303',
    order: 0,
    targetAudience: '',
    duration: '',
    isActive: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/programs');
      } else {
        setError(data.error || 'Failed to create program');
      }
    } catch (err) {
      console.error('Error creating program:', err);
      setError('Failed to create program');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-secondary text-text-color p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/programs')}
            className="text-primary-color hover:underline mb-4 inline-block"
          >
            ← Back to Programs
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ textShadow: 'var(--neon-glow)' }}>
            Create New Program
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-neutral-800 border border-neutral-600 rounded px-4 py-2 focus:outline-none focus:border-primary-color"
              placeholder="e.g., Strength Training"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-neutral-800 border border-neutral-600 rounded px-4 py-2 focus:outline-none focus:border-primary-color"
              placeholder="Describe the program..."
            />
          </div>

          {/* Icon and Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                maxLength={2}
                className="w-full bg-neutral-800 border border-neutral-600 rounded px-4 py-2 focus:outline-none focus:border-primary-color text-4xl text-center"
                placeholder="🏋️"
              />
              <p className="text-xs text-neutral-400 mt-1">Single emoji character</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10 w-20 bg-neutral-800 border border-neutral-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-4 py-2 focus:outline-none focus:border-primary-color"
                  placeholder="#CC1303"
                />
              </div>
            </div>
          </div>

          {/* Target Audience and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-600 rounded px-4 py-2 focus:outline-none focus:border-primary-color"
                placeholder="e.g., All levels"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-600 rounded px-4 py-2 focus:outline-none focus:border-primary-color"
                placeholder="e.g., 8-12 weeks"
              />
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min={0}
              className="w-full bg-neutral-800 border border-neutral-600 rounded px-4 py-2 focus:outline-none focus:border-primary-color"
              placeholder="0"
            />
            <p className="text-xs text-neutral-400 mt-1">Lower numbers appear first</p>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-primary-color"
            />
            <label className="text-sm font-medium">Active (visible on homepage)</label>
          </div>

          {/* Preview */}
          <div className="border border-neutral-600 rounded-lg p-6">
            <p className="text-sm text-neutral-400 mb-4">Preview:</p>
            <div
              className="bg-secondary border-2 rounded-lg p-6 text-center"
              style={{ borderColor: formData.color }}
            >
              <div className="text-5xl mb-4">{formData.icon || '🏋️'}</div>
              <h3 className="text-2xl font-bold mb-2">{formData.title || 'Program Title'}</h3>
              <p className="text-neutral-300">{formData.description || 'Program description...'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/programs')}
              className="flex-1 bg-neutral-700 text-white px-6 py-3 rounded-lg hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
