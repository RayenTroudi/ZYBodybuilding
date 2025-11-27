'use client';

/**
 * Admin SMS Management Dashboard
 * Allows admins to send SMS messages with templates and track delivery status
 */

import { useState, useEffect } from 'react';
import { FaPaperPlane, FaChartBar, FaHistory, FaExclamationTriangle } from 'react-icons/fa';

// SMS Templates
const SMS_TEMPLATES = {
  welcome: {
    name: 'Welcome Message',
    body: 'Welcome to ZY Bodybuilding! We\'re excited to have you join our fitness family. Visit us at [address] or call [phone] for more info.',
  },
  classReminder: {
    name: 'Class Reminder',
    body: 'Reminder: Your [class_name] class is scheduled for [date] at [time]. See you there!',
  },
  paymentReminder: {
    name: 'Payment Due',
    body: 'Hi! Your membership payment of [amount] is due on [date]. Please renew to continue enjoying our services.',
  },
  promo: {
    name: 'Promotional Offer',
    body: '🎉 Special Offer! Get [discount]% off on [plan_name]. Valid until [expiry_date]. Visit us today!',
  },
  expiringSoon: {
    name: 'Membership Expiring',
    body: 'Your membership expires in [days] days. Renew now to avoid interruption. Reply or visit us to renew.',
  },
  custom: {
    name: 'Custom Message',
    body: '',
  },
};

const SMS_TYPES = {
  verification: 'Verification',
  promo: 'Promotional',
  reminder: 'Reminder',
  notification: 'Notification',
  alert: 'Alert',
};

export default function SMSManagementPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [selectedType, setSelectedType] = useState('notification');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [sentMessages, setSentMessages] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Load metrics on mount
  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/sms/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.success ? data.data : data);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const handleTemplateChange = (templateKey) => {
    setSelectedTemplate(templateKey);
    if (templateKey !== 'custom') {
      setMessageBody(SMS_TEMPLATES[templateKey].body);
    } else {
      setMessageBody('');
    }
  };

  const handleSendSMS = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          body: messageBody,
          type: selectedType,
          metadata: {
            template: selectedTemplate,
            sentAt: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: 'SMS sent successfully!',
          data: data.data,
        });

        // Add to sent messages list
        setSentMessages([
          {
            id: data.data.sid,
            phone: phoneNumber,
            body: messageBody,
            type: selectedType,
            status: data.data.status,
            sentAt: new Date().toISOString(),
          },
          ...sentMessages.slice(0, 9), // Keep last 10
        ]);

        // Reset form
        setPhoneNumber('');
        setMessageBody('');
        setSelectedTemplate('custom');

        // Reload metrics
        loadMetrics();
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send SMS',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const checkMessageStatus = async (messageSid) => {
    try {
      const response = await fetch(`/api/sms/status/${messageSid}`);
      if (response.ok) {
        const data = await response.json();
        
        // Update message in list
        setSentMessages(sentMessages.map(msg =>
          msg.id === messageSid
            ? { ...msg, status: data.data.status, lastChecked: new Date().toISOString() }
            : msg
        ));
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const getCharacterCount = () => {
    const count = messageBody.length;
    const maxSingle = 160;
    const maxSegment = 153;
    
    if (count === 0) return { count: 0, segments: 0, remaining: maxSingle };
    
    if (count <= maxSingle) {
      return { count, segments: 1, remaining: maxSingle - count };
    }
    
    const segments = Math.ceil(count / maxSegment);
    const remaining = (segments * maxSegment) - count;
    
    return { count, segments, remaining };
  };

  const charCount = getCharacterCount();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">SMS Management</h1>
        <p className="text-gray-400">Send SMS notifications and track delivery status</p>
      </div>

      {/* Twilio Status Banner */}
      {metrics && !metrics.orange?.configured && (
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-500">Orange SMS Not Configured</h3>
              <p className="text-sm text-gray-300 mt-1">
                Set ORANGE_SMS_CLIENT_ID, ORANGE_SMS_CLIENT_SECRET, and ORANGE_SMS_SENDER_PHONE environment variables to enable SMS.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sent</p>
                <p className="text-2xl font-bold text-white mt-1">{metrics.metrics.sms.sent}</p>
              </div>
              <FaPaperPlane className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Delivered</p>
                <p className="text-2xl font-bold text-green-500 mt-1">{metrics.metrics.sms.delivered}</p>
              </div>
              <FaChartBar className="text-green-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{metrics.metrics.sms.failed}</p>
              </div>
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics.metrics.sms.sent > 0 
                    ? Math.round((metrics.metrics.sms.delivered / metrics.metrics.sms.sent) * 100)
                    : 0}%
                </p>
              </div>
              <FaChartBar className="text-blue-500 text-2xl" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send SMS Form */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Send SMS</h2>

          <form onSubmit={handleSendSMS} className="space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Object.entries(SMS_TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>{template.name}</option>
                ))}
              </select>
            </div>

            {/* SMS Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Object.entries(SMS_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number (E.164 format)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+12345678900"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-400 mt-1">Must include country code (e.g., +1 for US)</p>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Enter your message..."
                required
                rows={5}
                maxLength={1600}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-400">
                  {charCount.count} characters | {charCount.segments} segment(s)
                </span>
                <span className={charCount.remaining < 20 ? 'text-yellow-500' : 'text-gray-400'}>
                  {charCount.remaining} remaining
                </span>
              </div>
            </div>

            {/* Result Message */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
                <p className={result.success ? 'text-green-500' : 'text-red-500'}>
                  {result.message}
                </p>
                {result.success && result.data && (
                  <p className="text-xs text-gray-400 mt-1">
                    Message SID: {result.data.sid}
                  </p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={sending || !messageBody || !phoneNumber}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send SMS'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                disabled={!messageBody}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {showPreview ? 'Hide' : 'Preview'}
              </button>
            </div>

            {/* Preview */}
            {showPreview && messageBody && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2">Preview</p>
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm whitespace-pre-wrap">{messageBody}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Recent Messages */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Messages</h2>
            <FaHistory className="text-gray-400" />
          </div>

          <div className="space-y-3">
            {sentMessages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No messages sent yet</p>
            ) : (
              sentMessages.map((msg) => (
                <div key={msg.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{msg.phone}</p>
                      <p className="text-xs text-gray-400">{new Date(msg.sentAt).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      msg.status === 'delivered' ? 'bg-green-900/50 text-green-500' :
                      msg.status === 'failed' ? 'bg-red-900/50 text-red-500' :
                      'bg-yellow-900/50 text-yellow-500'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{msg.body}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Type: {SMS_TYPES[msg.type] || msg.type}
                    </span>
                    <button
                      onClick={() => checkMessageStatus(msg.id)}
                      className="text-xs text-blue-500 hover:text-blue-400"
                    >
                      Check Status
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
