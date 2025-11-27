import { Query } from 'node-appwrite';
import { createAdminClient } from '../appwrite/server';
import { appwriteConfig } from '../appwrite/config';
import { sendSMS, SMS_TYPES } from '../orange/sms';
import { createLogger, SMSEvent } from '../orange/logger';
import { incrementMetric } from '../orange/metrics';

const logger = createLogger({ service: 'subscription-expiry' });

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function calculateExpiryDate() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate;
}

function isExpiringInThreeDays(endDate) {
  const targetDate = calculateExpiryDate();
  const memberEndDate = new Date(endDate);
  memberEndDate.setHours(0, 0, 0, 0);
  
  return memberEndDate.getTime() === targetDate.getTime();
}

export async function checkExpiringSubscriptions() {
  logger.info(SMSEvent.SUBSCRIPTION_EXPIRY_CHECK, {
    checkDate: new Date().toISOString(),
  });

  incrementMetric('subscription', 'checks');

  try {
    const { databases } = createAdminClient();

    const targetDate = calculateExpiryDate();
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.membersCollectionId,
      [
        Query.greaterThanEqual('planEndDate', targetDateStr),
        Query.lessThan('planEndDate', new Date(targetDate.getTime() + 86400000).toISOString().split('T')[0]),
        Query.equal('status', 'active'),
      ]
    );

    const expiringMembers = response.documents.filter(member => 
      isExpiringInThreeDays(member.planEndDate)
    );

    logger.info(SMSEvent.SUBSCRIPTION_EXPIRY_FOUND, {
      count: expiringMembers.length,
      targetDate: formatDate(targetDate),
    });

    incrementMetric('subscription', 'found', expiringMembers.length);

    const results = [];

    for (const member of expiringMembers) {
      try {
        const message = `Your gym subscription is about to end on ${formatDate(member.planEndDate)}. Here are your details: ${member.fullName}, Plan: ${member.planName || 'Standard'}, Member ID: ${member.$id}.`;

        const result = await sendSMS({
          to: member.phone,
          body: message,
          type: SMS_TYPES.SUBSCRIPTION_EXPIRY,
          metadata: {
            memberId: member.$id,
            expiryDate: member.planEndDate,
          },
        });

        if (result.success) {
          logger.info(SMSEvent.SUBSCRIPTION_NOTIFICATION_SENT, {
            memberId: member.$id,
            memberName: member.fullName,
            expiryDate: formatDate(member.planEndDate),
            messageId: result.messageId,
          });

          incrementMetric('subscription', 'notifications');

          results.push({
            memberId: member.$id,
            success: true,
            messageId: result.messageId,
          });
        } else {
          logger.error(SMSEvent.SEND_FAILED, {
            memberId: member.$id,
            error: result.error,
          });

          incrementMetric('subscription', 'failed');

          results.push({
            memberId: member.$id,
            success: false,
            error: result.error,
          });
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.error(SMSEvent.SEND_FAILED, {
          memberId: member.$id,
          error: error.message,
        });

        incrementMetric('subscription', 'failed');

        results.push({
          memberId: member.$id,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      checked: response.documents.length,
      expiring: expiringMembers.length,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  } catch (error) {
    logger.error(SMSEvent.SUBSCRIPTION_EXPIRY_CHECK, {
      error: error.message,
      stack: error.stack,
    });

    incrementMetric('errors', 'api');

    return {
      success: false,
      error: error.message,
    };
  }
}
