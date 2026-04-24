'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, BarChart3, Ruler, Trophy, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SkeletonLoader from '../components/SkeletonLoader';
import PageTransition from '../components/PageTransition';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.28 } } },
};

// SVG polyline sparkline chart
function Sparkline({ data, color = '#CC1303', height = 80 }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const pad = 6;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const last = pts[pts.length - 1].split(',');

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad},${height} ${polyline} ${w - pad},${height}`}
        fill="url(#sparkGrad)"
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={parseFloat(last[0])} cy={parseFloat(last[1])} r="2.5" fill={color} />
    </svg>
  );
}

export default function ProgressPage() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('weight');
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeRange, setTimeRange] = useState('3months');

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/body-metrics?range=${timeRange}`);
      const data = await response.json();
      if (data.success) setMetrics(data.metrics || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatest = (field) => {
    const r = metrics.find((m) => m[field] != null);
    return r ? r[field] : null;
  };

  const getChange = (field) => {
    const vals = metrics.filter((m) => m[field] != null);
    if (vals.length < 2) return null;
    return vals[0][field] - vals[vals.length - 1][field];
  };

  const tabs = [
    { id: 'weight', label: 'Poids', icon: Scale },
    { id: 'measurements', label: 'Mensurations', icon: Ruler },
    { id: 'strength', label: 'Force', icon: Trophy },
  ];

  const timeRanges = [
    { id: '1month', label: '1M' },
    { id: '3months', label: '3M' },
    { id: '6months', label: '6M' },
    { id: '1year', label: '1A' },
    { id: 'all', label: 'Tout' },
  ];

  const summaryCards = [
    { icon: Scale, label: 'Poids actuel', value: getLatest('weight'), unit: 'kg', change: getChange('weight'), inverse: false, color: 'blue' },
    { icon: BarChart3, label: 'Masse grasse', value: getLatest('bodyFat'), unit: '%', change: getChange('bodyFat'), inverse: true, color: 'orange' },
    { icon: TrendingUp, label: 'Masse musculaire', value: getLatest('muscleMass'), unit: 'kg', change: getChange('muscleMass'), inverse: false, color: 'green' },
    { icon: Ruler, label: 'Tour de taille', value: getLatest('waist'), unit: 'cm', change: getChange('waist'), inverse: true, color: 'purple' },
  ];

  const colorMap = {
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    green: 'bg-green-500/15 text-green-400 border-green-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-white tracking-tight">Suivi des progrès</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Suivez votre transformation physique</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(204,19,3,0.3)] hover:bg-primary/90 transition-all"
          >
            <Plus size={15} />
            Ajouter une mesure
          </button>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/5" />))}
          </div>
        ) : (
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {summaryCards.map(({ icon: Icon, label, value, unit, change, inverse, color }) => {
              const changePositive = change === null ? null : (inverse ? change < 0 : change > 0);
              return (
                <motion.div key={label} variants={stagger.item} whileHover={{ y: -2 }}>
                  <GlassCard className="p-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 border ${colorMap[color]}`}>
                      <Icon size={15} />
                    </div>
                    <p className="font-display text-xl font-black text-white">
                      {value != null ? `${value.toFixed(1)} ${unit}` : '--'}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{label}</p>
                    {change != null && (
                      <p className={`flex items-center gap-0.5 text-[11px] font-semibold mt-1 ${
                        changePositive ? 'text-green-400' : change === 0 ? 'text-neutral-400' : 'text-red-400'
                      }`}>
                        {changePositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {change > 0 ? '+' : ''}{change.toFixed(1)} {unit}
                      </p>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Time Range + Tabs Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {activeTab === id && (
                  <motion.span layoutId="progressTab" className="absolute inset-0 bg-primary rounded-lg shadow-[0_2px_12px_rgba(204,19,3,0.3)]" />
                )}
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
            {timeRanges.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTimeRange(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === id ? 'bg-white/15 text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'weight' && <WeightProgress key="weight" metrics={metrics} />}
          {activeTab === 'measurements' && <MeasurementsProgress key="measurements" metrics={metrics} />}
          {activeTab === 'strength' && <StrengthProgress key="strength" />}
        </AnimatePresence>

        {showAddModal && (
          <AddMeasurementModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => { setShowAddModal(false); fetchMetrics(); }}
          />
        )}
      </div>
    </PageTransition>
  );
}

function WeightProgress({ metrics }) {
  const weightData = metrics.filter((m) => m.weight != null);

  if (weightData.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <GlassCard className="text-center py-14">
          <Scale size={22} className="text-neutral-500 mx-auto mb-3" />
          <p className="text-neutral-400">Aucune donnée de poids enregistrée</p>
        </GlassCard>
      </motion.div>
    );
  }

  const chartData = weightData.slice(0, 30).reverse().map((m) => m.weight);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      <GlassCard className="p-6">
        <h3 className="font-display text-base font-bold text-white mb-1">Historique du poids</h3>
        <p className="text-[11px] text-neutral-500 mb-4">{weightData.length} mesures</p>
        <Sparkline data={chartData} height={100} />
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-neutral-600">
            {format(new Date(weightData[weightData.length - 1].recordedAt), 'MMM d')}
          </span>
          <span className="text-[11px] text-neutral-600">
            {format(new Date(weightData[0].recordedAt), 'MMM d')}
          </span>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-display text-base font-bold text-white mb-4">Dernières entrées</h3>
        <div className="space-y-2">
          {weightData.slice(0, 10).map((m, i) => (
            <div key={m.$id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <span className="text-neutral-400 text-sm">{format(new Date(m.recordedAt), 'MMM dd, yyyy')}</span>
              <div className="flex items-center gap-3">
                {i < weightData.length - 1 && (
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${
                    m.weight < weightData[i + 1].weight ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {m.weight < weightData[i + 1].weight ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                    {Math.abs(m.weight - weightData[i + 1].weight).toFixed(1)} kg
                  </span>
                )}
                <span className="font-display font-bold text-white">{m.weight} kg</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function MeasurementsProgress({ metrics }) {
  const measurements = [
    { key: 'chest', label: 'Poitrine' },
    { key: 'waist', label: 'Taille' },
    { key: 'hips', label: 'Hanches' },
    { key: 'bicepsLeft', label: 'Bicep G.' },
    { key: 'bicepsRight', label: 'Bicep D.' },
    { key: 'thighLeft', label: 'Cuisse G.' },
    { key: 'thighRight', label: 'Cuisse D.' },
    { key: 'shoulders', label: 'Épaules' },
  ];

  const getLatest = (key) => {
    const r = metrics.find((m) => m[key] != null);
    return r ? r[key] : null;
  };
  const getFirst = (key) => {
    const filtered = metrics.filter((m) => m[key] != null);
    return filtered.length > 0 ? filtered[filtered.length - 1][key] : null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <GlassCard className="p-6">
        <h3 className="font-display text-base font-bold text-white mb-4">Mensurations corporelles</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {measurements.map((m) => {
            const latest = getLatest(m.key);
            const first = getFirst(m.key);
            const change = latest && first ? latest - first : null;
            return (
              <div key={m.key} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5">
                <span className="text-white text-sm font-medium">{m.label}</span>
                <div className="text-right">
                  <p className="font-display font-bold text-white text-sm">
                    {latest ? `${latest} cm` : '--'}
                  </p>
                  {change != null && (
                    <p className={`text-[11px] font-semibold flex items-center gap-0.5 justify-end ${
                      change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-neutral-500'
                    }`}>
                      {change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {change > 0 ? '+' : ''}{change.toFixed(1)} cm
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function StrengthProgress() {
  const [personalRecords, setPersonalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/personal-records')
      .then((r) => r.json())
      .then((data) => { if (data.success) setPersonalRecords(data.records || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader rows={3} />;

  if (personalRecords.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <GlassCard className="text-center py-14">
          <Trophy size={22} className="text-neutral-500 mx-auto mb-3" />
          <p className="text-neutral-400">Enregistrez des séances pour suivre votre progression en force</p>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <GlassCard className="p-6">
        <h3 className="font-display text-base font-bold text-white mb-4">Records personnels</h3>
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="space-y-2"
        >
          {personalRecords.map((pr, i) => (
            <motion.div
              key={i}
              variants={stagger.item}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                  i === 1 ? 'bg-neutral-300/20 text-neutral-300' :
                  i === 2 ? 'bg-orange-400/20 text-orange-400' :
                  'bg-white/5 text-neutral-500'
                }`}>
                  {i < 3 ? <Trophy size={13} /> : i + 1}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{pr.exerciseName}</p>
                  <p className="text-[11px] text-neutral-500">
                    {pr.date ? format(new Date(pr.date), 'dd MMM yyyy') : 'Date inconnue'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-yellow-400 text-lg">{pr.weight}</p>
                <p className="text-[11px] text-neutral-500">{pr.reps} reps · kg</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}

function AddMeasurementModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    weight: '', bodyFat: '', muscleMass: '',
    chest: '', waist: '', hips: '',
    bicepsLeft: '', bicepsRight: '',
    thighLeft: '', thighRight: '',
    shoulders: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanData = {};
      Object.entries(formData).forEach(([key, value]) => {
        cleanData[key] = key === 'notes' ? (value || null) : (value ? parseFloat(value) : null);
      });
      const response = await fetch('/api/user/body-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });
      if (response.ok) onSuccess();
    } catch (error) {
      console.error('Error saving measurement:', error);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all pr-10';

  const Field = ({ name, label, unit, placeholder }) => (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">{label}</label>
      <div className="relative">
        <input type="number" step="0.1" value={formData[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} placeholder={placeholder} className={inputCls} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#111] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-white">Ajouter une mesure</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
              <X size={15} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Métriques principales</p>
              <div className="grid grid-cols-3 gap-3">
                <Field name="weight" label="Poids" unit="kg" placeholder="75" />
                <Field name="bodyFat" label="Masse grasse" unit="%" placeholder="15" />
                <Field name="muscleMass" label="Muscle" unit="kg" placeholder="35" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Mensurations</p>
              <div className="grid grid-cols-2 gap-3">
                <Field name="chest" label="Poitrine" unit="cm" placeholder="100" />
                <Field name="shoulders" label="Épaules" unit="cm" placeholder="120" />
                <Field name="waist" label="Taille" unit="cm" placeholder="80" />
                <Field name="hips" label="Hanches" unit="cm" placeholder="95" />
                <Field name="bicepsLeft" label="Bicep G." unit="cm" placeholder="35" />
                <Field name="bicepsRight" label="Bicep D." unit="cm" placeholder="35" />
                <Field name="thighLeft" label="Cuisse G." unit="cm" placeholder="55" />
                <Field name="thighRight" label="Cuisse D." unit="cm" placeholder="55" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} placeholder="Notes sur cette mesure..." className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/5 text-white text-sm rounded-xl hover:bg-white/10 transition-all border border-white/8">Annuler</button>
              <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-[0_2px_12px_rgba(204,19,3,0.3)]">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
