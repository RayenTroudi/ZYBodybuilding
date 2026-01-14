'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const fitnessLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to fitness or returning after a long break' },
  { id: 'intermediate', name: 'Intermediate', description: '1-3 years of consistent training' },
  { id: 'advanced', name: 'Advanced', description: '3+ years, familiar with periodization' },
  { id: 'elite', name: 'Elite', description: 'Competitive athlete or professional' },
];

const workoutDays = [
  { id: 'monday', name: 'Mon' },
  { id: 'tuesday', name: 'Tue' },
  { id: 'wednesday', name: 'Wed' },
  { id: 'thursday', name: 'Thu' },
  { id: 'friday', name: 'Fri' },
  { id: 'saturday', name: 'Sat' },
  { id: 'sunday', name: 'Sun' },
];

const fitnessGoalOptions = [
  'Build Muscle',
  'Lose Fat',
  'Increase Strength',
  'Improve Endurance',
  'Get Toned',
  'Athletic Performance',
  'General Fitness',
  'Flexibility',
];

const equipmentOptions = [
  'Full Gym',
  'Barbells',
  'Dumbbells',
  'Cables',
  'Machines',
  'Pull-up Bar',
  'Resistance Bands',
  'Bodyweight Only',
  'Kettlebells',
  'Home Gym',
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState({
    displayName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    fitnessLevel: '',
    fitnessGoals: [],
    preferredWorkoutDays: [],
    preferredWorkoutTime: '',
    injuries: '',
    equipmentAccess: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success && data.profile) {
        setProfile({
          displayName: data.profile.displayName || '',
          dateOfBirth: data.profile.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : '',
          gender: data.profile.gender || '',
          height: data.profile.height || '',
          fitnessLevel: data.profile.fitnessLevel || '',
          fitnessGoals: data.profile.fitnessGoals || [],
          preferredWorkoutDays: data.profile.preferredWorkoutDays || [],
          preferredWorkoutTime: data.profile.preferredWorkoutTime || '',
          injuries: data.profile.injuries || '',
          equipmentAccess: data.profile.equipmentAccess || [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          height: profile.height ? parseFloat(profile.height) : null,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString() : null,
        }),
      });

      if (response.ok) {
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleArrayItem = (field, item) => {
    const current = profile[field] || [];
    if (current.includes(item)) {
      setProfile({ ...profile, [field]: current.filter(i => i !== item) });
    } else {
      setProfile({ ...profile, [field]: [...current, item] });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400">Customize your fitness profile</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {[
          { id: 'profile', name: 'Profile', icon: '👤' },
          { id: 'fitness', name: 'Fitness', icon: '💪' },
          { id: 'preferences', name: 'Preferences', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Personal Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="175"
              />
            </div>
          </div>
        </div>
      )}

      {/* Fitness Tab */}
      {activeTab === 'fitness' && (
        <div className="space-y-6">
          {/* Fitness Level */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Fitness Level</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {fitnessLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setProfile({ ...profile, fitnessLevel: level.id })}
                  className={`p-4 rounded-lg text-left transition-all ${
                    profile.fitnessLevel === level.id
                      ? 'bg-red-600 border-2 border-red-500'
                      : 'bg-gray-700 border-2 border-transparent hover:border-gray-500'
                  }`}
                >
                  <p className="font-semibold text-white">{level.name}</p>
                  <p className="text-sm text-gray-300 mt-1">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Fitness Goals</h2>
            <p className="text-gray-400 text-sm mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {fitnessGoalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem('fitnessGoals', goal)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    profile.fitnessGoals?.includes(goal)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Injuries */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Injuries or Limitations</h2>
            <p className="text-gray-400 text-sm mb-4">Let us know about any injuries or physical limitations</p>
            <textarea
              value={profile.injuries}
              onChange={(e) => setProfile({ ...profile, injuries: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Lower back pain, knee injury, shoulder mobility issues..."
            />
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Workout Days */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Preferred Workout Days</h2>
            <div className="flex flex-wrap gap-2">
              {workoutDays.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleArrayItem('preferredWorkoutDays', day.id)}
                  className={`w-14 h-14 rounded-lg font-medium transition-colors ${
                    profile.preferredWorkoutDays?.includes(day.id)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          {/* Workout Time */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Preferred Workout Time</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'morning', name: 'Morning', icon: '🌅', time: '6AM - 12PM' },
                { id: 'afternoon', name: 'Afternoon', icon: '☀️', time: '12PM - 5PM' },
                { id: 'evening', name: 'Evening', icon: '🌆', time: '5PM - 9PM' },
                { id: 'night', name: 'Night', icon: '🌙', time: '9PM - 12AM' },
              ].map((time) => (
                <button
                  key={time.id}
                  onClick={() => setProfile({ ...profile, preferredWorkoutTime: time.id })}
                  className={`p-4 rounded-lg text-center transition-all ${
                    profile.preferredWorkoutTime === time.id
                      ? 'bg-red-600 border-2 border-red-500'
                      : 'bg-gray-700 border-2 border-transparent hover:border-gray-500'
                  }`}
                >
                  <span className="text-2xl block mb-1">{time.icon}</span>
                  <p className="font-medium text-white">{time.name}</p>
                  <p className="text-xs text-gray-400">{time.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Access */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Equipment Access</h2>
            <p className="text-gray-400 text-sm mb-4">What equipment do you have access to?</p>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((equipment) => (
                <button
                  key={equipment}
                  onClick={() => toggleArrayItem('equipmentAccess', equipment)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    profile.equipmentAccess?.includes(equipment)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {equipment}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
