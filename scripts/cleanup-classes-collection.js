import { Client, Databases } from 'node-appwrite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file
const envPath = join(__dirname, '..', '.env.local');
const envFile = readFileSync(envPath, 'utf-8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const client = new Client()
  .setEndpoint(envVars.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(envVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(envVars.APPWRITE_API_KEY);

const databases = new Databases(client);

async function cleanupClassesCollection() {
  try {
    const databaseId = envVars.NEXT_PUBLIC_DATABASE_ID;
    const collectionId = envVars.NEXT_PUBLIC_CLASSES_COLLECTION_ID;

    console.log('Cleaning up classes collection...');
    console.log('Removing unnecessary attributes...\n');

    const attributesToDelete = [
      'description',
      'difficulty',
      'category',
      'caloriesBurn',
      'duration',
      'availableSpots',
      'bookedSpots',
      'color',
      'icon',
      'isActive',
      'order'
    ];

    for (const attr of attributesToDelete) {
      try {
        console.log(`Deleting attribute: ${attr}...`);
        await databases.deleteAttribute(databaseId, collectionId, attr);
        console.log(`✅ Deleted: ${attr}`);
        // Wait a bit between deletions to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`⚠️  Could not delete ${attr}: ${error.message}`);
      }
    }

    console.log('\n⏳ Waiting for cleanup to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Add imageFileId attribute if it doesn't exist
    try {
      console.log('\nAdding imageFileId attribute...');
      await databases.createStringAttribute(databaseId, collectionId, 'imageFileId', 255, false);
      console.log('✅ Added imageFileId attribute');
    } catch (error) {
      console.log(`⚠️  Could not add imageFileId: ${error.message}`);
    }

    console.log('\n⏳ Waiting for new attribute to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Update indexes - remove old ones and create new ones
    console.log('\nCleaning up indexes...');
    
    const indexesToDelete = ['day_time', 'active_category', 'trainer'];
    
    for (const indexName of indexesToDelete) {
      try {
        console.log(`Deleting index: ${indexName}...`);
        await databases.deleteIndex(databaseId, collectionId, indexName);
        console.log(`✅ Deleted index: ${indexName}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`⚠️  Could not delete index ${indexName}: ${error.message}`);
      }
    }

    console.log('\n⏳ Waiting before creating new indexes...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create new simplified indexes
    try {
      console.log('\nCreating new index for dayOfWeek and startTime...');
      await databases.createIndex(
        databaseId,
        collectionId,
        'day_start_time',
        'key',
        ['dayOfWeek', 'startTime'],
        ['ASC', 'ASC']
      );
      console.log('✅ Created day_start_time index');
    } catch (error) {
      console.log(`⚠️  Could not create index: ${error.message}`);
    }

    try {
      console.log('Creating trainer index...');
      await databases.createIndex(
        databaseId,
        collectionId,
        'trainer_id',
        'key',
        ['trainerId'],
        ['ASC']
      );
      console.log('✅ Created trainer_id index');
    } catch (error) {
      console.log(`⚠️  Could not create trainer index: ${error.message}`);
    }

    console.log('\n✅ Classes collection cleanup complete!');
    console.log('\nRemaining fields:');
    console.log('  - title (required)');
    console.log('  - dayOfWeek (required)');
    console.log('  - startTime (required)');
    console.log('  - endTime (required)');
    console.log('  - trainerId (optional)');
    console.log('  - imageFileId (optional)');

  } catch (error) {
    console.error('\n❌ Error cleaning up classes collection:', error);
    throw error;
  }
}

console.log('🚀 Starting classes collection cleanup...\n');
cleanupClassesCollection();
