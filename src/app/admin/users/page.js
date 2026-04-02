'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Shield, User } from 'lucide-react';

const sectionLabel = (text) => (
  <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>
    {text}
  </p>
);

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
      else setError(data.error || 'Failed to fetch users');
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showToast(`Role updated to ${newRole}`, 'success');
      } else {
        showToast(data.error || 'Failed to update role', 'error');
      }
    } catch {
      showToast('Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== userId));
        showToast('User deleted', 'success');
      } else {
        showToast(data.error || 'Failed to delete', 'error');
      }
    } catch {
      showToast('Failed to delete user', 'error');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'all' || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Page title */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          {sectionLabel('Access Control')}
          <h1
            className="text-white font-black uppercase leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}
          >
            User Management
          </h1>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {sectionLabel('Total Users')}
          <p className="text-white font-black leading-none mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem' }}>
            {users.length}
          </p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {sectionLabel('Admins')}
          <p className="font-black leading-none mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem', color: 'var(--primary-color)' }}>
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          {sectionLabel('Regular Users')}
          <p className="font-black leading-none mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.2rem', color: '#919191' }}>
            {users.filter(u => u.role === 'user').length}
          </p>
        </div>
      </div>

      {error && (
        <div className="border border-red-600/30 bg-red-600/10 px-4 py-3 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 0, fontFamily: "'DM Sans', sans-serif" }}
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-[#0a0a0a] border border-[#1c1c1c] text-neutral-400 text-xs focus:outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 0, fontFamily: "'DM Sans', sans-serif" }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
          <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
          <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading...</span>
        </div>
      ) : (
        <div className="bg-[#0c0c0c] border border-[#161616] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#080808] border-b border-[#161616]">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[9px] font-semibold uppercase text-neutral-700"
                      style={{ letterSpacing: '0.18em' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>
                      No users found
                    </td>
                  </tr>
                ) : filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`border-b border-[#111] hover:bg-[#0f0f0f] transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#141414] border border-[#1e1e1e] flex items-center justify-center flex-shrink-0">
                          <span
                            className="text-neutral-500 text-xs font-bold"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                          >
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white text-xs font-medium">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="text-neutral-500 text-xs">{user.email}</span>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`px-2 py-1 text-[10px] font-bold uppercase border focus:outline-none focus:border-primary transition-colors cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-[#0a0a0a] border-[#1e1e1e] text-neutral-500'
                        }`}
                        style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase border ${
                          user.status ? 'admin-badge badge-active' : 'admin-badge badge-expired'
                        }`}
                        style={{ letterSpacing: '0.12em' }}
                      >
                        {user.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3">
                      <span className="text-neutral-600 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="px-2.5 py-1 border border-[#1e1e1e] text-neutral-600 text-[10px] font-semibold uppercase hover:border-[#2a2a2a] hover:text-white transition-colors"
                          style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="px-2.5 py-1 border border-red-600/20 text-red-600/60 text-[10px] font-semibold uppercase hover:border-red-600/50 hover:text-red-500 transition-colors"
                          style={{ letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-5 py-3.5 border-l-2 min-w-[280px] bg-[#0c0c0c] border border-[#1e1e1e] ${
            toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
          }`}>
            {toast.type === 'success'
              ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
            <p className="text-white text-xs flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-neutral-600 hover:text-white transition-colors text-xs">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
