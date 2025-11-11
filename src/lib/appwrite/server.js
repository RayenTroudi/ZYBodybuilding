import { Client, Account, Databases, Teams, Users } from 'node-appwrite';
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
  };
}

// Create a session client for user-specific operations
export function createSessionClient(session) {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  if (session) {
    client.setSession(session);
  }

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    teams: new Teams(client),
  };
}
