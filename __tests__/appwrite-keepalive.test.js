import { GET } from '../src/app/api/cron/appwrite-keepalive/route';

function createJsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('Appwrite keepalive endpoint', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();

    process.env = {
      ...originalEnv,
      REQUIRE_CRON_SECRET: 'false',
      APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
      APPWRITE_PROJECT_ID: 'project_123',
      APPWRITE_DATABASE_ID: 'database_123',
      APPWRITE_API_KEY: 'api_key_123',
      CRON_SECRET: '',
    };

    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('open mode allows request without Authorization and returns 200', async () => {
    global.fetch
      .mockResolvedValueOnce(createJsonResponse({ status: 'pass' }, 200))
      .mockResolvedValueOnce(
        createJsonResponse({ $id: 'database_123', name: 'Gym DB' }, 200)
      );

    const request = new Request('http://localhost:3000/api/cron/appwrite-keepalive');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.healthStatus).toBe('pass');
    expect(body.databaseId).toBe('database_123');
    expect(body.databaseName).toBe('Gym DB');
    expect(body.checkedAt).toBeTruthy();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'https://cloud.appwrite.io/v1/health',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'https://cloud.appwrite.io/v1/databases/database_123',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  test('protected mode returns 401 for missing token', async () => {
    process.env.REQUIRE_CRON_SECRET = 'true';
    process.env.CRON_SECRET = 'secret_123';

    const request = new Request('http://localhost:3000/api/cron/appwrite-keepalive');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Unauthorized/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('protected mode returns 401 when CRON_SECRET is not configured', async () => {
    process.env.REQUIRE_CRON_SECRET = 'true';
    process.env.CRON_SECRET = '';

    const request = new Request('http://localhost:3000/api/cron/appwrite-keepalive');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/CRON_SECRET/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('protected mode returns 401 for invalid token', async () => {
    process.env.REQUIRE_CRON_SECRET = 'true';
    process.env.CRON_SECRET = 'secret_123';

    const request = new Request('http://localhost:3000/api/cron/appwrite-keepalive', {
      headers: {
        Authorization: 'Bearer wrong_secret',
      },
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/missing or invalid bearer token/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('returns 500 with explicit message when required env variables are missing', async () => {
    process.env.APPWRITE_API_KEY = '';

    const request = new Request('http://localhost:3000/api/cron/appwrite-keepalive');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Missing required environment variables/i);
    expect(body.error).toMatch(/APPWRITE_API_KEY/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('returns 502 and upstream details when health check fails', async () => {
    global.fetch.mockResolvedValueOnce(
      createJsonResponse({ message: 'maintenance' }, 503)
    );

    const request = new Request('http://localhost:3000/api/cron/appwrite-keepalive');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/health check failed/i);
    expect(body.upstream.health.status).toBe(503);
    expect(body.upstream.health.body).toEqual({ message: 'maintenance' });
  });

  test('returns 502 and upstream details when database check fails', async () => {
    global.fetch
      .mockResolvedValueOnce(createJsonResponse({ status: 'pass' }, 200))
      .mockResolvedValueOnce(createJsonResponse({ message: 'forbidden' }, 403));

    const request = new Request('http://localhost:3000/api/cron/appwrite-keepalive');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/database check failed/i);
    expect(body.upstream.database.status).toBe(403);
    expect(body.upstream.database.body).toEqual({ message: 'forbidden' });
  });
});
