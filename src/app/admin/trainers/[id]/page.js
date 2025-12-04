'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditTrainerPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    specialty: '',
    imageUrl: '',
    certifications: '',
    experienceYears: 0,
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchTrainer();
  }, []);

  const fetchTrainer = async () => {
    try {
      const response = await fetch(`/api/admin/trainers/${unwrappedParams.id}`);
      const data = await response.json();
      if (data.success) {
        const trainer = data.trainer;
        setFormData({
          name: trainer.name || '',
          email: trainer.email || '',
          bio: trainer.bio || '',
          specialty: trainer.specialty || '',
          imageUrl: trainer.imageUrl || '',
          certifications: trainer.certifications || '',
          experienceYears: trainer.experienceYears || 0,
          isActive: trainer.isActive ?? true,
          order: trainer.order || 0,
        });
        setImagePreview(trainer.imageUrl || null);
      }
    } catch (error) {
      alert('Failed to load trainer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/trainers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/trainers');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update trainer');
      }
    } catch (error) {
      alert('Failed to update trainer');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      // Delete old image if it exists and is from Appwrite storage
      if (formData.imageUrl && formData.imageUrl.includes('/storage/buckets/')) {
        const fileIdMatch = formData.imageUrl.match(/\/files\/([^\/]+)\//);
        if (fileIdMatch && fileIdMatch[1]) {
          const oldFileId = fileIdMatch[1];
          try {
            await fetch(`/api/admin/upload-trainer-image?fileId=${oldFileId}`, {
              method: 'DELETE',
            });
          } catch (deleteError) {
            console.error('Failed to delete old image:', deleteError);
            // Continue with upload even if delete fails
          }
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
        setFormData(prev => ({ ...prev, imageUrl: data.fileUrl }));
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

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/trainers"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Trainer</h1>
          <p className="text-gray-400 mt-1">Update trainer profile</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Specialty
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Strength Training & Nutrition"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tell us about this trainer..."
              />
            </div>

            {/* Trainer Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trainer Photo
              </label>
              
              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                {uploading ? (
                  <div className="py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600 mb-2"></div>
                    <p className="text-gray-400">Uploading...</p>
                  </div>
                ) : imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-700">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-400">Click or drag to change photo</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="text-5xl mb-3">📸</div>
                    <p className="text-gray-300 font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
                  </div>
                )}
              </div>
              
              {/* Or use URL */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Or enter image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/trainer-photo.jpg"
                />
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Certifications
              </label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="NASM CPT, Nutrition Coach"
              />
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
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
                href="/admin/trainers"
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              <div className="relative h-48 bg-gray-700">
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt={formData.name || 'Trainer'}
                    fill
                    className="object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-600">
                    {formData.name ? formData.name.charAt(0) : '?'}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="text-lg font-bold text-white">
                  {formData.name || 'Trainer Name'}
                </h4>
                {formData.specialty && (
                  <p className="text-red-500 text-sm mt-1">{formData.specialty}</p>
                )}
                {formData.experienceYears > 0 && (
                  <p className="text-gray-400 text-sm mt-2">
                    {formData.experienceYears} years of experience
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
