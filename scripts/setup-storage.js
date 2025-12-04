import { Client, Storage, Permission, Role } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const client = new Client()
  .setEndpoint(envVars.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(envVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(envVars.APPWRITE_API_KEY);

const storage = new Storage(client);

async function setupStorage() {
  try {
    console.log('🗄️ Setting up Appwrite Storage...\n');

    // Create bucket for trainer images
    const bucketId = 'trainer-images';
    
    try {
      const bucket = await storage.createBucket(
        bucketId,
        'Trainer Images',
        [
          Permission.read(Role.any()),
          Permission.create(Role.team('admin_team')),
          Permission.update(Role.team('admin_team')),
          Permission.delete(Role.team('admin_team')),
        ],
        false, // fileSecurity
        true,  // enabled
        undefined, // maximumFileSize (default 30MB)
        ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], // allowedFileExtensions
        undefined, // compression
        true,  // encryption
        true   // antivirus
      );

      console.log('✅ Storage bucket created successfully!');
      console.log(`   Bucket ID: ${bucket.$id}`);
      console.log(`   Bucket Name: ${bucket.name}`);
      console.log('\n📝 Add this to your .env.local file:');
      console.log(`NEXT_PUBLIC_TRAINER_IMAGES_BUCKET_ID=${bucketId}`);
      
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Storage bucket already exists');
        console.log(`   Bucket ID: ${bucketId}`);
        console.log('\n📝 Add this to your .env.local file if not already present:');
        console.log(`NEXT_PUBLIC_TRAINER_IMAGES_BUCKET_ID=${bucketId}`);
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Error setting up storage:', error.message);
    process.exit(1);
  }
}

setupStorage();
