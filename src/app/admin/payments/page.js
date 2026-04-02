'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { DataTable, createSelectColumn, createActionsColumn } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [dateFrom, dateTo]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/payments');
      const data = await response.json();
      
      // Client-side date filtering
      let filteredPayments = data.documents || [];
      if (dateFrom || dateTo) {
        filteredPayments = filteredPayments.filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          const fromDate = dateFrom ? new Date(dateFrom) : null;
          const toDate = dateTo ? new Date(dateTo) : null;
          
          if (fromDate && paymentDate < fromDate) return false;
          if (toDate && paymentDate > toDate) return false;
          return true;
        });
      }
      
      setPayments(filteredPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      const response = await fetch('/api/admin/payments/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete payments');
      }

      // Show success message
      showToast(`Successfully deleted ${data.results.success.length} payment(s)`, 'success');
      
      // Refresh the list
      await fetchPayments();
      router.refresh();
    } catch (error) {
      console.error('Error deleting payments:', error);
      showToast(error.message, 'error');
    }
  };

  const handleDeletePayment = async (payment) => {
    if (!window.confirm(`Are you sure you want to delete this payment of ${payment.amount.toFixed(2)} TND?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/payments/${payment.$id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }

      showToast('Payment deleted successfully', 'success');
      await fetchPayments();
      router.refresh();
    } catch (error) {
      console.error('Error deleting payment:', error);
      showToast(error.message, 'error');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Member ID', 'Member Name', 'Plan', 'Amount', 'Method', 'Status'];
    const rows = payments.map(p => [
      format(new Date(p.paymentDate), 'yyyy-MM-dd'),
      p.memberId,
      p.memberName,
      p.planName,
      p.amount,
      p.paymentMethod,
      p.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const monthlyRevenue = payments
    .filter(p => new Date(p.paymentDate) >= thisMonth)
    .reduce((sum, p) => sum + p.amount, 0);

  // Define columns for the data table
  const columns = [
    createSelectColumn(),
    {
      accessorKey: 'paymentDate',
      header: 'Date',
      cell: ({ row }) => (
        <div>
          <p className="text-white">
            {format(new Date(row.original.paymentDate), 'MMM dd, yyyy')}
          </p>
          <p className="text-xs text-neutral-400">
            {format(new Date(row.original.paymentDate), 'hh:mm a')}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'memberName',
      header: 'Member',
      cell: ({ row }) => (
        <div>
          <p className="text-white font-medium">{row.original.memberName}</p>
          <p className="text-sm text-neutral-400">{row.original.memberId}</p>
        </div>
      ),
    },
    {
      accessorKey: 'planName',
      header: 'Plan',
      cell: ({ row }) => (
        <p className="text-white">{row.original.planName}</p>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <p className="text-green-500 font-bold text-lg">
          {row.original.amount.toFixed(2)} TND
        </p>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }) => (
        <span className="admin-badge border border-[#2a2a2a] text-neutral-500 bg-[#111]">
          {row.original.paymentMethod || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`admin-badge ${
          row.original.status === 'Completed' ? 'badge-active'
          : row.original.status === 'Pending'  ? 'badge-pending'
          : 'badge-expired'
        }`}>
          {row.original.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>Finance</p>
          <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Payments
          </h1>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 border border-[#1e1e1e] text-neutral-600 text-xs font-semibold uppercase hover:border-[#2a2a2a] hover:text-white transition-colors"
          style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Export CSV
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Total Revenue</p>
          <p className="text-white font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem' }}>
            {totalRevenue.toFixed(0)}<span className="text-neutral-600 text-lg ml-1">TND</span>
          </p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>This Month</p>
          <p className="font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', color: '#10B981' }}>
            {monthlyRevenue.toFixed(0)}<span className="text-neutral-600 text-lg ml-1">TND</span>
          </p>
        </div>
        <div className="bg-[#0c0c0c] border border-[#161616] p-5">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>Transactions</p>
          <p className="text-white font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem' }}>
            {payments.length}
          </p>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-[#0c0c0c] border border-[#161616] p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <p className="text-neutral-700 text-xs">Filtering by payment date</p>
            <button onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-xs text-primary hover:text-red-400 transition-colors uppercase font-semibold" style={{ letterSpacing: '0.08em' }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-[#0c0c0c] border border-[#161616] flex items-center justify-center gap-3 py-16">
          <div className="w-4 h-4 border-t-2 border-primary animate-spin rounded-full" />
          <span className="text-neutral-700 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>Loading payments...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          onDelete={handleBulkDelete}
          searchPlaceholder="Search by member name, plan, or payment method..."
        />
      )}

      {/* Payment Methods */}
      <div className="bg-[#0c0c0c] border border-[#161616]">
        <div className="px-5 py-4 border-b border-[#161616]">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase" style={{ letterSpacing: '0.2em' }}>Breakdown</p>
          <h2 className="text-white font-black uppercase leading-none mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', letterSpacing: '0.04em' }}>
            Payment Methods
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#111]">
          {['Cash', 'Card', 'Online'].map((method) => {
            const count = payments.filter(p => p.paymentMethod === method).length;
            const total = payments.filter(p => p.paymentMethod === method).reduce((s, p) => s + p.amount, 0);
            return (
              <div key={method} className="px-5 py-4">
                <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-2" style={{ letterSpacing: '0.18em' }}>{method}</p>
                <p className="text-white font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem' }}>
                  {total.toFixed(0)}<span className="text-neutral-600 text-sm ml-1">TND</span>
                </p>
                <p className="text-neutral-700 text-[10px] mt-1">{count} transactions</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-5 py-3.5 border-l-2 min-w-[280px] bg-[#0c0c0c] border border-[#1e1e1e] ${
            toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
          }`}>
            <p className="text-white text-xs flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-neutral-600 hover:text-white transition-colors text-xs">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
