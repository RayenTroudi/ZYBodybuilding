/**
 * Subscription Expiry Check
 * Checks for expiring memberships and sends email notifications
 */

import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';
import { sendMembershipExpiringEmail } from '@/lib/resend/email';
import { createLogger } from '@/lib/resend/logger';

const logger = createLogger({ module: 'subscription-expiry' });

/**
 * Check for expiring subscriptions and send notifications
 */
export async function checkExpiringSubscriptions() {
  const startTime = Date.now();
  
  logger.info('EXPIRY_CHECK_START', 'Starting expiring subscriptions check');

  try {
    const { databases: db } = createAdminClient();
    
    // Calculate date thresholds
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const fourDaysFromNow = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    
    // Find members expiring in exactly 3 days
    const expiringMembers = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      [
        Query.equal('status', 'active'),
        Query.lessThan('endDate', fourDaysFromNow.toISOString()),
        Query.greaterThanEqual('endDate', threeDaysFromNow.toISOString()),
        Query.limit(100),
      ]
    );

    logger.info('EXPIRY_CHECK_FOUND', `Found ${expiringMembers.documents.length} members with expiring subscriptions`);

    const results = {
      success: true,
      total: expiringMembers.documents.length,
      notified: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    for (const member of expiringMembers.documents) {
      try {
        // Calculate days remaining
        const endDate = new Date(member.endDate);
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        // Only send notification for 3 days before expiry
        if (daysRemaining !== 3) {
          results.skipped++;
          continue;
        }

        // Check if member has email
        if (!member.email) {
          logger.warn('MEMBER_NO_EMAIL', `Member ${member.$id} has no email address`, {
            memberId: member.$id,
            name: member.name,
          });
          results.skipped++;
          continue;
        }

        // Check if we already sent notification
        const lastNotificationKey = 'lastExpiryNotification_3days';
        const lastNotification = member[lastNotificationKey];
        
        if (lastNotification) {
          const lastNotificationDate = new Date(lastNotification);
          const hoursSinceLastNotification = (now - lastNotificationDate) / (1000 * 60 * 60);
          
          // Don't send if we already notified in the last 12 hours
          if (hoursSinceLastNotification < 12) {
            logger.info('NOTIFICATION_SKIPPED', `Already notified member recently`, {
              memberId: member.$id,
              daysRemaining,
              lastNotification,
            });
            results.skipped++;
            continue;
          }
        }

        // Send expiry notification email
        logger.info('SENDING_EXPIRY_EMAIL', `Sending expiry notification to ${member.email}`, {
          memberId: member.$id,
          name: member.name,
          daysRemaining,
        });

        await sendMembershipExpiringEmail(
          member.email,
          member.name,
          daysRemaining
        );

        // Update member record with notification timestamp
        await db.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.membersCollectionId,
          member.$id,
          {
            [lastNotificationKey]: now.toISOString(),
          }
        );

        results.notified++;

        logger.info('EXPIRY_EMAIL_SENT', `Expiry notification sent successfully`, {
          memberId: member.$id,
          email: member.email,
          daysRemaining,
        });

      } catch (error) {
        logger.error('EXPIRY_EMAIL_FAILED', `Failed to send expiry notification`, {
          memberId: member.$id,
          error: error.message,
        });

        results.failed++;
        results.errors.push({
          memberId: member.$id,
          email: member.email,
          error: error.message,
        });
      }
    }

    const duration = Date.now() - startTime;

    logger.info('EXPIRY_CHECK_COMPLETE', 'Subscription expiry check completed', {
      ...results,
      duration,
    });

    return {
      ...results,
      duration,
    };

  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error('EXPIRY_CHECK_ERROR', 'Subscription expiry check failed', {
      error: error.message,
      duration,
    });

    throw error;
  }
}
