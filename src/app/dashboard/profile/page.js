'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Dumbbell, Settings, CheckCircle2, XCircle,
  Sun, Sunset, Moon, Clock,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PageTransition from '../components/PageTransition';

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
  'Prise de masse', 'Perte de graisse', 'Gagner en force',
  'Améliorer l\'endurance', 'Se tonifier', 'Performance sportive',
  'Forme générale', 'Flexibilité',
];

const equipmentOptions = [
  'Salle complète', 'Barres', 'Haltères', 'Câbles',
  'Machines', 'Barre de traction', 'Élastiques',
  'Poids du corps', 'Kettlebells', 'Home Gym',
];

const workoutTimes = [
  { id: 'morning', name: 'Matin', sub: '6h – 12h', icon: Sun },
  { id: 'afternoon', name: 'Après-midi', sub: '12h – 17h', icon: Sunset },
  { id: 'evening', name: 'Soir', sub: '17h – 21h', icon: Clock },
  { id: 'night', name: 'Nuit', sub: '21h – 0h', icon: Moon },
];

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'preferences', label: 'Préférences', icon: Settings },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    displayName: '', dateOfBirth: '', gender: '', height: '',
    fitnessLevel: '', fitnessGoals: [], preferredWorkoutDays: [],
    preferredWorkoutTime: '', injuries: '', equipmentAccess: [],
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
      showToast(response.ok ? 'Profil mis à jour !' : 'Échec de la mise à jour', response.ok ? 'success' : 'error');
    } catch {
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
    const curr = profile[field] || [];
    setProfile({
      ...profile,
      [field]: curr.includes(item) ? curr.filter((i) => i !== item) : [...curr, item],
    });
  };

  const inputCls = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/40 transition-all';

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-white/5 rounded-2xl border border-white/5" />
        <div className="h-64 bg-white/5 rounded-2xl border border-white/5" />
      </div>
    );
  }

  const initials = (profile.displayName || 'U').slice(0, 2).toUpperCase();

  return (
    <PageTransition>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -8, x: '-50%' }}
            className={`fixed top-20 left-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header with avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-display font-black text-xl ring-4 ring-primary/20 shadow-[0_4px_20px_rgba(204,19,3,0.3)]">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-white tracking-tight">
                {profile.displayName || 'Mon Profil'}
              </h1>
              <p className="text-neutral-500 text-sm">Paramètres du profil fitness</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(204,19,3,0.3)] hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <CheckCircle2 size={15} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {activeTab === id && (
                <motion.span layoutId="profileTab" className="absolute inset-0 bg-primary rounded-lg shadow-[0_2px_12px_rgba(204,19,3,0.3)]" />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GlassCard className="p-6 space-y-5">
                <h2 className="font-display text-base font-bold text-white">Informations personnelles</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Nom d&apos;affichage</label>
                    <input type="text" value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} className={inputCls} placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Date de naissance</label>
                    <input type="date" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Genre</label>
                    <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputCls}>
                      <option value="">Sélectionner...</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                      <option value="prefer_not_to_say">Préférer ne pas répondre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Taille (cm)</label>
                    <input type="number" value={profile.height} onChange={(e) => setProfile({ ...profile, height: e.target.value })} className={inputCls} placeholder="175" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'fitness' && (
            <motion.div key="fitness" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassCard className="p-6">
                <h2 className="font-display text-base font-bold text-white mb-4">Niveau de fitness</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {fitnessLevels.map((level) => {
                    const active = profile.fitnessLevel === level.id;
                    return (
                      <button
                        key={level.id}
                        onClick={() => setProfile({ ...profile, fitnessLevel: level.id })}
                        className={`p-4 rounded-xl text-left transition-all border ${
                          active
                            ? 'bg-primary/15 border-primary/40 shadow-[0_2px_12px_rgba(204,19,3,0.2)]'
                            : 'bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/15'
                        }`}
                      >
                        <p className={`font-bold text-sm ${active ? 'text-white' : 'text-neutral-300'}`}>{level.name}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{level.description}</p>
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="font-display text-base font-bold text-white mb-1">Objectifs de fitness</h2>
                <p className="text-[11px] text-neutral-500 mb-4">Sélectionnez tout ce qui s&apos;applique</p>
                <div className="flex flex-wrap gap-2">
                  {fitnessGoalOptions.map((goal) => {
                    const active = profile.fitnessGoals?.includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => toggleArrayItem('fitnessGoals', goal)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                          active
                            ? 'bg-primary/20 border-primary/40 text-white'
                            : 'bg-white/5 border-white/8 text-neutral-400 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="font-display text-base font-bold text-white mb-1">Blessures ou limitations</h2>
                <p className="text-[11px] text-neutral-500 mb-4">Informez-nous de vos blessures ou limitations physiques</p>
                <textarea
                  value={profile.injuries}
                  onChange={(e) => setProfile({ ...profile, injuries: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                  placeholder="Ex : douleur lombaire, blessure au genou..."
                />
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div key="preferences" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassCard className="p-6">
                <h2 className="font-display text-base font-bold text-white mb-4">Jours d&apos;entraînement préférés</h2>
                <div className="flex flex-wrap gap-2">
                  {workoutDays.map((day) => {
                    const active = profile.preferredWorkoutDays?.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        onClick={() => toggleArrayItem('preferredWorkoutDays', day.id)}
                        className={`w-12 h-12 rounded-xl font-bold text-sm transition-all border ${
                          active
                            ? 'bg-primary/20 border-primary/40 text-white shadow-[0_2px_8px_rgba(204,19,3,0.2)]'
                            : 'bg-white/5 border-white/8 text-neutral-400 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        {day.name}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="font-display text-base font-bold text-white mb-4">Heure d&apos;entraînement préférée</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {workoutTimes.map((time) => {
                    const active = profile.preferredWorkoutTime === time.id;
                    const Icon = time.icon;
                    return (
                      <button
                        key={time.id}
                        onClick={() => setProfile({ ...profile, preferredWorkoutTime: time.id })}
                        className={`p-4 rounded-xl text-center transition-all border ${
                          active
                            ? 'bg-primary/15 border-primary/40 shadow-[0_2px_12px_rgba(204,19,3,0.2)]'
                            : 'bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/15'
                        }`}
                      >
                        <Icon size={20} className={`mx-auto mb-2 ${active ? 'text-primary' : 'text-neutral-500'}`} />
                        <p className={`font-bold text-sm ${active ? 'text-white' : 'text-neutral-300'}`}>{time.name}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{time.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="font-display text-base font-bold text-white mb-1">Équipement disponible</h2>
                <p className="text-[11px] text-neutral-500 mb-4">Quel équipement avez-vous à disposition ?</p>
                <div className="flex flex-wrap gap-2">
                  {equipmentOptions.map((equipment) => {
                    const active = profile.equipmentAccess?.includes(equipment);
                    return (
                      <button
                        key={equipment}
                        onClick={() => toggleArrayItem('equipmentAccess', equipment)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                          active
                            ? 'bg-primary/20 border-primary/40 text-white'
                            : 'bg-white/5 border-white/8 text-neutral-400 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        {equipment}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
