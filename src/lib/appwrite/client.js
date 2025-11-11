import { Client, Account, Databases, Teams } from 'appwrite';
import { appwriteConfig } from './config';

// Client-side Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

export default client;
