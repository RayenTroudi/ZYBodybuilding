'use client';

import { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, CheckCircle, Edit3, Clock, Trophy } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

const goalTypes = [
  { id: 'weight_loss', name: 'Perte de poids', icon: '⚖️', unit: 'kg' },
  { id: 'weight_gain', name: 'Prise de poids', icon: '📈', unit: 'kg' },
  { id: 'strength', name: 'Force', icon: '💪', unit: 'kg' },
  { id: 'muscle_gain', name: 'Prise de masse', icon: '🏋️', unit: 'kg' },
  { id: 'endurance', name: 'Endurance', icon: '🏃', unit: 'min' },
  { id: 'body_recomposition', name: 'Recomposition', icon: '🔄', unit: '%' },
  { id: 'habit', name: 'Habitude', icon: '✅', unit: 'jours' },
  { id: 'custom', name: 'Personnalisé', icon: '🎯', unit: '' },
];

const priorityConfig = {
  high: { label: 'Haute', class: 'text-red-400 bg-red-400/15 border-red-400/20' },
  medium: { label: 'Moyenne', class: 'text-yellow-400 bg-yellow-400/15 border-yellow-400/20' },
  low: { label: 'Faible', class: 'text-blue-400 bg-blue-400/15 border-blue-400/20' },
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.28 } } },
};

// SVG circular arc progress
function CircularProgress({ percent, size = 60, strokeWidth = 5, color = '#CC1303' }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
      />
    </svg>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchGoals();
  }, [filter]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/goals?status=${filter}`);
      const data = await response.json();
      if (data.success) setGoals(data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (goalId, updates) => {
    try {
      const response = await fetch(`/api/user/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Supprimer cet objectif ?')) return;
    try {
      const response = await fetch(`/api/user/goals/${goalId}`, { method: 'DELETE' });
      if (response.ok) fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  const highPriority = activeGoals.filter((g) => g.priority === 'high').length;
  const dueSoon = activeGoals.filter((g) => {
    if (!g.targetDate) return false;
    const d = differenceInDays(new Date(g.targetDate), new Date());
    return d <= 7 && d >= 0;
  }).length;

  const filterTabs = [
    { id: 'active', label: 'Actifs', count: activeGoals.length },
    { id: 'completed', label: 'Complétés', count: completedGoals.length },
    { id: 'all', label: 'Tous' },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-white tracking-tight">Objectifs fitness</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Suivez vos progrès vers vos objectifs</p>
          </div>
          <button
            onClick={() => setShowNewGoalModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(204,19,3,0.3)] hover:bg-primary/90 transition-all"
          >
            <Plus size={15} />
            Nouvel objectif
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Objectifs actifs', value: activeGoals.length, color: 'text-white' },
            { label: 'Complétés', value: completedGoals.length, color: 'text-green-400' },
            { label: 'Haute priorité', value: highPriority, color: 'text-red-400' },
            { label: 'Cette semaine', value: dueSoon, color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <GlassCard key={label} className="p-4 text-center">
              <p className={`font-display text-2xl font-black ${color}`}>{value}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/8">
          {filterTabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {filter === id && (
                <motion.span layoutId="goalTab" className="absolute inset-0 bg-primary rounded-lg shadow-[0_2px_12px_rgba(204,19,3,0.3)]" />
              )}
              <span className="relative z-10">{label}</span>
              {count !== undefined && (
                <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === id ? 'bg-white/20 text-white' : 'bg-white/8 text-neutral-500'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Goals List */}
        {loading ? (
          <SkeletonLoader rows={3} />
        ) : goals.length === 0 ? (
          <GlassCard className="text-center py-14">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Target size={22} className="text-neutral-500" />
            </div>
            <p className="text-neutral-400 mb-4">Aucun objectif</p>
            {filter === 'active' && (
              <button
                onClick={() => setShowNewGoalModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary text-sm font-semibold rounded-xl hover:bg-primary/30 transition-all border border-primary/30"
              >
                <Plus size={14} />
                Créer mon premier objectif
              </button>
            )}
          </GlassCard>
        ) : (
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {goals.map((goal) => (
              <motion.div key={goal.$id} variants={stagger.item}>
                <GoalCard
                  goal={goal}
                  onUpdate={(updates) => handleUpdateGoal(goal.$id, updates)}
                  onDelete={() => handleDeleteGoal(goal.$id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {showNewGoalModal && (
          <NewGoalModal
            onClose={() => setShowNewGoalModal(false)}
            onSuccess={() => { setShowNewGoalModal(false); fetchGoals(); }}
          />
        )}
      </div>
    </PageTransition>
  );
}

function GoalCard({ goal, onUpdate, onDelete }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const progress = goal.targetValue
    ? Math.min(100, (goal.currentValue / goal.targetValue) * 100)
    : 0;

  const goalType = goalTypes.find((t) => t.id === goal.goalType) || goalTypes[7];
  const daysLeft = goal.targetDate
    ? differenceInDays(new Date(goal.targetDate), new Date())
    : null;
  const pCfg = priorityConfig[goal.priority] || priorityConfig.medium;

  return (
    <GlassCard
      className={`p-5 transition-all ${
        goal.status === 'completed' ? 'border-green-500/30' : 'hover:border-white/12'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Circular progress */}
        <div className="relative shrink-0">
          <CircularProgress
            percent={progress}
            size={56}
            strokeWidth={4}
            color={goal.status === 'completed' ? '#10B981' : '#CC1303'}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-base">{goalType.icon}</span>
                <h3 className="font-display font-bold text-white text-base tracking-tight">
                  {goal.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-500">{goalType.name}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${pCfg.class}`}>
                {pCfg.label}
              </span>
              {goal.status === 'completed' && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/15 text-green-400 rounded-lg text-[10px] font-bold border border-green-500/20">
                  <CheckCircle size={10} />
                  Complété
                </span>
              )}
            </div>
          </div>

          {goal.description && (
            <p className="text-neutral-400 text-xs mb-3 leading-relaxed">{goal.description}</p>
          )}

          {goal.targetValue && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-neutral-500">Progression</span>
                <span className="text-[11px] text-white font-semibold">
                  {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                </span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    goal.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-primary to-primary/70'
                  }`}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            {goal.targetDate && (
              <span className={`flex items-center gap-1 ${
                daysLeft !== null && daysLeft < 0
                  ? 'text-red-400'
                  : daysLeft !== null && daysLeft <= 7
                  ? 'text-yellow-400'
                  : 'text-neutral-500'
              }`}>
                <Clock size={10} />
                {daysLeft !== null && daysLeft >= 0
                  ? `${daysLeft}j restants`
                  : format(new Date(goal.targetDate), 'dd MMM yyyy')}
              </span>
            )}
          </div>

          {goal.status === 'active' && (
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowUpdateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-500/25 transition-all border border-blue-500/20"
              >
                <Edit3 size={11} />
                Mettre à jour
              </button>
              <button
                onClick={() => onUpdate({ status: 'completed', completedDate: new Date().toISOString() })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/25 transition-all border border-green-500/20"
              >
                <CheckCircle size={11} />
                Marquer complété
              </button>
              <button
                onClick={onDelete}
                className="w-7 h-7 flex items-center justify-center bg-white/5 text-neutral-500 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5 ml-auto"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showUpdateModal && (
        <UpdateProgressModal
          goal={goal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={(value) => { onUpdate({ currentValue: value }); setShowUpdateModal(false); }}
        />
      )}
    </GlassCard>
  );
}

function UpdateProgressModal({ goal, onClose, onUpdate }) {
  const [value, setValue] = useState(goal.currentValue || '');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111] rounded-2xl max-w-sm w-full border border-white/10 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-bold text-white mb-1">Mettre à jour la progression</h3>
        <p className="text-neutral-500 text-sm mb-4">{goal.title}</p>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
            Valeur actuelle ({goal.unit})
          </label>
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
            placeholder={`Target: ${goal.targetValue}`}
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/5 text-white text-sm rounded-xl hover:bg-white/10 transition-all border border-white/8">Annuler</button>
          <button onClick={() => onUpdate(parseFloat(value))} className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_2px_12px_rgba(204,19,3,0.3)]">Mettre à jour</button>
        </div>
      </motion.div>
    </div>
  );
}

function NewGoalModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', description: '', goalType: 'custom',
    targetValue: '', currentValue: '', unit: '',
    targetDate: '', priority: 'medium',
  });
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (type) => {
    const gt = goalTypes.find((t) => t.id === type);
    setFormData({ ...formData, goalType: type, unit: gt?.unit || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/user/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null,
          currentValue: formData.currentValue ? parseFloat(formData.currentValue) : 0,
          startDate: new Date().toISOString(),
          targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null,
        }),
      });
      if (response.ok) onSuccess();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/40 transition-all';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#111] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-white mb-5">Créer un nouvel objectif</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Type d&apos;objectif</label>
              <div className="grid grid-cols-4 gap-2">
                {goalTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeChange(type.id)}
                    className={`p-2 rounded-xl text-center transition-all border ${
                      formData.goalType === type.id
                        ? 'bg-primary/20 border-primary/40 text-white'
                        : 'bg-white/5 border-white/8 text-neutral-400 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className="text-lg block">{type.icon}</span>
                    <span className="text-[10px] font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Titre de l&apos;objectif</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className={inputCls} placeholder="Ex : Développé couché 100 kg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className={inputCls} placeholder="Description facultative..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Valeur cible</label>
                <input type="number" step="0.1" value={formData.targetValue} onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })} className={inputCls} placeholder="100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Unité</label>
                <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className={inputCls} placeholder="kg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Date cible</label>
                <input type="date" value={formData.targetDate} onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Priorité</label>
                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={inputCls}>
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/5 text-white text-sm rounded-xl hover:bg-white/10 transition-all border border-white/8">Annuler</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-[0_2px_12px_rgba(204,19,3,0.3)]">
                {saving ? 'Création...' : "Créer l'objectif"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
