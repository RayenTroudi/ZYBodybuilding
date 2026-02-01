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
    html: `Bonjour {memberName},

Nous sommes ravis de vous accueillir dans notre famille. Votre parcours vers un corps plus fort et plus sain commence maintenant!

Ce qui vous attend:
• Équipements de pointe - Machines et poids de qualité professionnelle
• Entraîneurs experts - Accompagnement personnalisé pour vos objectifs
• Cours variés - Planning flexible adapté à votre emploi du temps
• Communauté motivante - Entourez-vous de passionnés de fitness

Nous avons hâte de vous voir et de vous accompagner dans votre transformation!

Prochaines étapes:
• Consultez notre planning de cours
• Rencontrez nos entraîneurs
• Commencez votre première séance

Variables: Remplacez {memberName} par le nom du membre`,
  },
  classReminder: {
    name: 'Rappel de Cours',
    subject: 'Rappel: Votre Cours Aujourd\'hui',
    html: `N'oubliez pas votre cours à venir!

Cours: {className}
Date: {date}
Heure: {time}

Nous avons hâte de vous voir! 💪

💡 Conseil: Arrivez 10 minutes en avance pour vous échauffer et préparer votre équipement.

Variables: {className}, {date}, {time}`,
  },
  paymentReminder: {
    name: 'Rappel de Paiement',
    subject: 'Rappel de Paiement - ZY Bodybuilding',
    html: `Bonjour {memberName},

Ceci est un rappel amical concernant votre paiement d'adhésion.

Montant dû: {amount}
Date d'échéance: {dueDate}

Pour continuer à profiter de nos services sans interruption, veuillez effectuer votre paiement avant la date d'échéance.

Moyens de paiement acceptés:
• En salle (espèces ou carte bancaire)
• Virement bancaire
• Paiement mobile

Variables: {memberName}, {amount}, {dueDate}`,
  },
  promo: {
    name: 'Offre Promotionnelle',
    subject: '🎉 Offre Spéciale chez ZY Bodybuilding',
    html: `🎉 {promoTitle}

{promoDescription}

PROMOTION: {discount}% OFF
Offre à Durée Limitée

Valable jusqu'au: {validUntil}

Ne manquez pas cette opportunité exceptionnelle! Cette offre est valable pour:
• Nouvelles adhésions
• Renouvellements anticipés
• Abonnements longue durée

Variables: {promoTitle}, {promoDescription}, {discount}, {validUntil}`,
  },
  membershipExpiring: {
    name: 'Adhésion Expire Bientôt',
    subject: 'Votre Adhésion Expire Bientôt',
    html: `Bonjour {memberName},

Votre adhésion arrive à expiration dans {daysRemaining} jour(s).

Ne laissez pas votre parcours fitness s'arrêter! Renouvelez dès aujourd'hui pour continuer à profiter de tous nos services.

Ce que vous conservez en renouvelant:
• Accès illimité à toutes les installations
• Tous les cours collectifs inclus
• Coaching personnalisé sur demande
• Événements exclusifs réservés aux membres

Variables: {memberName}, {daysRemaining}`,
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
    <div className="min-h-screen bg-neutral-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-500/10 p-3 rounded-md border border-red-500/20">
              <FaPaperPlane className="text-red-500 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Email Management</h1>
              <p className="text-neutral-400 text-sm mt-1">Send customized emails to your members</p>
            </div>
          </div>
        </div>

        {/* Email Form Card */}
        <div className="bg-neutral-800 rounded-md shadow-2xl border border-neutral-700 overflow-hidden">
          {/* Card Header */}
          <div className="bg-primary px-6 py-4 border-b border-red-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaPaperPlane className="text-white" />
              Compose Email
            </h2>
          </div>

          <form onSubmit={handleSendEmail} className="p-6 space-y-6">
            {/* Template and Type Selection - Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                  <span className="text-red-400">📋</span>
                  Select Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-700 border-2 border-neutral-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all hover:border-neutral-500 cursor-pointer"
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
                <label className="block text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                  <span className="text-red-400">🏷️</span>
                  Email Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-700 border-2 border-neutral-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all hover:border-neutral-500 cursor-pointer"
                >
                  {Object.entries(EMAIL_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-700"></div>

            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                <span className="text-red-400">✉️</span>
                Recipient Email
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
                className="w-full px-4 py-3 bg-neutral-700 border-2 border-neutral-600 rounded text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all hover:border-neutral-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                <span className="text-red-400">📝</span>
                Subject
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                required
                maxLength={200}
                className="w-full px-4 py-3 bg-neutral-700 border-2 border-neutral-600 rounded text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all hover:border-neutral-500"
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-neutral-400">Keep it clear and concise</p>
                <p className="text-xs text-neutral-500 font-mono">{subject.length}/200</p>
              </div>
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                <span className="text-red-400">📄</span>
                Email Content
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={emailHtml}
                onChange={(e) => setEmailHtml(e.target.value)}
                placeholder="Entrez le contenu de votre email (texte simple, pas besoin de HTML complexe)..."
                required
                rows={12}
                className="w-full px-4 py-3 bg-neutral-700 border-2 border-neutral-600 rounded text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all hover:border-neutral-500 text-sm font-mono resize-y"
              />
              
              {/* Helper Information Box */}
              <div className="mt-3 bg-neutral-700/50 border border-neutral-600 rounded p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">ℹ️</span>
                  <p className="text-xs text-neutral-300">
                    Le contenu sera automatiquement formaté avec le design de ZY Bodybuilding (logo, couleurs, en-tête, pied de page).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">📝</span>
                  <p className="text-xs text-neutral-300">
                    <strong className="text-yellow-300">Variables disponibles:</strong> {'{memberName}'}, {'{amount}'}, {'{dueDate}'}, etc. 
                    <br />
                    <span className="text-neutral-400 italic">Exemple: "Bonjour {'{memberName}'}, votre paiement de {'{amount}'} est dû."</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <p className="text-xs text-neutral-400">
                    Le texte sera converti automatiquement en HTML (paragraphes, sauts de ligne, etc.)
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-neutral-500 mt-2 font-mono text-right">{emailHtml.length} caractères</p>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-700"></div>
            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending || !recipientEmail || !subject || !emailHtml}
              className="w-full bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-lg" />
                  <span>Send Email</span>
                </>
              )}
            </button>

            {/* Send Result */}
            {sendResult && (
              <div
                className={`p-4 rounded border-2 ${
                  sendResult.success
                    ? 'bg-green-900/20 border-green-500'
                    : 'bg-red-900/20 border-red-500'
                }`}
              >
                {sendResult.success ? (
                  <div className="space-y-2">
                    <p className="text-green-400 font-bold text-lg flex items-center gap-2">
                      <span className="text-2xl">✓</span>
                      Email sent successfully!
                    </p>
                    <p className="text-sm text-neutral-300">
                      <span className="text-neutral-400">Message ID:</span>{' '}
                      <span className="font-mono text-green-300">{sendResult.data?.messageId}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-red-400 font-bold text-lg flex items-center gap-2">
                      <FaExclamationTriangle className="text-xl" />
                      Failed to send email
                    </p>
                    <p className="text-sm text-neutral-300">{sendResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
