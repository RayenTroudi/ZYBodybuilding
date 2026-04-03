'use client';

import { useState, useEffect } from 'react';

const fitnessLevels = [
  { id: 'beginner', name: 'Débutant', description: 'Nouveau dans le fitness ou de retour après une longue pause' },
  { id: 'intermediate', name: 'Intermédiaire', description: '1 à 3 ans d\'entraînement régulier' },
  { id: 'advanced', name: 'Avancé', description: '3+ ans, familier avec la périodisation' },
  { id: 'elite', name: 'Élite', description: 'Athlète compétitif ou professionnel' },
];

const workoutDays = [
  { id: 'monday', name: 'Lun' },
  { id: 'tuesday', name: 'Mar' },
  { id: 'wednesday', name: 'Mer' },
  { id: 'thursday', name: 'Jeu' },
  { id: 'friday', name: 'Ven' },
  { id: 'saturday', name: 'Sam' },
  { id: 'sunday', name: 'Dim' },
];

const fitnessGoalOptions = [
  'Prise de masse',
  'Perte de graisse',
  'Gagner en force',
  'Améliorer l\'endurance',
  'Se tonifier',
  'Performance sportive',
  'Forme générale',
  'Flexibilité',
];

const equipmentOptions = [
  'Salle complète',
  'Barres',
  'Haltères',
  'Câbles',
  'Machines',
  'Barre de traction',
  'Élastiques',
  'Poids du corps',
  'Kettlebells',
  'Home Gym',
];

export default function ProfilePage() {

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
        showToast('Profil mis à jour !', 'success');
      } else {
        showToast('Échec de la mise à jour du profil', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Échec de la mise à jour du profil', 'error');
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
            <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400">Chargement...</p>
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
          <h1 className="text-2xl font-bold text-white">Paramètres du profil</h1>
          <p className="text-neutral-400">Personnalisez votre profil fitness</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-700">
        {[
          { id: 'profile', name: 'Profil', icon: '👤' },
          { id: 'fitness', name: 'Fitness', icon: '💪' },
          { id: 'preferences', name: 'Préférences', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Informations personnelles</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Nom d&apos;affichage</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Date de naissance</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Genre</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Sélectionner...</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
                <option value="prefer_not_to_say">Préférer ne pas répondre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Taille (cm)</label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Niveau de fitness</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {fitnessLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setProfile({ ...profile, fitnessLevel: level.id })}
                  className={`p-4 rounded-lg text-left transition-all ${
                    profile.fitnessLevel === level.id
                      ? 'bg-red-600 border-2 border-red-500'
                      : 'bg-neutral-700 border-2 border-transparent hover:border-neutral-500'
                  }`}
                >
                  <p className="font-semibold text-white">{level.name}</p>
                  <p className="text-sm text-neutral-300 mt-1">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Objectifs de fitness</h2>
            <p className="text-neutral-400 text-sm mb-4">Sélectionnez tout ce qui s&apos;applique</p>
            <div className="flex flex-wrap gap-2">
              {fitnessGoalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem('fitnessGoals', goal)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    profile.fitnessGoals?.includes(goal)
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Injuries */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Blessures ou limitations</h2>
            <p className="text-neutral-400 text-sm mb-4">Informez-nous de vos blessures ou limitations physiques</p>
            <textarea
              value={profile.injuries}
              onChange={(e) => setProfile({ ...profile, injuries: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ex : douleur lombaire, blessure au genou, mobilité épaule..."
            />
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Workout Days */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Jours d&apos;entraînement préférés</h2>
            <div className="flex flex-wrap gap-2">
              {workoutDays.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleArrayItem('preferredWorkoutDays', day.id)}
                  className={`w-14 h-14 rounded-lg font-medium transition-colors ${
                    profile.preferredWorkoutDays?.includes(day.id)
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          {/* Workout Time */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Heure d&apos;entraînement préférée</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'morning', name: 'Matin', icon: '🌅', time: '6h - 12h' },
                { id: 'afternoon', name: 'Après-midi', icon: '☀️', time: '12h - 17h' },
                { id: 'evening', name: 'Soir', icon: '🌆', time: '17h - 21h' },
                { id: 'night', name: 'Nuit', icon: '🌙', time: '21h - 0h' },
              ].map((time) => (
                <button
                  key={time.id}
                  onClick={() => setProfile({ ...profile, preferredWorkoutTime: time.id })}
                  className={`p-4 rounded-lg text-center transition-all ${
                    profile.preferredWorkoutTime === time.id
                      ? 'bg-red-600 border-2 border-red-500'
                      : 'bg-neutral-700 border-2 border-transparent hover:border-neutral-500'
                  }`}
                >
                  <span className="text-2xl block mb-1">{time.icon}</span>
                  <p className="font-medium text-white">{time.name}</p>
                  <p className="text-xs text-neutral-400">{time.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Access */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Équipement disponible</h2>
            <p className="text-neutral-400 text-sm mb-4">Quel équipement avez-vous à disposition ?</p>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((equipment) => (
                <button
                  key={equipment}
                  onClick={() => toggleArrayItem('equipmentAccess', equipment)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    profile.equipmentAccess?.includes(equipment)
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
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
