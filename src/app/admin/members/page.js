'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showYearDialog, setShowYearDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pendingFile, setPendingFile] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/members?${params}`);
      const data = await response.json();
      setMembers(data.documents || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Active: 'bg-green-500/20 text-green-500 border-green-500',
      Expired: 'bg-red-500/20 text-red-500 border-red-500',
      Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status] || 'bg-gray-500/20 text-gray-500'}`}>
        {status}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['Member ID', 'Name', 'Email', 'Phone', 'Plan', 'Status', 'Start Date', 'End Date', 'Total Paid'];
    const rows = members.map(m => [
      m.memberId,
      m.name,
      m.email,
      m.phone,
      m.planName,
      m.status,
      format(new Date(m.subscriptionStartDate), 'yyyy-MM-dd'),
      format(new Date(m.subscriptionEndDate), 'yyyy-MM-dd'),
      m.totalPaid
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setResultMessage({
        title: 'Invalid File Type',
        type: 'error',
        message: 'Please select an Excel file (.xlsx or .xls)',
        stats: null,
        errors: null
      });
      setShowResultModal(true);
      event.target.value = '';
      return;
    }

    // Store file and show year dialog
    setPendingFile(file);
    setSelectedYear(new Date().getFullYear());
    setShowYearDialog(true);
    
    // Reset file input
    event.target.value = '';
  };

  const handleCancelImport = () => {
    setShowYearDialog(false);
    setPendingFile(null);
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;

    setShowYearDialog(false);
    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', pendingFile);
      formData.append('year', selectedYear.toString());

      const response = await fetch('/api/admin/members/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setImportResult(data);
      
      // Refresh members list first
      await fetchMembers();
      
      // Then refresh all data including dashboard statistics
      router.refresh();

      // Prepare result message
      if (data.results.errors && data.results.errors.length > 0) {
        const errorDetails = data.results.errors.slice(0, 5).map(e => `Row ${e.row}: ${e.error}`).join('\n');
        setResultMessage({
          title: 'Import Completed with Errors',
          type: 'warning',
          stats: data.results,
          errors: errorDetails
        });
      } else {
        setResultMessage({
          title: 'Import Completed Successfully!',
          type: 'success',
          stats: data.results,
          errors: null
        });
      }
      
      // Reset importing state before showing modal
      setImporting(false);
      setPendingFile(null);
      setShowResultModal(true);
    } catch (error) {
      console.error('Import error:', error);
      setImporting(false);
      setPendingFile(null);
      setResultMessage({
        title: 'Import Failed',
        type: 'error',
        message: error.message,
        stats: null,
        errors: null
      });
      setShowResultModal(true);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Result Modal */}
      {showResultModal && resultMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {resultMessage.type === 'success' && (
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                )}
                {resultMessage.type === 'warning' && (
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠</span>
                  </div>
                )}
                {resultMessage.type === 'error' && (
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✕</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{resultMessage.title}</h3>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {resultMessage.stats && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Rows</p>
                  <p className="text-2xl font-bold text-white">{resultMessage.stats.total}</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Successful</p>
                  <p className="text-2xl font-bold text-green-500">{resultMessage.stats.success}</p>
                </div>
                <div className="bg-red-500/20 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-red-500">{resultMessage.stats.failed}</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Duplicates</p>
                  <p className="text-2xl font-bold text-yellow-500">{resultMessage.stats.duplicates}</p>
                </div>
              </div>
            )}

            {resultMessage.message && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-400">{resultMessage.message}</p>
              </div>
            )}

            {resultMessage.errors && (
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm font-semibold mb-2">First Errors:</p>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">{resultMessage.errors}</pre>
              </div>
            )}

            <button
              onClick={() => setShowResultModal(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Year Selection Dialog */}
      {showYearDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Select Data Year</h3>
            <p className="text-gray-400 mb-6">
              What year does this Excel file data belong to?
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                min="2000"
                max="2100"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Dates without a year (e.g., "04-août") will use this year
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelImport}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Members</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage gym memberships</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={importing}
              className="hidden"
            />
            <span className={`block px-4 py-2 ${importing ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto text-center`}>
              {importing ? '⏳ Importing...' : '📤 Import Excel'}
            </span>
          </label>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            📥 Export CSV
          </button>
          <Link
            href="/admin/members/new"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-center text-sm sm:text-base w-full sm:w-auto"
          >
            ➕ Add Member
          </Link>
        </div>
      </div>

      {/* Filters - Responsive */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by member name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members List - Responsive Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-red-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-4 text-sm sm:text-base">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-gray-400 text-sm sm:text-base">
            {search || statusFilter !== 'all' ? 'No members found matching your criteria' : 'No members yet. Add your first member!'}
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="md:hidden divide-y divide-gray-700">
              {members.map((member) => (
                <div key={member.$id} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="space-y-3">
                    {/* Member Name & ID */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-semibold text-base">{member.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{member.memberId}</p>
                      </div>
                      {getStatusBadge(member.status)}
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-1">
                      <p className="text-sm text-white">{member.email}</p>
                      <p className="text-sm text-gray-400">{member.phone}</p>
                    </div>
                    
                    {/* Plan & Expiry */}
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-400">Plan:</p>
                        <p className="text-white font-medium">{member.planName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400">Expires:</p>
                        <p className="text-white font-medium">
                          {format(new Date(member.subscriptionEndDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Total Paid & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                      <div>
                        <p className="text-xs text-gray-400">Total Paid</p>
                        <p className="text-green-500 font-semibold text-base">
                          ${member.totalPaid.toFixed(2)}
                        </p>
                      </div>
                      <Link
                        href={`/admin/members/${member.$id}`}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {members.map((member) => (
                    <tr key={member.$id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-sm text-gray-400">{member.memberId}</p>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div>
                          <p className="text-white text-sm">{member.email}</p>
                          <p className="text-sm text-gray-400">{member.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <p className="text-white text-sm">{member.planName}</p>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        {getStatusBadge(member.status)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <p className="text-white text-sm">
                          {format(new Date(member.subscriptionEndDate), 'MMM dd, yyyy')}
                        </p>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <p className="text-green-500 font-semibold">
                          ${member.totalPaid.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <Link
                          href={`/admin/members/${member.$id}`}
                          className="text-red-500 hover:text-red-400 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Stats Footer - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm">Total Members</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1">{members.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm">Active Members</p>
          <p className="text-xl sm:text-2xl font-bold text-green-500 mt-1">
            {members.filter(m => m.status === 'Active').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1">
            ${members.reduce((sum, m) => sum + m.totalPaid, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
