'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { DataTable, createSelectColumn, createActionsColumn } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { CheckCircle, XCircle, Upload, Download, Plus, Loader } from 'lucide-react';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showYearDialog, setShowYearDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pendingFile, setPendingFile] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [toast, setToast] = useState(null);

  // Helper function to get actual member status based on subscription end date
  const getActualStatus = (member) => {
    const endDate = new Date(member.subscriptionEndDate);
    const now = new Date();
    
    if (endDate < now) {
      return 'Expired';
    }
    return member.status;
  };

  useEffect(() => {
    fetchMembers();
  }, [statusFilter, dateFrom, dateTo]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // Don't send status filter to API - we'll filter client-side based on actual dates
      params.append('limit', '5000'); // Fetch all members

      const response = await fetch(`/api/admin/members?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      
      // Client-side filtering based on actual status and dates
      let filteredMembers = data.documents || [];
      
      // Filter by actual status (based on subscription end date)
      if (statusFilter !== 'all') {
        filteredMembers = filteredMembers.filter(member => {
          const actualStatus = getActualStatus(member);
          return actualStatus === statusFilter;
        });
      }
      
      // Filter by date range
      if (dateFrom || dateTo) {
        filteredMembers = filteredMembers.filter(member => {
          const memberDate = new Date(member.subscriptionStartDate);
          const fromDate = dateFrom ? new Date(dateFrom) : null;
          const toDate = dateTo ? new Date(dateTo) : null;
          
          if (fromDate && memberDate < fromDate) return false;
          if (toDate && memberDate > toDate) return false;
          return true;
        });
      }
      
      setMembers(filteredMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const cls = {
      Active:  'badge-active',
      Expired: 'badge-expired',
      Pending: 'badge-pending',
    };
    return (
      <span className={`admin-badge ${cls[status] || 'border border-neutral-700 text-neutral-500'}`}>
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

  const handleBulkDelete = async (ids) => {
    try {
      // Filter out any undefined or null IDs
      const validIds = ids.filter(id => id != null && id !== undefined);
      
      if (validIds.length === 0) {
        showToast('No valid members selected for deletion', 'error');
        return;
      }

      console.log('Deleting members with IDs:', validIds);

      const response = await fetch('/api/admin/members/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: validIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete members');
      }

      // Show success message
      const deletedCount = data.results.success.length;
      showToast(`Successfully deleted ${deletedCount} member(s)`, 'success');
      
      // Refresh the list immediately
      await fetchMembers();
      
      // Force router refresh for any server components
      router.refresh();
    } catch (error) {
      console.error('Error deleting members:', error);
      showToast(error.message, 'error');
    }
  };

  const handleViewMember = (member) => {
    router.push(`/admin/members/${member.$id}`);
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/members/${member.$id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete member');
      }

      showToast('Member deleted successfully', 'success');
      await fetchMembers();
      router.refresh();
    } catch (error) {
      console.error('Error deleting member:', error);
      showToast(error.message, 'error');
    }
  };

  // Define columns for the data table
  const columns = [
    createSelectColumn(),
    {
      accessorKey: 'memberId',
      header: 'Member ID',
      cell: ({ row }) => (
        <div>
          <p className="text-white font-medium">{row.original.name}</p>
          <p className="text-sm text-neutral-400">{row.original.memberId}</p>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }) => (
        <div>
          <p className="text-white text-sm">{row.original.email}</p>
          <p className="text-sm text-neutral-400">{row.original.phone}</p>
        </div>
      ),
    },
    {
      accessorKey: 'planName',
      header: 'Plan',
      cell: ({ row }) => (
        <p className="text-white text-sm">{row.original.planName}</p>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const actualStatus = getActualStatus(row.original);
        return getStatusBadge(actualStatus);
      },
    },
    {
      accessorKey: 'subscriptionEndDate',
      header: 'Expires',
      cell: ({ row }) => (
        <p className="text-white text-sm">
          {format(new Date(row.original.subscriptionEndDate), 'MMM dd, yyyy')}
        </p>
      ),
    },
    {
      accessorKey: 'totalPaid',
      header: 'Total Paid',
      cell: ({ row }) => (
        <p className="text-green-500 font-semibold">
          {row.original.totalPaid.toFixed(2)} TND
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Result Modal */}
      {showResultModal && resultMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded border border-neutral-700 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
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
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {resultMessage.stats && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-neutral-700 rounded p-4">
                  <p className="text-neutral-400 text-sm">Total Rows</p>
                  <p className="text-2xl font-bold text-white">{resultMessage.stats.total}</p>
                </div>
                <div className="bg-green-500/20 rounded p-4">
                  <p className="text-neutral-400 text-sm">Successful</p>
                  <p className="text-2xl font-bold text-green-500">{resultMessage.stats.success}</p>
                </div>
                <div className="bg-red-500/20 rounded p-4">
                  <p className="text-neutral-400 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-red-500">{resultMessage.stats.failed}</p>
                </div>
                <div className="bg-yellow-500/20 rounded p-4">
                  <p className="text-neutral-400 text-sm">Duplicates</p>
                  <p className="text-2xl font-bold text-yellow-500">{resultMessage.stats.duplicates}</p>
                </div>
              </div>
            )}

            {resultMessage.message && (
              <div className="bg-red-500/20 border border-red-500/50 rounded p-4 mb-4">
                <p className="text-red-400">{resultMessage.message}</p>
              </div>
            )}

            {resultMessage.errors && (
              <div className="bg-neutral-700 rounded p-4 mb-4">
                <p className="text-neutral-400 text-sm font-semibold mb-2">First Errors:</p>
                <pre className="text-xs text-neutral-300 whitespace-pre-wrap">{resultMessage.errors}</pre>
              </div>
            )}

            <button
              onClick={() => setShowResultModal(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Year Selection Dialog */}
      {showYearDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded border border-neutral-700 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Select Data Year</h3>
            <p className="text-neutral-400 mb-6">
              What year does this Excel file data belong to?
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Year
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                min="2000"
                max="2100"
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-neutral-500 mt-2">
                Dates without a year (e.g., "04-août") will use this year
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelImport}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>Memberships</p>
          <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Members
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} disabled={importing} className="hidden" />
            <span className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold uppercase transition-colors ${
              importing
                ? 'border-[#1e1e1e] text-neutral-700 cursor-not-allowed'
                : 'border-[#1e1e1e] text-neutral-600 hover:border-[#2a2a2a] hover:text-white'
            }`} style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {importing ? <><Loader className="w-3 h-3 animate-spin" /> Importing</> : <><Upload className="w-3 h-3" /> Import</>}
            </span>
          </label>
          <button onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-[#1e1e1e] text-neutral-600 text-xs font-bold uppercase hover:border-[#2a2a2a] hover:text-white transition-colors"
            style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
            <Download className="w-3 h-3" /> Export
          </button>
          <Link href="/admin/members/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 transition-colors"
            style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
            <Plus className="w-3 h-3" /> Add
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0c0c0c] border border-[#161616] p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1c1c1c] text-neutral-400 text-xs focus:outline-none focus:border-primary transition-colors"
              style={{ borderRadius: 0 }}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>From Date</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs focus:outline-none focus:border-primary transition-colors"
              style={{ borderRadius: 0, colorScheme: 'dark' }} />
          </div>
          <div>
            <label className="block text-[9px] font-semibold uppercase text-neutral-700 mb-1.5" style={{ letterSpacing: '0.18em' }}>To Date</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs focus:outline-none focus:border-primary transition-colors"
              style={{ borderRadius: 0, colorScheme: 'dark' }} />
          </div>
        </div>
        
        {(dateFrom || dateTo) && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-neutral-400">
              Filtering by subscription start date
            </p>
            <button
              onClick={() => {
                setDateFrom('');
                setDateTo('');
              }}
              className="text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              Clear dates
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
          <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
          <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading members...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={members}
          onDelete={handleBulkDelete}
          searchPlaceholder="Search by name, email, or member ID..."
          onRowClick={(member) => router.push(`/admin/members/${member.$id}`)}
        />
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Total Members</p>
          <p className="text-white font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem' }}>{members.length}</p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Active</p>
          <p className="font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', color: '#10B981' }}>
            {members.filter(m => getActualStatus(m) === 'Active').length}
          </p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Total Revenue</p>
          <p className="text-white font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem' }}>
            {members.reduce((sum, m) => sum + m.totalPaid, 0).toFixed(0)}<span className="text-neutral-600 text-lg ml-1">TND</span>
          </p>
        </div>
      </div>

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
