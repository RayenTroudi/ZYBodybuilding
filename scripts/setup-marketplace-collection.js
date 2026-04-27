import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
const envFile = readFileSync(envPath, 'utf-8');
const envVars = {};
envFile.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
  }
});

const client = new Client()
  .setEndpoint(envVars.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(envVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(envVars.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Appwrite requires a small delay between attribute creation calls
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function setupMarketplaceCollection() {
  const databaseId = envVars.NEXT_PUBLIC_DATABASE_ID;
  const collectionId = envVars.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID || 'marketplace_products';
  const bucketId = envVars.NEXT_PUBLIC_PRODUCT_IMAGES_BUCKET_ID || 'product-images';

  console.log('\n── Marketplace Collection Setup ──\n');

  // ── 1. Storage bucket ──
  try {
    await storage.createBucket(
      bucketId,
      'Product Images',
      [
        Permission.read(Role.any()),
        Permission.create(Role.team('admin_team')),
        Permission.update(Role.team('admin_team')),
        Permission.delete(Role.team('admin_team')),
      ],
      false,    // fileSecurity
      true,     // enabled
      10 * 1024 * 1024, // maxFileSize: 10 MB
      ['jpg', 'jpeg', 'png', 'webp', 'gif']
    );
    console.log(`✅ Storage bucket created: ${bucketId}`);
  } catch (err) {
    if (err.message?.includes('already exists')) {
      console.log(`ℹ️  Storage bucket already exists: ${bucketId}`);
    } else {
      console.error('❌ Failed to create storage bucket:', err.message);
    }
  }

  // ── 2. Collection ──
  try {
    await databases.createCollection(
      databaseId,
      collectionId,
      'marketplace_products',
      [
        Permission.read(Role.any()),
        Permission.create(Role.team('admin_team')),
        Permission.update(Role.team('admin_team')),
        Permission.delete(Role.team('admin_team')),
      ]
    );
    console.log(`✅ Collection created: ${collectionId}`);
  } catch (err) {
    if (err.message?.includes('already exists')) {
      console.log(`ℹ️  Collection already exists: ${collectionId}`);
    } else {
      console.error('❌ Failed to create collection:', err.message);
      throw err;
    }
  }

  console.log('\nCreating attributes...\n');

  const attrs = [
    () => databases.createStringAttribute(databaseId, collectionId, 'name_en', 200, true),
    () => databases.createStringAttribute(databaseId, collectionId, 'name_fr', 200, true),
    () => databases.createStringAttribute(databaseId, collectionId, 'description_en', 2000, false),
    () => databases.createStringAttribute(databaseId, collectionId, 'description_fr', 2000, false),
    () => databases.createFloatAttribute(databaseId, collectionId, 'price', true, 0),
    () => databases.createStringAttribute(databaseId, collectionId, 'category', 50, true),
    () => databases.createStringAttribute(databaseId, collectionId, 'imageIds', 100, false, undefined, true),
    () => databases.createBooleanAttribute(databaseId, collectionId, 'inStock', false, true),
    () => databases.createBooleanAttribute(databaseId, collectionId, 'isActive', false, true),
    () => databases.createBooleanAttribute(databaseId, collectionId, 'featured', false, false),
  ];

  for (const create of attrs) {
    try {
      await create();
      await delay(500);
      process.stdout.write('.');
    } catch (err) {
      if (err.message?.includes('already exists')) {
        process.stdout.write('s');
      } else {
        process.stdout.write('!');
        console.error('\n  ⚠ ', err.message);
      }
    }
  }

  console.log('\n\n✅ Attributes done.\n');

  // ── 3. Index on isActive + category for fast filtering ──
  try {
    await databases.createIndex(
      databaseId,
      collectionId,
      'idx_active_category',
      'key',
      ['isActive', 'category'],
      ['ASC', 'ASC']
    );
    console.log('✅ Index created: idx_active_category');
  } catch (err) {
    if (err.message?.includes('already exists')) {
      console.log('ℹ️  Index already exists');
    } else {
      console.error('⚠  Index error (non-fatal):', err.message);
    }
  }

  console.log('\n── Setup complete ──');
  console.log(`\nAdd these to your .env.local if not already set:`);
  console.log(`NEXT_PUBLIC_PRODUCTS_COLLECTION_ID=${collectionId}`);
  console.log(`NEXT_PUBLIC_PRODUCT_IMAGES_BUCKET_ID=${bucketId}`);
  console.log();
}

setupMarketplaceCollection().catch((err) => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
