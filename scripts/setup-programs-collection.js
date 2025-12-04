/**
 * Setup script to create the Programs collection in Appwrite
 * Run with: node scripts/setup-programs-collection.js
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

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

async function createProgramsCollection() {
  console.log('🚀 Starting Programs collection setup...\n');

  try {
    // Step 1: Create Collection
    console.log('📦 Creating collection...');
    const collection = await databases.createCollection(
      databaseId,
      ID.unique(),
      'programs',
      [
        Permission.read(Role.any()),
        Permission.create(Role.team('admin_team')),
        Permission.update(Role.team('admin_team')),
        Permission.delete(Role.team('admin_team'))
      ]
    );
    
    const collectionId = collection.$id;
    console.log(`✅ Collection created with ID: ${collectionId}\n`);

    // Step 2: Create Attributes
    console.log('📝 Creating attributes...');

    await databases.createStringAttribute(databaseId, collectionId, 'title', 100, true);
    console.log('  ✅ title');

    await databases.createStringAttribute(databaseId, collectionId, 'description', 500, true);
    console.log('  ✅ description');

    await databases.createStringAttribute(databaseId, collectionId, 'icon', 10, false, '🏋️');
    console.log('  ✅ icon');

    await databases.createStringAttribute(databaseId, collectionId, 'imageUrl', 2000, false);
    console.log('  ✅ imageUrl');

    await databases.createStringAttribute(databaseId, collectionId, 'color', 20, false, '#CC1303');
    console.log('  ✅ color');

    await databases.createIntegerAttribute(databaseId, collectionId, 'order', false, 0);
    console.log('  ✅ order');

    await databases.createStringAttribute(databaseId, collectionId, 'features', 2000, false);
    console.log('  ✅ features');

    await databases.createStringAttribute(databaseId, collectionId, 'targetAudience', 200, false);
    console.log('  ✅ targetAudience');

    await databases.createStringAttribute(databaseId, collectionId, 'duration', 100, false);
    console.log('  ✅ duration');

    await databases.createBooleanAttribute(databaseId, collectionId, 'isActive', false, true);
    console.log('  ✅ isActive\n');

    // Wait for attributes to be ready
    console.log('⏳ Waiting for attributes to be available...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Create Indexes
    console.log('\n🔍 Creating indexes...');

    await databases.createIndex(
      databaseId,
      collectionId,
      'order_active',
      'key',
      ['order', 'isActive'],
      ['ASC', 'ASC']
    );
    console.log('  ✅ order_active index');

    await databases.createIndex(
      databaseId,
      collectionId,
      'active',
      'key',
      ['isActive'],
      ['ASC']
    );
    console.log('  ✅ active index\n');

    // Step 4: Display environment variable
    console.log('🎉 Programs collection setup completed!\n');
    console.log('📋 Add this to your .env.local file:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`NEXT_PUBLIC_PROGRAMS_COLLECTION_ID=${collectionId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Next steps:');
    console.log('1. Add the environment variable above to .env.local');
    console.log('2. Restart your development server');
    console.log('3. Run: node scripts/seed-programs.js');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.code === 409) {
      console.log('\n💡 Collection might already exist. Check your Appwrite console.');
    }
    process.exit(1);
  }
}

// Run the setup
createProgramsCollection();
