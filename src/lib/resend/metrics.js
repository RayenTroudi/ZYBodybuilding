/**
 * Email Metrics Tracking
 * Uses in-memory storage since collection may not exist
 */

import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { ID, Query } from 'node-appwrite';

const METRICS_COLLECTION_ID = 'email_metrics';

// In-memory metrics storage (will reset on server restart)
const inMemoryMetrics = [];

/**
 * Record email metric in database
 */
export async function recordEmailMetric({
  to,
  type,
  status,
  messageId = null,
  error = null,
  duration = 0,
  metadata = {},
}) {
  // Store in memory
  const metric = {
    $id: ID.unique(),
    recipientEmail: to,
    emailType: type,
    status,
    messageId,
    error,
    duration,
    metadata: JSON.stringify(metadata),
    sentAt: new Date().toISOString(),
  };
  
  inMemoryMetrics.push(metric);
  
  // Keep only last 1000 metrics in memory
  if (inMemoryMetrics.length > 1000) {
    inMemoryMetrics.shift();
  }
  
  // Try to save to database (optional)
  try {
    const { databases: db } = createAdminClient();
    
    await db.createDocument(
      appwriteConfig.databaseId,
      METRICS_COLLECTION_ID,
      metric.$id,
      {
        recipientEmail: to,
        emailType: type,
        status,
        messageId,
        error,
        duration,
        metadata: JSON.stringify(metadata),
        sentAt: metric.sentAt,
      }
    );
  } catch (error) {
    // Silently skip database storage if collection doesn't exist
    if (error.code === 404) {
      console.log('Email metrics collection not found - using in-memory storage only');
    } else {
      console.error('Failed to record email metric to database:', error);
    }
    // Don't throw - metrics failure shouldn't break email sending
  }
}

/**
 * Get email metrics for a time period
 */
export async function getEmailMetrics(startDate, endDate) {
  // First, try to get from database
  try {
    const { databases: db } = createAdminClient();
    
    const result = await db.listDocuments(
      appwriteConfig.databaseId,
      METRICS_COLLECTION_ID,
      [
        Query.greaterThanEqual('sentAt', startDate.toISOString()),
        Query.lessThanEqual('sentAt', endDate.toISOString()),
        Query.orderDesc('sentAt'),
        Query.limit(1000),
      ]
    );

    return result.documents;
  } catch (error) {
    // Fall back to in-memory metrics
    if (error.code === 404) {
      console.log('Email metrics collection not found - using in-memory metrics');
    } else {
      console.error('Failed to fetch email metrics from database:', error);
    }
    
    // Filter in-memory metrics by date range
    return inMemoryMetrics.filter(metric => {
      const metricDate = new Date(metric.sentAt);
      return metricDate >= startDate && metricDate <= endDate;
    });
  }
}

/**
 * Get email statistics
 */
export async function getEmailStats(startDate, endDate) {
  try {
    const metrics = await getEmailMetrics(startDate, endDate);

    const stats = {
      total: metrics.length,
      sent: metrics.filter(m => m.status === 'sent').length,
      failed: metrics.filter(m => m.status === 'failed').length,
      byType: {},
      avgDuration: 0,
    };

    // Calculate by type
    metrics.forEach(metric => {
      if (!stats.byType[metric.emailType]) {
        stats.byType[metric.emailType] = {
          total: 0,
          sent: 0,
          failed: 0,
        };
      }
      stats.byType[metric.emailType].total++;
      if (metric.status === 'sent') {
        stats.byType[metric.emailType].sent++;
      } else {
        stats.byType[metric.emailType].failed++;
      }
    });

    // Calculate average duration
    const successfulEmails = metrics.filter(m => m.status === 'sent' && m.duration);
    if (successfulEmails.length > 0) {
      stats.avgDuration = successfulEmails.reduce((sum, m) => sum + m.duration, 0) / successfulEmails.length;
    }

    return stats;
  } catch (error) {
    console.error('Failed to calculate email stats:', error);
    return null;
  }
}
