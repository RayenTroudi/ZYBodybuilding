/**
 * Rate Limiting for Email Sending
 */

import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query, ID } from 'node-appwrite';
import { emailConfig } from './config';

const RATE_LIMIT_COLLECTION_ID = 'email_rate_limits';

/**
 * Check if rate limit is exceeded
 */
export async function checkRateLimit(identifier) {
  try {
    const { databases: db } = createAdminClient();
    const now = new Date();
    
    // Check hourly limit
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const hourlyResult = await db.listDocuments(
      appwriteConfig.databaseId,
      RATE_LIMIT_COLLECTION_ID,
      [
        Query.equal('identifier', identifier),
        Query.greaterThanEqual('timestamp', oneHourAgo.toISOString()),
      ]
    );

    if (hourlyResult.total >= emailConfig.rateLimitPerHour) {
      return {
        allowed: false,
        reason: 'Hourly rate limit exceeded',
        limit: emailConfig.rateLimitPerHour,
        current: hourlyResult.total,
        resetAt: new Date(oneHourAgo.getTime() + 60 * 60 * 1000),
      };
    }

    // Check daily limit
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dailyResult = await db.listDocuments(
      appwriteConfig.databaseId,
      RATE_LIMIT_COLLECTION_ID,
      [
        Query.equal('identifier', identifier),
        Query.greaterThanEqual('timestamp', oneDayAgo.toISOString()),
      ]
    );

    if (dailyResult.total >= emailConfig.rateLimitPerDay) {
      return {
        allowed: false,
        reason: 'Daily rate limit exceeded',
        limit: emailConfig.rateLimitPerDay,
        current: dailyResult.total,
        resetAt: new Date(oneDayAgo.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    return {
      allowed: true,
      hourly: {
        limit: emailConfig.rateLimitPerHour,
        current: hourlyResult.total,
        remaining: emailConfig.rateLimitPerHour - hourlyResult.total,
      },
      daily: {
        limit: emailConfig.rateLimitPerDay,
        current: dailyResult.total,
        remaining: emailConfig.rateLimitPerDay - dailyResult.total,
      },
    };

  } catch (error) {
    // Allow if collection doesn't exist
    if (error.code === 404) {
      console.log('Email rate limit collection not found - allowing request');
    } else {
      console.error('Rate limit check failed:', error);
    }
    // Allow on error to prevent blocking legitimate requests
    return { allowed: true };
  }
}

/**
 * Record rate limit usage
 */
export async function recordRateLimitUsage(identifier) {
  try {
    const { databases: db } = createAdminClient();
    
    await db.createDocument(
      appwriteConfig.databaseId,
      RATE_LIMIT_COLLECTION_ID,
      ID.unique(),
      {
        identifier,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    // Silently skip if collection doesn't exist
    if (error.code === 404) {
      console.log('Email rate limit collection not found - skipping rate limit tracking');
    } else {
      console.error('Failed to record rate limit usage:', error);
    }
    // Don't throw - tracking failure shouldn't break email sending
  }
}
