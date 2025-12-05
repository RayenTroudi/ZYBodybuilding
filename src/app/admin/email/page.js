'use client';

/**
 * Admin Email Management Dashboard
 * Allows admins to send emails with templates and track delivery status
 */

import { useState, useEffect } from 'react';
import { FaPaperPlane, FaChartBar, FaHistory, FaExclamationTriangle } from 'react-icons/fa';

// Email Templates
const EMAIL_TEMPLATES = {
  welcome: {
    name: 'Email de Bienvenue',
    subject: 'Bienvenue chez ZY Bodybuilding!',
    html: `<p>Bienvenue dans la famille ZY Bodybuilding!</p>
<p>Votre parcours fitness commence maintenant. Profitez de nos équipements de pointe, entraîneurs experts et cours variés.</p>
<p><strong>Variables disponibles:</strong> {memberName}</p>`,
  },
  classReminder: {
    name: 'Rappel de Cours',
    subject: 'Rappel: Votre Cours Aujourd\'hui',
    html: `<p>N'oubliez pas votre cours à venir!</p>
<p><strong>Variables disponibles:</strong> {className}, {date}, {time}</p>`,
  },
  paymentReminder: {
    name: 'Rappel de Paiement',
    subject: 'Rappel de Paiement - ZY Bodybuilding',
    html: `<p>Rappel amical concernant votre paiement d'adhésion.</p>
<p><strong>Variables disponibles:</strong> {memberName}, {amount}, {dueDate}</p>`,
  },
  promo: {
    name: 'Offre Promotionnelle',
    subject: '🎉 Offre Spéciale chez ZY Bodybuilding',
    html: `<p>Profitez de notre offre exceptionnelle!</p>
<p><strong>Variables disponibles:</strong> {promoTitle}, {promoDescription}, {discount}, {validUntil}</p>`,
  },
  membershipExpiring: {
    name: 'Adhésion Expire Bientôt',
    subject: 'Votre Adhésion Expire Bientôt',
    html: `<p>Votre adhésion arrive à expiration. Renouvelez dès aujourd'hui!</p>
<p><strong>Variables disponibles:</strong> {memberName}, {daysRemaining}</p>`,
  },
  custom: {
    name: 'Email Personnalisé',
    subject: '',
    html: '',
  },
};

const EMAIL_TYPES = {
  verification: 'Vérification',
  welcome: 'Bienvenue',
  promo: 'Promotion',
  reminder: 'Rappel',
  notification: 'Notification',
  alert: 'Alerte',
};

export default function EmailManagementPage() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [selectedType, setSelectedType] = useState('notification');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/email/metrics');
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    const template = EMAIL_TEMPLATES[templateId];
    setSubject(template.subject);
    setEmailHtml(template.html);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!recipientEmail || !subject || !emailHtml) {
      setSendResult({ success: false, error: 'Please fill in all required fields' });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          subject,
          html: emailHtml,
          type: selectedType,
          metadata: { template: selectedTemplate },
        }),
      });

      const data = await response.json();
      setSendResult(data);

      if (data.success) {
        // Clear form after successful send
        setTimeout(() => {
          setRecipientEmail('');
          setSubject('');
          setEmailHtml('');
          setSelectedTemplate('custom');
          setSendResult(null);
          fetchMetrics();
        }, 3000);
      }
    } catch (error) {
      setSendResult({ success: false, error: 'Failed to send email' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Email Management</h1>
        <p className="text-gray-400">Send emails to members and track delivery status</p>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Total Sent (7 days)</h3>
              <FaChartBar className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-white">{metrics.stats?.total || 0}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Successful</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-green-500">{metrics.stats?.sent || 0}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Failed</h3>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-red-500">{metrics.stats?.failed || 0}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-medium">Avg. Duration</h3>
              <FaHistory className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-white">
              {metrics.stats?.avgDuration ? `${Math.round(metrics.stats.avgDuration)}ms` : '0ms'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Email Form */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <FaPaperPlane className="mr-2" />
            Send Email
          </h2>

          <form onSubmit={handleSendEmail} className="space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Object.entries(EMAIL_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recipient Email *
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                required
                maxLength={200}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="mt-1 text-xs text-gray-500">{subject.length}/200 characters</p>
            </div>

            {/* Email Body (HTML) */}
            {/* Email Body (HTML) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contenu de l'Email
              </label>
              <textarea
                value={emailHtml}
                onChange={(e) => setEmailHtml(e.target.value)}
                placeholder="Entrez le contenu de votre email (texte simple, pas besoin de HTML complexe)..."
                required
                rows={8}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <p className="mt-2 text-xs text-gray-400">
                ℹ️ Le contenu sera automatiquement formaté avec le design de ZY Bodybuilding (logo, couleurs, etc.)
              </p>
              <p className="text-xs text-gray-500">{emailHtml.length} caractères</p>
            </div>
            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending || !recipientEmail || !subject || !emailHtml}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  Send Email
                </>
              )}
            </button>

            {/* Send Result */}
            {sendResult && (
              <div
                className={`p-4 rounded-lg ${
                  sendResult.success
                    ? 'bg-green-900/20 border border-green-500'
                    : 'bg-red-900/20 border border-red-500'
                }`}
              >
                {sendResult.success ? (
                  <div>
                    <p className="text-green-400 font-semibold mb-1">✓ Email sent successfully!</p>
                    <p className="text-sm text-gray-400">Message ID: {sendResult.data?.messageId}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-400 font-semibold mb-1 flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      Failed to send email
                    </p>
                    <p className="text-sm text-gray-400">{sendResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Recent Emails */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <FaHistory className="mr-2" />
            Recent Emails
          </h2>

          {metrics && metrics.metrics && metrics.metrics.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {metrics.metrics.slice(0, 20).map((metric, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-medium truncate">{metric.recipientEmail}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(metric.sentAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        metric.status === 'sent'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {metric.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{metric.emailType}</span>
                    {metric.duration && <span>{metric.duration}ms</span>}
                  </div>
                  {metric.error && (
                    <p className="text-xs text-red-400 mt-2">{metric.error}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaHistory className="mx-auto text-5xl text-gray-600 mb-4" />
              <p className="text-gray-400">No emails sent yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
