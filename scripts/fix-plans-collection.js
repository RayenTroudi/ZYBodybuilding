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

async function fixPlansCollection() {
  try {
    console.log('🔧 Adding isActive attribute to plans collection...');

    await databases.createBooleanAttribute(
      envVars.NEXT_PUBLIC_DATABASE_ID,
      envVars.NEXT_PUBLIC_PLANS_COLLECTION_ID,
      'isActive',
      false,
      true
    );

    console.log('✅ isActive attribute added successfully!');
    console.log('⏳ Waiting for attribute to be available...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Plans collection is now ready!');
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️ isActive attribute already exists');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

fixPlansCollection();
