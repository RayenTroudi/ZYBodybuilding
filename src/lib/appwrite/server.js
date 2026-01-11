import { Client, Account, Databases, Teams, Users, Storage } from 'node-appwrite';
import { appwriteConfig } from './config';

// Server-side Appwrite client with API key
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(process.env.APPWRITE_API_KEY);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    teams: new Teams(client),
    users: new Users(client),
    storage: new Storage(client),
  };
}

// Create a session client for user-specific operations
export function createSessionClient(sessionSecret) {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  if (sessionSecret) {
    // The session secret is the session ID that we can use
    client.setSession(sessionSecret);
  }

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    teams: new Teams(client),
  };
}
