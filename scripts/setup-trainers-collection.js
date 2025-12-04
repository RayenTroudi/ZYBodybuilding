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

async function setupTrainersCollection() {
  try {
    const databaseId = envVars.NEXT_PUBLIC_DATABASE_ID;
    const collectionId = ID.unique();

    console.log('Creating trainers collection...');

    // Create collection
    await databases.createCollection(
      databaseId,
      collectionId,
      'trainers',
      [
        Permission.read(Role.any()),
        Permission.create(Role.team('admin_team')),
        Permission.update(Role.team('admin_team')),
        Permission.delete(Role.team('admin_team'))
      ]
    );

    console.log('Collection created successfully!');
    console.log('Creating attributes...');

    // Create attributes
    await databases.createStringAttribute(databaseId, collectionId, 'name', 100, true);
    await databases.createStringAttribute(databaseId, collectionId, 'email', 255, false);
    await databases.createStringAttribute(databaseId, collectionId, 'bio', 1000, false);
    await databases.createStringAttribute(databaseId, collectionId, 'specialty', 100, false);
    await databases.createStringAttribute(databaseId, collectionId, 'imageUrl', 2000, false);
    await databases.createStringAttribute(databaseId, collectionId, 'certifications', 1000, false);
    await databases.createIntegerAttribute(databaseId, collectionId, 'experienceYears', false);
    await databases.createBooleanAttribute(databaseId, collectionId, 'isActive', false, true);
    await databases.createIntegerAttribute(databaseId, collectionId, 'order', false);

    console.log('Attributes created successfully!');
    console.log('Waiting for attributes to be ready...');
    
    // Wait for attributes to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Creating indexes...');

    // Create indexes
    await databases.createIndex(
      databaseId,
      collectionId,
      'active_order',
      'key',
      ['isActive', 'order'],
      ['ASC', 'ASC']
    );

    await databases.createIndex(
      databaseId,
      collectionId,
      'active',
      'key',
      ['isActive'],
      ['ASC']
    );

    console.log('Indexes created successfully!');
    console.log('\n✅ Trainers collection setup complete!');
    console.log('\nCollection ID:', collectionId);
    console.log('\nAdd this to your .env.local file:');
    console.log(`NEXT_PUBLIC_TRAINERS_COLLECTION_ID=${collectionId}`);

  } catch (error) {
    console.error('Error setting up trainers collection:', error);
    throw error;
  }
}

setupTrainersCollection();
