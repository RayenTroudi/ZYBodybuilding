'use client';

import { useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';

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
      
      if (data.success) {
        setMetrics(data.metrics || []);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestMetric = (field) => {
    const latest = metrics.find(m => m[field] !== null && m[field] !== undefined);
    return latest ? latest[field] : null;
  };

  const getChange = (field) => {
    const values = metrics.filter(m => m[field] !== null && m[field] !== undefined);
    if (values.length < 2) return null;
    const change = values[0][field] - values[values.length - 1][field];
    return change;
  };

  const tabs = [
    { id: 'weight', name: 'Weight', icon: '⚖️', unit: 'kg' },
    { id: 'measurements', name: 'Measurements', icon: '📏', unit: 'cm' },
    { id: 'strength', name: 'Strength', icon: '💪', unit: '' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Progress Tracking</h1>
          <p className="text-neutral-400">Track your body transformation</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          + Add Measurement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="⚖️"
          label="Current Weight"
          value={getLatestMetric('weight')}
          unit="kg"
          change={getChange('weight')}
          changeLabel="vs start"
        />
        <MetricCard
          icon="📊"
          label="Body Fat"
          value={getLatestMetric('bodyFat')}
          unit="%"
          change={getChange('bodyFat')}
          changeLabel="vs start"
          inverse
        />
        <MetricCard
          icon="💪"
          label="Muscle Mass"
          value={getLatestMetric('muscleMass')}
          unit="kg"
          change={getChange('muscleMass')}
          changeLabel="vs start"
        />
        <MetricCard
          icon="📏"
          label="Waist"
          value={getLatestMetric('waist')}
          unit="cm"
          change={getChange('waist')}
          changeLabel="vs start"
          inverse
        />
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[
          { id: '1month', label: '1 Month' },
          { id: '3months', label: '3 Months' },
          { id: '6months', label: '6 Months' },
          { id: '1year', label: '1 Year' },
          { id: 'all', label: 'All Time' },
        ].map((range) => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range.id
                ? 'bg-red-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-700">
        {tabs.map((tab) => (
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

      {/* Content */}
      {activeTab === 'weight' && <WeightProgress metrics={metrics} />}
      {activeTab === 'measurements' && <MeasurementsProgress metrics={metrics} />}
      {activeTab === 'strength' && <StrengthProgress />}

      {/* Add Measurement Modal */}
      {showAddModal && (
        <AddMeasurementModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchMetrics();
          }}
        />
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, unit, change, changeLabel, inverse = false }) {
  const changeColor = change === null
    ? 'text-neutral-400'
    : (inverse ? change < 0 : change > 0)
    ? 'text-green-500'
    : (inverse ? change > 0 : change < 0)
    ? 'text-red-500'
    : 'text-neutral-400';

  return (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-neutral-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">
        {value !== null ? `${value.toFixed(1)} ${unit}` : '--'}
      </p>
      {change !== null && (
        <p className={`text-sm mt-1 ${changeColor}`}>
          {change > 0 ? '+' : ''}{change.toFixed(1)} {unit} {changeLabel}
        </p>
      )}
    </div>
  );
}

function WeightProgress({ metrics }) {
  const weightData = metrics.filter(m => m.weight !== null);

  if (weightData.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
        <p className="text-6xl mb-4">⚖️</p>
        <p className="text-neutral-400">No weight data recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Chart Visualization */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Weight History</h3>
        <div className="h-48 flex items-end gap-1">
          {weightData.slice(0, 30).reverse().map((m, i) => {
            const min = Math.min(...weightData.map(d => d.weight));
            const max = Math.max(...weightData.map(d => d.weight));
            const range = max - min || 1;
            const height = ((m.weight - min) / range) * 100 + 20;
            
            return (
              <div
                key={i}
                className="flex-1 bg-primary rounded-t-sm hover:opacity-90 transition-opacity cursor-pointer group relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {m.weight} kg
                  <br />
                  {format(new Date(m.recordedAt), 'MMM d')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weight Log */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Entries</h3>
        <div className="space-y-2">
          {weightData.slice(0, 10).map((m, i) => (
            <div key={m.$id} className="flex items-center justify-between py-2 border-b border-neutral-700 last:border-0">
              <span className="text-neutral-400">{format(new Date(m.recordedAt), 'MMM dd, yyyy')}</span>
              <span className="font-semibold text-white">{m.weight} kg</span>
              {i < weightData.length - 1 && (
                <span className={`text-sm ${
                  m.weight < weightData[i + 1].weight ? 'text-green-500' : 'text-red-500'
                }`}>
                  {m.weight < weightData[i + 1].weight ? '↓' : '↑'}
                  {Math.abs(m.weight - weightData[i + 1].weight).toFixed(1)} kg
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MeasurementsProgress({ metrics }) {
  const measurements = [
    { key: 'chest', label: 'Chest', icon: '🫁' },
    { key: 'waist', label: 'Waist', icon: '📏' },
    { key: 'hips', label: 'Hips', icon: '🍑' },
    { key: 'bicepsLeft', label: 'Left Bicep', icon: '💪' },
    { key: 'bicepsRight', label: 'Right Bicep', icon: '💪' },
    { key: 'thighLeft', label: 'Left Thigh', icon: '🦵' },
    { key: 'thighRight', label: 'Right Thigh', icon: '🦵' },
    { key: 'shoulders', label: 'Shoulders', icon: '🤷' },
  ];

  const getLatestValue = (key) => {
    const record = metrics.find(m => m[key] !== null && m[key] !== undefined);
    return record ? record[key] : null;
  };

  const getFirstValue = (key) => {
    const filtered = metrics.filter(m => m[key] !== null && m[key] !== undefined);
    return filtered.length > 0 ? filtered[filtered.length - 1][key] : null;
  };

  return (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Body Measurements</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {measurements.map((m) => {
          const latest = getLatestValue(m.key);
          const first = getFirstValue(m.key);
          const change = latest && first ? latest - first : null;

          return (
            <div key={m.key} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-white">{m.label}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">
                  {latest ? `${latest} cm` : '--'}
                </p>
                {change !== null && (
                  <p className={`text-sm ${change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-neutral-400'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)} cm
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StrengthProgress() {
  const [personalRecords, setPersonalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalRecords();
  }, []);

  const fetchPersonalRecords = async () => {
    try {
      const response = await fetch('/api/user/personal-records');
      const data = await response.json();
      if (data.success) {
        setPersonalRecords(data.records || []);
      }
    } catch (error) {
      console.error('Error fetching PRs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
        <p className="text-neutral-400">Loading strength data...</p>
      </div>
    );
  }

  if (personalRecords.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
        <p className="text-6xl mb-4">💪</p>
        <p className="text-neutral-400">Log workouts to track your strength progress</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Personal Records</h3>
      <div className="space-y-3">
        {personalRecords.map((pr, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
            <div>
              <p className="font-semibold text-white">{pr.exerciseName}</p>
              <p className="text-sm text-neutral-400">
                {pr.date ? format(new Date(pr.date), 'MMM dd, yyyy') : 'Unknown date'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-yellow-500">🏆 {pr.weight} kg</p>
              <p className="text-sm text-neutral-400">{pr.reps} reps</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddMeasurementModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    bicepsLeft: '',
    bicepsRight: '',
    thighLeft: '',
    thighRight: '',
    shoulders: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert empty strings to null
      const cleanData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'notes') {
          cleanData[key] = value || null;
        } else {
          cleanData[key] = value ? parseFloat(value) : null;
        }
      });

      const response = await fetch('/api/user/body-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving measurement:', error);
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ name, label, unit, placeholder }) => (
    <div>
      <label className="block text-xs text-neutral-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          step="0.1"
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500 pr-10"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
          {unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Add Measurement</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primary Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">Primary Metrics</h3>
              <div className="grid grid-cols-3 gap-3">
                <InputField name="weight" label="Weight" unit="kg" placeholder="75" />
                <InputField name="bodyFat" label="Body Fat" unit="%" placeholder="15" />
                <InputField name="muscleMass" label="Muscle" unit="kg" placeholder="35" />
              </div>
            </div>

            {/* Body Measurements */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">Body Measurements</h3>
              <div className="grid grid-cols-2 gap-3">
                <InputField name="chest" label="Chest" unit="cm" placeholder="100" />
                <InputField name="shoulders" label="Shoulders" unit="cm" placeholder="120" />
                <InputField name="waist" label="Waist" unit="cm" placeholder="80" />
                <InputField name="hips" label="Hips" unit="cm" placeholder="95" />
                <InputField name="bicepsLeft" label="Left Bicep" unit="cm" placeholder="35" />
                <InputField name="bicepsRight" label="Right Bicep" unit="cm" placeholder="35" />
                <InputField name="thighLeft" label="Left Thigh" unit="cm" placeholder="55" />
                <InputField name="thighRight" label="Right Thigh" unit="cm" placeholder="55" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Any notes about this measurement..."
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
