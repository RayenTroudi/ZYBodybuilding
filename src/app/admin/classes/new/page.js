'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function NewClassPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    dayOfWeek: 'Lundi',
    startTime: '07:00',
    endTime: '08:00',
    trainerId: '',
    imageFileId: '',
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/admin/trainers', { cache: 'no-store' });
      const data = await response.json();
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
        body: JSON.stringify(formData),
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);

    try {
      if (formData.imageFileId) {
        try {
          await fetch(`/api/admin/upload-trainer-image?fileId=${formData.imageFileId}`, {
            method: 'DELETE',
          });
        } catch (deleteError) {
          console.error('Failed to delete old image:', deleteError);
        }
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/admin/upload-trainer-image', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, imageFileId: data.fileId }));
        setImagePreview(data.fileUrl);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleRemoveImage = async () => {
    if (formData.imageFileId) {
      try {
        await fetch(`/api/admin/upload-trainer-image?fileId=${formData.imageFileId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
    setFormData(prev => ({ ...prev, imageFileId: '' }));
    setImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/classes"
          className="text-neutral-400 hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Class</h1>
          <p className="text-neutral-400 mt-1">Create a new class schedule</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Class Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Yoga"
              />
            </div>

            {/* Day and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Day <span className="text-red-500">*</span>
                </label>
                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Trainer */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Trainer
              </label>
              <select
                name="trainerId"
                value={formData.trainerId}
                onChange={handleChange}
                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">No trainer assigned</option>
                {trainers.map(trainer => (
                  <option key={trainer.$id} value={trainer.$id}>
                    {trainer.name} {trainer.specialty && `- ${trainer.specialty}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/admin/classes"
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
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

        {/* Image Upload Preview */}
        <div className="md:col-span-1">
          <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Class Image</h3>
            <p className="text-sm text-neutral-400">Optional image for the class</p>

            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Class preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="imageUpload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer block"
                  >
                    {uploading ? (
                      <div className="space-y-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                        <p className="text-sm text-neutral-400">Uploading...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-4xl text-neutral-600">+</div>
                        <p className="text-sm text-neutral-400">Click to upload image</p>
                        <p className="text-xs text-neutral-500">JPEG, PNG, WebP (max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
