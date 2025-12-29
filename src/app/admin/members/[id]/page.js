'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

// Dynamically import PDFReceipt to avoid SSR issues
const PDFReceipt = dynamic(() => import('@/app/components/PDFReceipt'), {
  ssr: false,
});

export default function MemberDetailPage({ params }) {
  const { id } = use(params);
  const [member, setMember] = useState(null);
  const [payments, setPayments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [renewData, setRenewData] = useState({
    planId: '',
    paymentMethod: 'Cash',
  });
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
  });
  const [saving, setSaving] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMemberDetails();
    fetchPlans();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/members/${id}`);
      const data = await response.json();
      
      if (!data.member) {
        console.error('No member data received:', data);
        showToast('Failed to load member details', 'error');
        return;
      }
      
      setMember(data.member);
      setPayments(data.payments || []);
      // Initialize edit data with member details
      setEditData({
        name: data.member.name || '',
        email: data.member.email || '',
        phone: data.member.phone || '',
        address: data.member.address || '',
        emergencyContact: data.member.emergencyContact || '',
      });
    } catch (error) {
      console.error('Error fetching member:', error);
      showToast('Failed to load member details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans?activeOnly=true');
      const data = await response.json();
      setPlans(data.documents || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    const selectedPlan = plans.find(p => p.$id === renewData.planId);
    if (!selectedPlan) return;

    try {
      const response = await fetch(`/api/admin/members/${id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.$id,
          planName: selectedPlan.name,
          planDuration: selectedPlan.duration,
          amount: selectedPlan.price,
          paymentMethod: renewData.paymentMethod,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setShowRenewModal(false);
        await fetchMemberDetails();
        
        // Prepare receipt data
        const endDate = new Date(result.member.subscriptionEndDate);
        const startDate = new Date();
        
        setReceiptData({
          member: result.member,
          plan: selectedPlan,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          payment: selectedPlan.price,
          paymentMethod: renewData.paymentMethod,
          timestamp: new Date().toISOString(),
        });
        
        setShowReceipt(true);
        showToast('Membership renewed successfully!', 'success');
      } else {
        const errorData = await response.json();
        console.error('Renewal error:', errorData);
        showToast(`Failed to renew: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error renewing membership:', error);
      showToast(`Failed to renew membership: ${error.message}`, 'error');
    }
  };

  const generatePDF = async () => {
    if (!receiptData) return;
    
    setGeneratingPDF(true);
    
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { default: PDFReceiptComponent } = await import('@/app/components/PDFReceipt');
      
      const blob = await pdf(<PDFReceiptComponent data={receiptData} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt_${receiptData.member.memberId}_${receiptData.member.name.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to generate PDF', 'error');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePrint = async () => {
    if (!receiptData) return;

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { default: PDFReceiptComponent } = await import('@/app/components/PDFReceipt');
      
      const blob = await pdf(<PDFReceiptComponent data={receiptData} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Error printing:', error);
      showToast('Failed to open print dialog', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteModal(false);
        showToast('Member deleted successfully! Redirecting...', 'success');
        setTimeout(() => {
          router.push('/admin/members');
        }, 1500);
      } else {
        showToast('Failed to delete member', 'error');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      showToast('Failed to delete member', 'error');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setMember(updatedMember);
        setShowEditModal(false);
        showToast('Member updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showToast(`Failed to update: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating member:', error);
      showToast(`Failed to update member: ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Member not found</div>
      </div>
    );
  }

  const isExpired = new Date(member.subscriptionEndDate) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(member.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/members"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{member.name}</h1>
            <p className="text-gray-400">{member.memberId}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setShowRenewModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            🔄 Renew
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {isExpired ? (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-500 font-semibold">⚠️ Membership expired on {format(new Date(member.subscriptionEndDate), 'MMM dd, yyyy')}</p>
        </div>
      ) : daysUntilExpiry <= 7 ? (
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-500 font-semibold">⚠️ Membership expires in {daysUntilExpiry} days</p>
        </div>
      ) : null}

      {/* Member Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact & Subscription Info */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Member Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white mt-1">{member.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-white mt-1">{member.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white mt-1">{member.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Emergency Contact</p>
                <p className="text-white mt-1">{member.emergencyContact || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Payment History</h2>
            <div className="space-y-3">
              {payments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No payment history</p>
              ) : (
                payments.map((payment) => (
                  <div key={payment.$id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{payment.planName}</p>
                        {payment.includesAssurance && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded border border-blue-500/30">
                            🛡️ +Assurance
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {format(new Date(payment.paymentDate), 'MMM dd, yyyy')} • {payment.paymentMethod}
                      </p>
                      {payment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{payment.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-bold text-lg">${payment.amount.toFixed(2)}</p>
                      <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-500">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">Current Plan</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Plan</p>
                <p className="text-white font-medium mt-1">{member.planName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                  member.status === 'Active' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {member.status}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Start Date</p>
                <p className="text-white mt-1">
                  {format(new Date(member.subscriptionStartDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">End Date</p>
                <p className="text-white mt-1">
                  {format(new Date(member.subscriptionEndDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Total Paid</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  ${member.totalPaid.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Payment Count</p>
                <p className="text-white font-medium mt-1">{payments.length} payments</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Payment</p>
                <p className="text-white mt-1">
                  {payments.length > 0 
                    ? format(new Date(payments[0].paymentDate), 'MMM dd, yyyy')
                    : 'N/A'}
                </p>
              </div>
              {member.hasAssurance && (
                <div className="pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <p className="text-blue-400 text-sm font-semibold">Assurance Active</p>
                      <p className="text-xs text-gray-400">{member.assuranceAmount} DT</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Renew Membership</h2>
            <form onSubmit={handleRenew} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Plan
                </label>
                <select
                  value={renewData.planId}
                  onChange={(e) => setRenewData({ ...renewData, planId: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Choose a plan...</option>
                  {plans.map((plan) => (
                    <option key={plan.$id} value={plan.$id}>
                      {plan.name} - ${plan.price} ({plan.duration} days)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={renewData.paymentMethod}
                  onChange={(e) => setRenewData({ ...renewData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Renew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700 my-8">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Member</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter member name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="member@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={editData.emergencyContact}
                    onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full address"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Delete Member</h3>
                  <p className="text-gray-400 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300">
                  Are you sure you want to delete <span className="font-semibold text-white">{member?.name}</span>? 
                  This will permanently remove their profile and all associated payment records.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Receipt Generated</h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Renewal Successful!</h3>
                  <p className="text-gray-400 text-sm">Member ID: {receiptData.member.memberId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Member Name</p>
                  <p className="text-white font-medium">{receiptData.member.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Plan</p>
                  <p className="text-white font-medium">{receiptData.plan.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-white font-medium">{receiptData.plan.duration} days</p>
                </div>
                <div>
                  <p className="text-gray-400">Amount</p>
                  <p className="text-white font-medium">${receiptData.payment}</p>
                </div>
                <div>
                  <p className="text-gray-400">Start Date</p>
                  <p className="text-white font-medium">{format(new Date(receiptData.startDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-gray-400">End Date</p>
                  <p className="text-white font-medium">{format(new Date(receiptData.endDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={generatePDF}
                disabled={generatingPDF}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? '⏳ Generating...' : '📥 Download PDF'}
              </button>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div
            className={`px-6 py-4 rounded-lg shadow-2xl border-l-4 min-w-[320px] ${
              toast.type === 'success'
                ? 'bg-gray-800 border-green-500 text-white'
                : 'bg-gray-800 border-red-500 text-white'
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
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
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
