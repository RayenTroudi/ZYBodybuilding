'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function MembershipExpiredPage() {
  const router = useRouter();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMembership();
  }, []);

  const checkMembership = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      
      if (!data.success || !data.user) {
        router.push('/login');
        return;
      }

      // If membership is valid, redirect to dashboard
      if (data.membership?.isValid) {
        router.push('/dashboard');
        return;
      }

      setMemberData({
        user: data.user,
        membership: data.membership,
      });
    } catch (error) {
      console.error('Check membership error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Checking membership...</p>
        </div>
      </div>
    );
  }

  const status = memberData?.membership?.status;
  const isPaused = status === 'paused';
  const isCancelled = status === 'cancelled';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image 
              src="/images/logoNobg.png" 
              alt="ZY Bodybuilding Logo" 
              width={60} 
              height={60}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-widest">ZY BODYBUILDING</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-center">
            <div className="text-6xl mb-4">
              {isPaused ? '⏸️' : isCancelled ? '❌' : '⏰'}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isPaused 
                ? 'Membership Paused' 
                : isCancelled 
                  ? 'Membership Cancelled'
                  : 'Membership Expired'}
            </h1>
            <p className="text-white/90">
              {memberData?.user?.name && `Hey ${memberData.user.name.split(' ')[0]}, `}
              {isPaused 
                ? 'your membership is currently on hold.'
                : isCancelled 
                  ? 'your membership has been cancelled.'
                  : 'your membership has expired.'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Motivational Message */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isPaused || isCancelled 
                  ? "We're here when you're ready to return! 💪"
                  : "We miss seeing you at the gym! 💪"}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {isPaused 
                  ? "Take the time you need. When you're ready to resume your fitness journey, we'll be here to support you every step of the way."
                  : isCancelled
                    ? "Your fitness journey doesn't have to end here. Come back and let's achieve your goals together."
                    : "Every champion takes breaks, but what defines you is getting back in the ring. Your fitness goals are waiting – let's crush them together!"}
              </p>
            </div>

            {/* Membership Details */}
            {memberData?.membership?.member && (
              <div className="bg-gray-700/50 rounded-xl p-4 mb-8">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Membership Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Member ID:</span>
                    <p className="text-white font-mono">{memberData.membership.member.memberId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Plan:</span>
                    <p className="text-white">{memberData.membership.member.planName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className={`font-medium ${
                      isPaused ? 'text-yellow-400' : 
                      isCancelled ? 'text-red-400' : 'text-orange-400'
                    }`}>
                      {isPaused ? 'Paused' : isCancelled ? 'Cancelled' : 'Expired'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      {isPaused || isCancelled ? 'Last Active:' : 'Expired On:'}
                    </span>
                    <p className="text-white">
                      {new Date(memberData.membership.member.subscriptionEndDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits Reminder */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                What you're missing out on:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🏋️', text: 'Full Gym Access' },
                  { icon: '👨‍🏫', text: 'Expert Trainers' },
                  { icon: '📊', text: 'Progress Tracking' },
                  { icon: '🎯', text: 'Personalized Workouts' },
                  { icon: '💪', text: 'Fitness Classes' },
                  { icon: '🏆', text: 'Community Support' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4 mb-8 text-center">
              <p className="text-sm text-red-400 font-medium mb-1">🎁 Welcome Back Offer</p>
              <p className="text-white font-semibold">Renew now and get 10% off your next month!</p>
              <p className="text-gray-400 text-xs mt-1">Contact the front desk for details</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/#pricing"
                className="block w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-[1.02] shadow-lg"
              >
                View Membership Plans
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/#contact"
                  className="block bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors"
                >
                  📞 Contact Us
                </Link>
                <a
                  href="https://maps.google.com/?q=ZY+Bodybuilding+Gym"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors"
                >
                  📍 Visit Gym
                </a>
              </div>

              <button
                onClick={handleSignOut}
                className="block w-full text-gray-400 hover:text-white py-3 text-sm transition-colors"
              >
                Sign out and return home
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Questions? Call us at <a href="tel:+21612345678" className="text-red-400 hover:underline">+216 12 345 678</a>
        </p>
      </div>
    </div>
  );
}
