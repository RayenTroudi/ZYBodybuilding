'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle, XCircle } from 'lucide-react';

const EMAIL_TEMPLATES = {
  welcome: {
    name: 'Welcome Email',
    subject: 'Bienvenue chez ZY Bodybuilding!',
    html: `Bonjour {memberName},

Nous sommes ravis de vous accueillir dans notre famille. Votre parcours vers un corps plus fort commence maintenant!

Ce qui vous attend:
- Equipements de pointe
- Entraineurs experts
- Cours varies
- Communaute motivante

Variables: {memberName}`,
  },
  classReminder: {
    name: 'Class Reminder',
    subject: "Rappel: Votre Cours Aujourd'hui",
    html: `N'oubliez pas votre cours!

Cours: {className}
Date: {date}
Heure: {time}

Arrivez 10 minutes en avance.

Variables: {className}, {date}, {time}`,
  },
  paymentReminder: {
    name: 'Payment Reminder',
    subject: 'Rappel de Paiement - ZY Bodybuilding',
    html: `Bonjour {memberName},

Rappel concernant votre paiement d'adhesion.

Montant du: {amount}
Date d'echeance: {dueDate}

Variables: {memberName}, {amount}, {dueDate}`,
  },
  promo: {
    name: 'Promotional Offer',
    subject: 'Offre Speciale chez ZY Bodybuilding',
    html: `{promoTitle}

{promoDescription}

PROMOTION: {discount}% OFF
Valable jusqu'au: {validUntil}

Variables: {promoTitle}, {promoDescription}, {discount}, {validUntil}`,
  },
  membershipExpiring: {
    name: 'Membership Expiring',
    subject: 'Votre Adhesion Expire Bientot',
    html: `Bonjour {memberName},

Votre adhesion expire dans {daysRemaining} jour(s).

Renouvelez des aujourd'hui pour continuer a profiter de nos services.

Variables: {memberName}, {daysRemaining}`,
  },
  custom: {
    name: 'Custom Email',
    subject: '',
    html: '',
  },
};

const EMAIL_TYPES = {
  verification: 'Verification',
  welcome: 'Welcome',
  promo: 'Promotion',
  reminder: 'Reminder',
  notification: 'Notification',
  alert: 'Alert',
};

const FL = (text) => (
  <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1.5" style={{ letterSpacing: '0.18em' }}>{text}</p>
);

const inputCls = "w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-primary transition-colors";
const inputStyle = { borderRadius: 0, fontFamily: "'DM Sans', sans-serif" };

export default function EmailManagementPage() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [selectedType, setSelectedType] = useState('notification');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    const template = EMAIL_TEMPLATES[templateId];
    setSubject(template.subject);
    setEmailHtml(template.html);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!recipientEmail || !subject || !emailHtml) {
      setSendResult({ success: false, error: 'All fields are required' });
      return;
    }
    setIsSending(true);
    setSendResult(null);
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientEmail, subject, html: emailHtml, type: selectedType, metadata: { template: selectedTemplate } }),
      });
      const data = await response.json();
      setSendResult(data);
      if (data.success) {
        setTimeout(() => {
          setRecipientEmail('');
          setSubject('');
          setEmailHtml('');
          setSelectedTemplate('custom');
          setSendResult(null);
        }, 3000);
      }
    } catch {
      setSendResult({ success: false, error: 'Failed to send email' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-[#141414]">
        <div>
          <p className="text-neutral-700 text-[9px] font-semibold uppercase mb-1" style={{ letterSpacing: '0.2em' }}>Communications</p>
          <h1 className="text-white font-black uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', letterSpacing: '-0.01em' }}>
            Email
          </h1>
        </div>
      </div>

      {/* Compose */}
      <div className="bg-[#0c0c0c] border border-[#161616]">
        <div className="px-5 py-4 border-b border-[#161616]">
          <p className="text-neutral-700 text-[9px] font-semibold uppercase" style={{ letterSpacing: '0.2em' }}>Compose</p>
          <h2 className="text-white font-black uppercase leading-none mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', letterSpacing: '0.04em' }}>
            New Message
          </h2>
        </div>

        <form onSubmit={handleSendEmail} className="p-5 space-y-4">
          {/* Template + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {FL('Template')}
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className={inputCls}
                style={inputStyle}>
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>{template.name}</option>
                ))}
              </select>
            </div>
            <div>
              {FL('Email Type')}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={inputCls}
                style={inputStyle}>
                {Object.entries(EMAIL_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-[#111]" />

          {/* Recipient */}
          <div>
            {FL('Recipient Email *')}
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              required
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Subject */}
          <div>
            {FL('Subject *')}
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
              maxLength={200}
              className={inputCls}
              style={inputStyle}
            />
            <p className="text-neutral-700 text-[10px] mt-1 text-right font-mono">{subject.length}/200</p>
          </div>

          {/* Body */}
          <div>
            {FL('Content *')}
            <textarea
              value={emailHtml}
              onChange={(e) => setEmailHtml(e.target.value)}
              placeholder="Enter email content..."
              required
              rows={12}
              className={`${inputCls} resize-y font-mono`}
              style={inputStyle}
            />
            <div className="mt-2 px-4 py-3 bg-[#080808] border border-[#111]">
              <p className="text-neutral-700 text-[10px] leading-relaxed">
                Content is auto-formatted with ZY Bodybuilding branding. Use variables like <span className="text-neutral-500 font-mono">{'{memberName}'}</span>, <span className="text-neutral-500 font-mono">{'{amount}'}</span>, <span className="text-neutral-500 font-mono">{'{dueDate}'}</span>.
              </p>
            </div>
            <p className="text-neutral-700 text-[10px] mt-1 text-right font-mono">{emailHtml.length} chars</p>
          </div>

          <div className="border-t border-[#111]" />

          {/* Send */}
          <button
            type="submit"
            disabled={isSending || !recipientEmail || !subject || !emailHtml}
            className="w-full py-3 bg-primary text-white text-xs font-bold uppercase hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>
            {isSending ? (
              <>
                <div className="w-3.5 h-3.5 border-t-2 border-white animate-spin rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send size={12} />
                Send Email
              </>
            )}
          </button>

          {/* Result */}
          {sendResult && (
            <div className={`flex items-start gap-3 px-4 py-3 border-l-2 bg-[#080808] border border-[#1e1e1e] ${sendResult.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
              {sendResult.success
                ? <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                : <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="text-white text-xs font-semibold">{sendResult.success ? 'Email sent successfully' : 'Failed to send email'}</p>
                {sendResult.success && sendResult.data?.messageId && (
                  <p className="text-neutral-600 text-[10px] mt-0.5 font-mono">{sendResult.data.messageId}</p>
                )}
                {!sendResult.success && sendResult.error && (
                  <p className="text-neutral-500 text-[10px] mt-0.5">{sendResult.error}</p>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
