/**
 * Seed script for migrating static programs to database
 * Run with: node scripts/seed-programs.js
 */

import { Client, Databases, ID } from 'node-appwrite';

// Load environment variables manually from .env.local
import { readFileSync } from 'fs';
const envConfig = {};
try {
  const envFile = readFileSync('.env.local', 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length) {
      envConfig[key.trim()] = value.join('=').trim();
    }
  });
} catch (error) {
  console.error('Error reading .env.local file');
}

// Configuration
const client = new Client()
  .setEndpoint(envConfig.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(envConfig.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(envConfig.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const databaseId = envConfig.NEXT_PUBLIC_DATABASE_ID || process.env.NEXT_PUBLIC_DATABASE_ID;
const programsCollectionId = envConfig.NEXT_PUBLIC_PROGRAMS_COLLECTION_ID || process.env.NEXT_PUBLIC_PROGRAMS_COLLECTION_ID;

// Static programs data from Programs.js
const staticPrograms = [
  {
    title: 'Strength Training',
    description: 'Build strength and stamina with progressive resistance training.',
    icon: '💪',
    color: '#CC1303',
    order: 1,
    features: JSON.stringify(['Progressive overload', 'Compound movements', 'Muscle development']),
    targetAudience: 'All levels',
    duration: '8-12 weeks',
    isActive: true
  },
  {
    title: 'Cardio Workouts',
    description: 'Boost your endurance and cardiovascular health.',
    icon: '🏃',
    color: '#2196F3',
    order: 2,
    features: JSON.stringify(['Heart health', 'Endurance building', 'Calorie burning']),
    targetAudience: 'All levels',
    duration: 'Ongoing',
    isActive: true
  },
  {
    title: 'Body Building',
    description: 'Achieve your dream physique with targeted muscle building.',
    icon: '🏋️',
    color: '#FFC107',
    order: 3,
    features: JSON.stringify(['Muscle mass', 'Symmetry', 'Definition']),
    targetAudience: 'Intermediate to Advanced',
    duration: '12+ weeks',
    isActive: true
  },
  {
    title: 'Weight Loss',
    description: 'Lose weight effectively with our comprehensive program.',
    icon: '⚖️',
    color: '#4CAF50',
    order: 4,
    features: JSON.stringify(['Fat loss', 'Metabolism boost', 'Nutrition guidance']),
    targetAudience: 'All levels',
    duration: '6-8 weeks',
    isActive: true
  }
];

async function seedPrograms() {
  console.log('🌱 Starting programs seed...\n');

  try {
    // Check if programs already exist
    const existing = await databases.listDocuments(databaseId, programsCollectionId);
    
    if (existing.documents.length > 0) {
      console.log(`⚠️  Found ${existing.documents.length} existing programs.`);
      console.log('Delete them first or skip seeding.\n');
      return;
    }

    // Seed programs
    for (const program of staticPrograms) {
      try {
        const created = await databases.createDocument(
          databaseId,
          programsCollectionId,
          ID.unique(),
          program
        );
        console.log(`✅ Created: ${created.title}`);
      } catch (error) {
        console.error(`❌ Failed to create "${program.title}":`, error.message);
      }
    }

    console.log('\n🎉 Programs seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seed
seedPrograms();
