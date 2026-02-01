'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { cachedFetch, invalidateCache } from '@/lib/cache';

// Dynamically import PDFReceipt and pdf renderer to avoid SSR issues
const PDFReceipt = dynamic(() => import('@/app/components/PDFReceipt'), {
  ssr: false,
});

export default function NewMemberPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const receiptRef = useRef(null);
  const printRef = useRef(null);
  const [formData, setFormData] = useState({
    memberId: `MEM${Date.now().toString().slice(-6)}`,
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    planId: '',
    subscriptionStartDate: new Date().toISOString().split('T')[0],
    initialPayment: '',
    paymentMethod: 'Cash',
    includeAssurance: false,
  });
  const router = useRouter();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await cachedFetch('/api/admin/plans?activeOnly=true', {}, 300000); // 5 min cache
      setPlans(data.documents || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedPlan = plans.find(p => p.$id === formData.planId);
    if (!selectedPlan) {
      showToast('Please select a plan', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          planName: selectedPlan.name,
          planDuration: selectedPlan.duration,
        }),
      });

      if (response.ok) {
        const member = await response.json();
        invalidateCache('/api/admin/members'); // Invalidate members cache
        
        // Calculate end date
        const startDate = new Date(formData.subscriptionStartDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(selectedPlan.duration));
        
        // Set receipt data
        setReceiptData({
          member,
          plan: selectedPlan,
          startDate: formData.subscriptionStartDate,
          endDate: endDate.toISOString().split('T')[0],
          payment: formData.initialPayment,
          paymentMethod: formData.paymentMethod,
          timestamp: new Date().toISOString(),
          includeAssurance: formData.includeAssurance,
          assuranceAmount: formData.includeAssurance ? 20 : 0,
        });
        
        setShowReceipt(true);
        showToast(`Member ${member.name} created successfully!`, 'success');
      } else {
        const error = await response.json();
        showToast(`Failed to create member: ${error.error}`, 'error');
      }
    } catch (error) {
      console.error('Error creating member:', error);
      showToast('Failed to create member. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!receiptData) return;
    
    setGeneratingPDF(true);
    
    try {
      // Dynamically import pdf renderer to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const { default: PDFReceiptComponent } = await import('@/app/components/PDFReceipt');
      
      // Generate PDF blob using @react-pdf/renderer
      const blob = await pdf(<PDFReceiptComponent data={receiptData} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt_${receiptData.member.memberId}_${receiptData.member.name.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      // Clean up
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
      // Dynamically import pdf renderer to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const { default: PDFReceiptComponent } = await import('@/app/components/PDFReceipt');
      
      // Generate PDF and open in new window for printing
      const blob = await pdf(<PDFReceiptComponent data={receiptData} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      // Open in new window
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Error printing PDF:', error);
      showToast('Failed to print PDF', 'error');
    }
  };

  const handleNewMember = () => {
    setShowReceipt(false);
    setReceiptData(null);
    setFormData({
      memberId: `MEM${Date.now().toString().slice(-6)}`,
      name: '',
      email: '',
      phone: '',
      address: '',
      emergencyContact: '',
      planId: '',
      subscriptionStartDate: new Date().toISOString().split('T')[0],
      initialPayment: '',
      paymentMethod: 'Cash',
      includeAssurance: false,
    });
  };

  const handleViewMember = () => {
    if (receiptData?.member?.$id) {
      router.push(`/admin/members/${receiptData.member.$id}`);
    }
  };

  // Show receipt if available
  if (showReceipt && receiptData) {
    return (
      <>
        {/* Receipt Success View */}
        <div className="min-h-screen bg-black py-8 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Membre Créé avec Succès! 🎉
              </h1>
              <p className="text-neutral-400 text-lg">
                {receiptData.member.name} a été ajouté au système
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={generatePDF}
                disabled={generatingPDF}
                className="px-6 py-4 bg-primary hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generatingPDF ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Génération...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Télécharger PDF
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer
              </button>
              <button
                onClick={handleNewMember}
                className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau Membre
              </button>
              <button
                onClick={handleViewMember}
                className="px-6 py-4 bg-neutral-700 hover:bg-neutral-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Voir Profil
              </button>
            </div>

            {/* Receipt Preview Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
              <div className="border-l-4 border-red-600 pl-6 mb-6">
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">Aperçu du Reçu</h2>
                <p className="text-neutral-600">
                  Le reçu PDF sera généré avec les informations ci-dessous
                </p>
              </div>

              {/* Member Summary */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-neutral-100 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                    Informations Membre
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Nom:</span>
                      <span className="font-semibold text-neutral-900">{receiptData.member.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">ID:</span>
                      <span className="font-semibold text-red-600">{receiptData.member.memberId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Email:</span>
                      <span className="font-semibold text-neutral-900 text-sm">{receiptData.member.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Téléphone:</span>
                      <span className="font-semibold text-neutral-900">{receiptData.member.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                    Détails Abonnement
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Plan:</span>
                      <span className="font-bold text-red-600">{receiptData.plan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Durée:</span>
                      <span className="font-semibold text-neutral-900">{receiptData.plan.duration} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Début:</span>
                      <span className="font-semibold text-neutral-900">
                        {new Date(receiptData.startDate).toLocaleDateString('fr-TN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Fin:</span>
                      <span className="font-semibold text-neutral-900">
                        {new Date(receiptData.endDate).toLocaleDateString('fr-TN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                  Résumé Paiement
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Méthode de Paiement:</span>
                    <span className="font-semibold text-neutral-900">{receiptData.paymentMethod}</span>
                  </div>
                  <div className="pt-2 border-t border-green-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Abonnement ({receiptData.plan.name}):</span>
                      <span className="font-semibold text-neutral-900">
                        {(parseFloat(receiptData.payment) - (receiptData.includeAssurance ? 20 : 0)).toFixed(2)} TND
                      </span>
                    </div>
                    {receiptData.includeAssurance && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">🛡️ Assurance:</span>
                        <span className="font-semibold text-blue-600">20.00 TND</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t-2 border-green-300">
                    <span className="text-neutral-800 font-bold">Montant Total:</span>
                    <span className="font-bold text-green-600">
                      {parseFloat(receiptData.payment).toLocaleString('fr-TN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} TND
                    </span>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Paiement Confirmé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Toast notification */}
            {toast && (
              <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl ${
                toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              } text-white font-semibold animate-bounce`}>
                {toast.message}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  const selectedPlan = plans.find(p => p.$id === formData.planId);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            ← Back to Members
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Add New Member</h1>
          <p className="text-neutral-400 text-lg">Create a new gym membership</p>
        </div>

        {/* Form Card */}
        <div className="bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-700">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-neutral-700">
                👤 Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Member ID
              </label>
              <input
                type="text"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                required
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="+1234567890"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="123 Main St, City, State 12345"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Jane Doe: +1234567891"
              />
            </div>
          </div>
        </div>

            {/* Subscription Details */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-neutral-700">
                💳 Subscription Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Select Plan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.planId}
                onChange={(e) => {
                  const plan = plans.find(p => p.$id === e.target.value);
                  const planPrice = plan ? parseFloat(plan.price) : 0;
                  const assuranceFee = formData.includeAssurance ? 20 : 0;
                  const totalAmount = planPrice + assuranceFee;
                  setFormData({ 
                    ...formData, 
                    planId: e.target.value,
                    initialPayment: totalAmount > 0 ? totalAmount.toString() : ''
                  });
                }}
                required
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="">Choose a plan...</option>
                {plans.map((plan) => (
                  <option key={plan.$id} value={plan.$id}>
                    {plan.name} - {plan.price} TND ({plan.duration} days)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.subscriptionStartDate}
                onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value })}
                required
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {selectedPlan && (
              <div className="md:col-span-2 p-5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span>📋</span> Selected Plan Summary
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Plan:</span>
                    <span className="text-white font-semibold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Price:</span>
                    <span className="text-green-400 font-semibold">{selectedPlan.price} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Duration:</span>
                    <span className="text-white font-semibold">{selectedPlan.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">End Date:</span>
                    <span className="text-white font-semibold">
                      {new Date(
                        new Date(formData.subscriptionStartDate).getTime() + 
                        selectedPlan.duration * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-neutral-700">
                💰 Initial Payment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Payment Amount (Auto-calculated)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.initialPayment}
                onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })}
                min="0"
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder={selectedPlan ? `${parseFloat(selectedPlan.price) + (formData.includeAssurance ? 20 : 0)}` : '0.00'}
              />
              <p className="text-xs text-neutral-500 mt-2">
                💡 Updates automatically when plan or assurance is selected
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="Cash">💵 Cash</option>
                <option value="Card">💳 Card</option>
                <option value="Online">🌐 Online</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl cursor-pointer hover:bg-blue-500/20 transition-all">
                <input
                  type="checkbox"
                  checked={formData.includeAssurance}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const planPrice = selectedPlan ? parseFloat(selectedPlan.price) : 0;
                    const assuranceFee = checked ? 20 : 0;
                    const totalAmount = planPrice + assuranceFee;
                    setFormData({ 
                      ...formData, 
                      includeAssurance: checked,
                      initialPayment: totalAmount > 0 ? totalAmount.toString() : formData.initialPayment
                    });
                  }}
                  className="w-5 h-5 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-white font-semibold">🛡️ Include Assurance</span>
                  <p className="text-sm text-neutral-400 mt-1">
                    Add insurance coverage for 20 DT
                  </p>
                </div>
                {formData.includeAssurance && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-lg">
                    +20 DT
                  </span>
                )}
              </label>
            </div>

            {/* Payment Summary */}
            {selectedPlan && formData.initialPayment && (
              <div className="md:col-span-2 p-5 bg-green-500/10 border border-green-500/20 rounded-xl">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span>💰</span> Payment Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Plan ({selectedPlan.name}):</span>
                    <span className="text-white font-semibold">{selectedPlan.price} DT</span>
                  </div>
                  {formData.includeAssurance && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">🛡️ Assurance:</span>
                      <span className="text-blue-400 font-semibold">20.00 DT</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-green-500/30 flex justify-between">
                    <span className="text-white font-bold">Total Amount:</span>
                    <span className="text-green-400 font-bold text-lg">
                      {parseFloat(formData.initialPayment).toFixed(2)} DT
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
          <Link
            href="/admin/members"
            className="flex-1 px-6 py-3.5 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-xl transition-all text-center shadow-lg hover:shadow-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3.5 bg-primary hover:opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? '⏳ Creating...' : '✨ Create Member'}
          </button>
        </div>
          </form>
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
    </div>
  );
}
