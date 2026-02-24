import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
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

async function setupClassesCollection() {
  try {
    const databaseId = envVars.NEXT_PUBLIC_DATABASE_ID;
    const collectionId = ID.unique();

    console.log('Creating classes collection...');

    // Create collection
    await databases.createCollection(
      databaseId,
      collectionId,
      'classes',
      [
        Permission.read(Role.any()),
        Permission.create(Role.team('admin_team')),
        Permission.update(Role.team('admin_team')),
        Permission.delete(Role.team('admin_team'))
      ]
    );

    console.log('Collection created successfully!');
    console.log('Creating attributes...');

    // Create attributes - simplified schema
    await databases.createStringAttribute(databaseId, collectionId, 'title', 200, true);
    await databases.createStringAttribute(databaseId, collectionId, 'dayOfWeek', 20, true); // Lundi, Mardi, Mercredi, Jeudi, Vendredi
    await databases.createStringAttribute(databaseId, collectionId, 'startTime', 10, true); // HH:MM format
    await databases.createStringAttribute(databaseId, collectionId, 'endTime', 10, true); // HH:MM format
    await databases.createStringAttribute(databaseId, collectionId, 'trainerId', 255, false); // Relationship to trainer
    await databases.createStringAttribute(databaseId, collectionId, 'imageFileId', 255, false); // Optional class image

    console.log('Attributes created successfully!');
    console.log('Waiting for attributes to be ready...');
    
    // Wait for attributes to be ready
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Creating indexes...');

    // Create indexes
    await databases.createIndex(
      databaseId,
      collectionId,
      'day_start_time',
      'key',
      ['dayOfWeek', 'startTime'],
      ['ASC', 'ASC']
    );

    await databases.createIndex(
      databaseId,
      collectionId,
      'trainer_id',
      'key',
      ['trainerId'],
      ['ASC']
    );

    console.log('Indexes created successfully!');
    console.log('\n✅ Classes collection setup complete!');
    console.log('\nCollection ID:', collectionId);
    console.log('\nAdd this to your .env.local file:');
    console.log(`NEXT_PUBLIC_CLASSES_COLLECTION_ID=${collectionId}`);

  } catch (error) {
    console.error('Error setting up classes collection:', error);
    throw error;
  }
}

setupClassesCollection();
