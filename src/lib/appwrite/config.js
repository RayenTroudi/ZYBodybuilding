// Appwrite configuration constants
export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_DATABASE_ID,
  membersCollectionId: process.env.NEXT_PUBLIC_MEMBERS_COLLECTION_ID,
  paymentsCollectionId: process.env.NEXT_PUBLIC_PAYMENTS_COLLECTION_ID,
  plansCollectionId: process.env.NEXT_PUBLIC_PLANS_COLLECTION_ID,
};

export const ADMIN_TEAM_ID = 'admin_team';
export const ADMIN_ROLE = 'admin';
