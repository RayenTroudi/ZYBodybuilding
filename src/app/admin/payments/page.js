'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { DataTable, createSelectColumn, createActionsColumn } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';

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
    if (!window.confirm(`Are you sure you want to delete this payment of $${payment.amount.toFixed(2)}?`)) {
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
          ${row.original.amount.toFixed(2)}
        </p>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-500">
          {row.original.paymentMethod || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.original.status === 'Completed'
            ? 'bg-green-500/20 text-green-500'
            : row.original.status === 'Pending'
            ? 'bg-yellow-500/20 text-yellow-500'
            : 'bg-red-500/20 text-red-500'
        }`}>
          {row.original.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
          <p className="text-neutral-400">Track all payment transactions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Date Filters */}
      <div className="bg-neutral-800 rounded-lg p-4 sm:p-6 border border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        
        {(dateFrom || dateTo) && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-neutral-400">
              Filtering by payment date
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

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">This Month</p>
              <p className="text-3xl font-bold text-green-500 mt-2">${monthlyRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-white mt-2">{payments.length}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-12 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-400 mt-4">Loading payments...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          onDelete={handleBulkDelete}
          searchPlaceholder="Search by member name, plan, or payment method..."
        />
      )}

      {/* Payment Methods Breakdown */}
      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <h2 className="text-xl font-bold text-white mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Cash', 'Card', 'Online'].map((method) => {
            const count = payments.filter(p => p.paymentMethod === method).length;
            const total = payments
              .filter(p => p.paymentMethod === method)
              .reduce((sum, p) => sum + p.amount, 0);

            return (
              <div key={method} className="p-4 bg-neutral-700 rounded-lg">
                <p className="text-neutral-400 text-sm mb-2">{method}</p>
                <p className="text-2xl font-bold text-white">${total.toFixed(2)}</p>
                <p className="text-xs text-neutral-400 mt-1">{count} transactions</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div
            className={`px-6 py-4 rounded-lg shadow-2xl border-l-4 min-w-[320px] ${
              toast.type === 'success'
                ? 'bg-neutral-800 border-green-500 text-white'
                : 'bg-neutral-800 border-red-500 text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">
                {toast.type === 'success' ? '✅' : '❌'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="flex-shrink-0 text-neutral-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
