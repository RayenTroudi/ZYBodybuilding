import { orangeConfig, validateOrangeConfig, getOrangeFallback } from './config';

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    validateOrangeConfig();
    
    const credentials = Buffer.from(`${orangeConfig.clientId}:${orangeConfig.clientSecret}`).toString('base64');
    
    const response = await fetch(orangeConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
    
    return accessToken;
  } catch (error) {
    if (orangeConfig.isDevelopment) {
      console.warn('Orange SMS not configured. Using fallback mode.');
      return null;
    }
    throw error;
  }
}

export async function sendOrangeSMS(phoneNumber, message) {
  const token = await getAccessToken();
  
  if (!token) {
    if (orangeConfig.isDevelopment) {
      console.log(`[DEV] Would send SMS to ${phoneNumber}: ${message}`);
      return {
        success: true,
        messageId: `dev-${Date.now()}`,
        status: 'dev-mode',
      };
    }
    throw new Error('Orange SMS client not configured');
  }

  const payload = {
    outboundSMSMessageRequest: {
      address: `tel:${phoneNumber}`,
      senderAddress: `tel:${orangeConfig.senderPhone}`,
      senderName: orangeConfig.senderName || 'ZyBodyBuilding',
      outboundSMSTextMessage: {
        message: message,
      },
    },
  };

  const response = await fetch(`${orangeConfig.apiBaseUrl}/outbound/${encodeURIComponent(orangeConfig.senderPhone)}/requests`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Orange SMS API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  
  return {
    success: true,
    messageId: result.outboundSMSMessageRequest?.resourceURL?.split('/').pop() || `msg-${Date.now()}`,
    status: 'sent',
    response: result,
  };
}

export async function getOrangeStatus() {
  try {
    validateOrangeConfig();
    const token = await getAccessToken();
    return {
      configured: !!token,
      ready: !!token,
    };
  } catch (error) {
    return {
      configured: false,
      ready: false,
      error: error.message,
    };
  }
}

export function isOrangeConfigured() {
  return !!(orangeConfig.clientId && orangeConfig.clientSecret && orangeConfig.senderPhone);
}
