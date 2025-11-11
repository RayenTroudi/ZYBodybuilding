'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/payments');
      const data = await response.json();
      setPayments(data.documents || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
          <p className="text-gray-400">Track all payment transactions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">This Month</p>
              <p className="text-3xl font-bold text-green-500 mt-2">${monthlyRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-white mt-2">{payments.length}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-4">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No payments recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payments.map((payment) => (
                  <tr key={payment.$id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white">
                        {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(payment.paymentDate), 'hh:mm a')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{payment.memberName}</p>
                        <p className="text-sm text-gray-400">{payment.memberId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{payment.planName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-green-500 font-bold text-lg">
                        ${payment.amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-500">
                        {payment.paymentMethod || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Completed'
                          ? 'bg-green-500/20 text-green-500'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Cash', 'Card', 'Online'].map((method) => {
            const count = payments.filter(p => p.paymentMethod === method).length;
            const total = payments
              .filter(p => p.paymentMethod === method)
              .reduce((sum, p) => sum + p.amount, 0);

            return (
              <div key={method} className="p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">{method}</p>
                <p className="text-2xl font-bold text-white">${total.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{count} transactions</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
