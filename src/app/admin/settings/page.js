'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

const FL = (text) => (
  <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1.5" style={{ letterSpacing: '0.18em' }}>{text}</p>
);

const inputCls = "w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-primary transition-colors disabled:opacity-40";
const inputStyle = { borderRadius: 0, fontFamily: "'DM Sans', sans-serif" };

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const router = useRouter();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      showToast('All fields are required', 'error'); return;
    }
    if (formData.newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error'); return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('New passwords do not match', 'error'); return;
    }
    if (formData.oldPassword === formData.newPassword) {
      showToast('New password must differ from old password', 'error'); return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: formData.oldPassword, newPassword: formData.newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Password changed. Please login again.', 'success');
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => router.push('/admin/ironcore/login'), 2000);
      } else {
        showToast(data.error || 'Failed to change password', 'error');
      }
    } catch {
      showToast('Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">

      {/* Header */}
      <div className="pb-4 border-b border-[#141414]">
        <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>Account</p>
        <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
          Settings
        </h1>
      </div>

      {/* Change Password */}
      <div className="bg-[#0c0c0c] border border-[#161616]">
        <div className="px-5 py-4 border-b border-[#161616]">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase" style={{ letterSpacing: '0.2em' }}>Security</p>
          <h2 className="text-white font-black uppercase leading-none mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', letterSpacing: '0.04em' }}>
            Change Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            {FL('Current Password *')}
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              disabled={loading}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            {FL('New Password *')}
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              disabled={loading}
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            {FL('Confirm New Password *')}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat new password"
              disabled={loading}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-[#111]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-t-2 border-white animate-spin rounded-full" />
                  Updating...
                </>
              ) : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-[#0c0c0c] border border-[#161616]">
        <div className="px-5 py-4 border-b border-[#161616]">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase" style={{ letterSpacing: '0.2em' }}>Best Practices</p>
          <h2 className="text-white font-black uppercase leading-none mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', letterSpacing: '0.04em' }}>
            Password Tips
          </h2>
        </div>
        <ul className="p-5 space-y-3">
          {[
            'Use at least 8 characters',
            'Include uppercase, lowercase, numbers, and symbols',
            'Avoid common words or personal information',
            'Do not reuse passwords from other accounts',
            'Change your password regularly',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-[2px] h-3.5 bg-primary flex-shrink-0 mt-0.5" />
              <span className="text-neutral-600 text-xs leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-5 py-3.5 border-l-2 min-w-[260px] bg-[#0c0c0c] border border-[#1e1e1e] ${toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'}`}>
            {toast.type === 'success' ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
            <p className="text-white text-xs flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-neutral-600 hover:text-white transition-colors text-xs">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
