'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProgram() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (id) fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/programs/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          title: data.program.title,
          description: data.program.description,
          icon: data.program.icon || '🏋️',
          color: data.program.color || '#CC1303',
          order: data.program.order || 0,
          targetAudience: data.program.targetAudience || '',
          duration: data.program.duration || '',
          isActive: data.program.isActive
        });
      } else {
        setError(data.error || 'Failed to load program');
      }
    } catch (err) {
      console.error('Error fetching program:', err);
      setError('Failed to load program');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/programs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/programs');
      } else {
        setError(data.error || 'Failed to update program');
      }
    } catch (err) {
      console.error('Error updating program:', err);
      setError('Failed to update program');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/programs/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/programs');
      } else {
        setError(data.error || 'Failed to delete program');
      }
    } catch (err) {
      console.error('Error deleting program:', err);
      setError('Failed to delete program');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 mt-4">Loading program...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Program</h1>
          <p className="text-gray-400">Update program details and settings</p>
        </div>
        <button
          onClick={() => router.push('/admin/programs')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          ← Back
        </button>
      </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
          {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            style={{ padding: '0.5rem 1rem' }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            style={{ padding: '0.5rem 1rem' }}
          />
        </div>

        {/* Icon and Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              maxLength={2}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg text-4xl text-center focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ padding: '0.5rem 1rem' }}
            />
            <p className="text-xs text-gray-400 mt-1">Single emoji character</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-20 bg-gray-700 border border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ padding: '0.5rem 1rem' }}
              />
            </div>
          </div>
        </div>

        {/* Target Audience and Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min={0}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            style={{ padding: '0.5rem 1rem' }}
          />
          <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">Active (visible on homepage)</label>
        </div>

        {/* Preview */}
        <div className="border border-gray-600 rounded-lg p-6 bg-gray-700/30">
          <p className="text-sm text-gray-400 mb-4">Preview:</p>
          <div
            className="bg-gray-900 border-2 rounded-lg p-6 text-center"
            style={{ borderColor: formData.color }}
          >
            <div className="text-5xl mb-4">{formData.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{formData.title}</h3>
            <p className="text-gray-300">{formData.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Delete Program
          </button>
          <div className="flex-1 flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/programs')}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Program'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
