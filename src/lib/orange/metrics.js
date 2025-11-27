const metricsStore = new Map();

function getMetricKey(category, name) {
  return `${category}:${name}`;
}

export function incrementMetric(category, name, value = 1) {
  const key = getMetricKey(category, name);
  const current = metricsStore.get(key) || 0;
  metricsStore.set(key, current + value);
}

export function getMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    sms: {
      sent: metricsStore.get('sms:sent') || 0,
      delivered: metricsStore.get('sms:delivered') || 0,
      failed: metricsStore.get('sms:failed') || 0,
    },
    subscriptionExpiry: {
      checksRun: metricsStore.get('subscription:checks') || 0,
      clientsFound: metricsStore.get('subscription:found') || 0,
      notificationsSent: metricsStore.get('subscription:notifications') || 0,
      notificationsFailed: metricsStore.get('subscription:failed') || 0,
    },
    rateLimit: {
      ipBlocked: metricsStore.get('rateLimit:ip') || 0,
      phoneBlocked: metricsStore.get('rateLimit:phone') || 0,
    },
    errors: {
      validation: metricsStore.get('errors:validation') || 0,
      api: metricsStore.get('errors:api') || 0,
      network: metricsStore.get('errors:network') || 0,
    },
  };

  return metrics;
}

export function resetMetrics() {
  metricsStore.clear();
}
