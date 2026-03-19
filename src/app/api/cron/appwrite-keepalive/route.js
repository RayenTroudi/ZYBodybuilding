import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isCronSecretRequired() {
  return String(process.env.REQUIRE_CRON_SECRET || '').toLowerCase() === 'true';
}

function getAppwriteConfig() {
  const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_DATABASE_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  const missingVariables = [];

  if (!endpoint) {
    missingVariables.push('APPWRITE_ENDPOINT (or NEXT_PUBLIC_APPWRITE_ENDPOINT)');
  }

  if (!projectId) {
    missingVariables.push('APPWRITE_PROJECT_ID (or NEXT_PUBLIC_APPWRITE_PROJECT_ID)');
  }

  if (!databaseId) {
    missingVariables.push('APPWRITE_DATABASE_ID (or NEXT_PUBLIC_DATABASE_ID)');
  }

  if (!apiKey) {
    missingVariables.push('APPWRITE_API_KEY');
  }

  return {
    endpoint,
    projectId,
    databaseId,
    apiKey,
    missingVariables,
  };
}

async function parseResponseBody(response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

function unauthorizedResponse(message) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

function internalErrorResponse(message, details = {}) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...details,
    },
    { status: 500 }
  );
}

export async function GET(request) {
  try {
    if (isCronSecretRequired()) {
      const configuredCronSecret = process.env.CRON_SECRET;

      if (!configuredCronSecret) {
        return unauthorizedResponse('Unauthorized: CRON_SECRET must be set when REQUIRE_CRON_SECRET=true.');
      }

      const authorization = request.headers.get('authorization');

      if (authorization !== `Bearer ${configuredCronSecret}`) {
        return unauthorizedResponse('Unauthorized: missing or invalid bearer token.');
      }
    }

    const { endpoint, projectId, databaseId, apiKey, missingVariables } = getAppwriteConfig();

    if (missingVariables.length > 0) {
      return internalErrorResponse(
        `Missing required environment variables: ${missingVariables.join(', ')}`
      );
    }

    const baseEndpoint = endpoint.replace(/\/+$/, '');
    const healthUrl = `${baseEndpoint}/health`;
    const databaseUrl = `${baseEndpoint}/databases/${encodeURIComponent(databaseId)}`;

    const headers = {
      'X-Appwrite-Project': projectId,
      'X-Appwrite-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const healthResponse = await fetch(healthUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    const healthBody = await parseResponseBody(healthResponse);

    if (!healthResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Appwrite health check failed.',
          upstream: {
            health: {
              status: healthResponse.status,
              body: healthBody,
            },
          },
        },
        { status: 502 }
      );
    }

    const databaseResponse = await fetch(databaseUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    const databaseBody = await parseResponseBody(databaseResponse);

    if (!databaseResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Appwrite database check failed.',
          upstream: {
            database: {
              status: databaseResponse.status,
              body: databaseBody,
            },
          },
        },
        { status: 502 }
      );
    }

    const checkedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Appwrite keepalive checks passed.',
      checkedAt,
      healthStatus: healthBody?.status || 'ok',
      databaseId: databaseBody?.$id || databaseId,
      databaseName: databaseBody?.name || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unexpected error during Appwrite keepalive checks.',
      },
      { status: 500 }
    );
  }
}
