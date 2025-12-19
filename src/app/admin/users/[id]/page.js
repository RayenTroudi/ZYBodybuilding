'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDetailsPage({ params }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Unwrap params promise
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || 'Failed to fetch user');
      }
    } catch (err) {
      setError('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUser({ ...user, role: newRole });
        showNotification(`User role updated to ${newRole} successfully`, 'success');
      } else {
        showNotification(data.error || 'Failed to update user role', 'error');
      }
    } catch (err) {
      showNotification('Failed to update user role', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('User deleted successfully', 'success');
        setTimeout(() => {
          router.push('/admin/users');
        }, 1500);
      } else {
        showNotification(data.error || 'Failed to delete user', 'error');
        setDeleting(false);
      }
    } catch (err) {
      showNotification('Failed to delete user', 'error');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
          {error || 'User not found'}
        </div>
        <Link
          href="/admin/users"
          className="text-red-500 hover:text-red-400 font-medium"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-sm ${
            notification.type === 'success'
              ? 'bg-green-500/10 border-green-500 text-green-400'
              : 'bg-red-500/10 border-red-500 text-red-400'
          }`}>
            {/* Icon */}
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            {/* Message */}
            <p className="font-medium">{notification.message}</p>
            
            {/* Close Button */}
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="text-red-500 hover:text-red-400 font-medium mb-4 inline-block"
        >
          ← Back to Users
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">User Details</h1>
        <p className="text-gray-400">View and manage user information</p>
      </div>

      {/* User Information Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            user.role === 'admin'
              ? 'bg-red-500/20 text-red-400 border border-red-500'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500'
          }`}>
            {user.role === 'admin' ? 'Administrator' : 'User'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              user.status ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {user.status ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Role</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              user.role === 'admin'
                ? 'bg-red-500/20 text-red-400 border border-red-500'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500'
            }`}>
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Created At</h3>
            <p className="text-white">
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>

          {user.lastActivity && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Last Activity</h3>
              <p className="text-white">
                {new Date(user.lastActivity).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          User Actions
        </h3>
        
        <div className="space-y-6">
          {/* Change Role Section */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <label className="text-base font-semibold text-gray-200">
                Change User Role
              </label>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {user.role === 'admin' 
                ? 'This user has full administrative access to the system'
                : 'This user has standard access without administrative privileges'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleRoleChange('user')}
                disabled={user.role === 'user' || updating}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  user.role === 'user'
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50'
                } disabled:opacity-50`}
              >
                {updating && user.role !== 'user' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {user.role === 'user' ? '✓ Current Role: User' : 'Set as User'}
                  </>
                )}
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                disabled={user.role === 'admin' || updating}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  user.role === 'admin'
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-500/50'
                } disabled:opacity-50`}
              >
                {updating && user.role !== 'admin' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {user.role === 'admin' ? '✓ Current Role: Admin' : 'Set as Admin'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <label className="text-base font-semibold text-gray-200">
                Quick Actions
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.email);
                  showNotification('Email copied to clipboard', 'success');
                }}
                className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Email
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.id);
                  showNotification('User ID copied to clipboard', 'success');
                }}
                className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Copy User ID
              </button>
            </div>
          </div>

          {/* Delete User Section */}
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/50">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <label className="text-base font-semibold text-red-400">
                Danger Zone
              </label>
            </div>
            <p className="text-sm text-red-300 mb-4">
              Permanently delete this user account. This action cannot be undone and will remove all associated data.
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                className="w-full py-3 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete User Account
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
                  <p className="text-sm text-red-200 font-medium">
                    ⚠️ Are you absolutely sure? This action is irreversible!
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={deleting}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {deleting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Yes, Delete Forever
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
