'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      
      if (!data.success || !data.user) {
        router.push('/login');
        return;
      }

      // If user doesn't need password reset, redirect to dashboard
      if (!data.membership?.requiresPasswordReset) {
        router.push('/dashboard');
        return;
      }

      setUserData(data);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setCheckingAuth(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Check passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    // Make sure new password is different from current
    if (currentPassword === newPassword) {
      setError('New password must be different from your current password');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to reset password');
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 rounded-xl p-8 text-center border border-neutral-800">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">Password Updated!</h1>
          <p className="text-neutral-400 mb-4">Your password has been successfully changed.</p>
          <p className="text-neutral-500 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image 
              src="/images/logoNobg.png" 
              alt="ZY Bodybuilding Logo" 
              width={50} 
              height={50}
              className="object-contain"
            />
            <span className="text-xl font-bold text-white tracking-widest">ZY BODYBUILDING</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6 text-center">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-bold text-white">Create New Password</h1>
            <p className="text-white/80 text-sm mt-1">
              Welcome! Please set a secure password for your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Info Box */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-sm">
              <p className="text-primary font-medium mb-2">ℹ️ First Time Login</p>
              <p className="text-neutral-400">
                Your current password is your <strong className="text-white">Member ID</strong>
                {userData?.membership?.member?.memberId && (
                  <span className="font-mono text-primary ml-1">
                    ({userData.membership.member.memberId})
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Current Password (Member ID)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your Member ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirm your new password"
              />
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-neutral-500 space-y-1">
              <p className="font-medium text-neutral-400">Password must contain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li className={newPassword.length >= 8 ? 'text-green-400' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-400' : ''}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-400' : ''}>
                  One lowercase letter
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-400' : ''}>
                  One number
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
