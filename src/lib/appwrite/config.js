// Appwrite configuration constants
export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_DATABASE_ID,
  membersCollectionId: process.env.NEXT_PUBLIC_MEMBERS_COLLECTION_ID,
  paymentsCollectionId: process.env.NEXT_PUBLIC_PAYMENTS_COLLECTION_ID,
  plansCollectionId: process.env.NEXT_PUBLIC_PLANS_COLLECTION_ID,
  courseTypesCollectionId: process.env.NEXT_PUBLIC_COURSE_TYPES_COLLECTION_ID,
  coachesCollectionId: process.env.NEXT_PUBLIC_COACHES_COLLECTION_ID,
  scheduleSessionsCollectionId: process.env.NEXT_PUBLIC_SCHEDULE_SESSIONS_COLLECTION_ID,
  scheduleConfigCollectionId: process.env.NEXT_PUBLIC_SCHEDULE_CONFIG_COLLECTION_ID,
  programsCollectionId: process.env.NEXT_PUBLIC_PROGRAMS_COLLECTION_ID,
  trainersCollectionId: process.env.NEXT_PUBLIC_TRAINERS_COLLECTION_ID,
  classesCollectionId: process.env.NEXT_PUBLIC_CLASSES_COLLECTION_ID,
  trainerImagesBucketId: process.env.NEXT_PUBLIC_TRAINER_IMAGES_BUCKET_ID,
};

export const ADMIN_TEAM_ID = 'admin_team';
export const ADMIN_ROLE = 'admin';
