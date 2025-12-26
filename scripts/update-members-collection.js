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

const DATABASE_ID = envVars.NEXT_PUBLIC_DATABASE_ID || 'gym_management_db';
const MEMBERS_COLLECTION_ID = envVars.NEXT_PUBLIC_MEMBERS_COLLECTION_ID || 'members';

async function updateMembersCollection() {
  try {
    console.log('🚀 Updating members collection for Excel import...');
    console.log(`📊 Database ID: ${DATABASE_ID}`);
    console.log(`📋 Collection ID: ${MEMBERS_COLLECTION_ID}`);

    // Get current collection attributes
    console.log('\n📖 Checking current collection structure...');
    const collection = await databases.getCollection(DATABASE_ID, MEMBERS_COLLECTION_ID);
    console.log('✅ Collection found:', collection.name);

    const existingAttributes = collection.attributes.map(attr => attr.key);
    console.log('📝 Existing attributes:', existingAttributes.join(', '));

    // Required attributes for Excel import
    const requiredAttributes = {
      'memberId': { type: 'string', size: 50, required: true },
      'name': { type: 'string', size: 100, required: true },
      'phone': { type: 'string', size: 20, required: true },
      'email': { type: 'email', required: false },
      'planId': { type: 'string', size: 50, required: true },
      'planName': { type: 'string', size: 100, required: true },
      'subscriptionStartDate': { type: 'datetime', required: true },
      'subscriptionEndDate': { type: 'datetime', required: true },
      'status': { type: 'string', size: 20, required: true },
      'totalPaid': { type: 'float', required: true },
      'address': { type: 'string', size: 500, required: false },
      'emergencyContact': { type: 'string', size: 100, required: false }
    };

    // Check for missing attributes
    const missingAttributes = Object.keys(requiredAttributes).filter(
      attr => !existingAttributes.includes(attr)
    );

    if (missingAttributes.length > 0) {
      console.log('\n⚠️  Missing attributes detected:', missingAttributes.join(', '));
      console.log('➕ Creating missing attributes...');

      for (const attrKey of missingAttributes) {
        const attr = requiredAttributes[attrKey];
        try {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              DATABASE_ID,
              MEMBERS_COLLECTION_ID,
              attrKey,
              attr.size,
              attr.required
            );
          } else if (attr.type === 'email') {
            await databases.createEmailAttribute(
              DATABASE_ID,
              MEMBERS_COLLECTION_ID,
              attrKey,
              attr.required
            );
          } else if (attr.type === 'datetime') {
            await databases.createDatetimeAttribute(
              DATABASE_ID,
              MEMBERS_COLLECTION_ID,
              attrKey,
              attr.required
            );
          } else if (attr.type === 'float') {
            await databases.createFloatAttribute(
              DATABASE_ID,
              MEMBERS_COLLECTION_ID,
              attrKey,
              attr.required,
              0
            );
          }
          console.log(`  ✅ Created attribute: ${attrKey}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.log(`  ⚠️  Could not create ${attrKey}: ${error.message}`);
        }
      }
    } else {
      console.log('✅ All required attributes exist');
    }

    // Check and create unique index on memberId
    console.log('\n🔍 Checking indexes...');
    const existingIndexes = collection.indexes.map(idx => idx.key);
    console.log('📝 Existing indexes:', existingIndexes.join(', '));

    if (!existingIndexes.includes('memberId_unique')) {
      console.log('➕ Creating unique index on memberId...');
      try {
        await databases.createIndex(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          'memberId_unique',
          'unique',
          ['memberId'],
          ['asc']
        );
        console.log('✅ Unique index created on memberId');
      } catch (error) {
        if (error.code === 409) {
          console.log('ℹ️  Index already exists');
        } else {
          console.log('⚠️  Could not create unique index:', error.message);
          console.log('💡 This is okay - duplicate checking will be done via query');
        }
      }
    } else {
      console.log('✅ Unique index already exists on memberId');
    }

    console.log('\n🎉 Members collection is ready for Excel import!');
    console.log('\n📋 Collection Structure:');
    console.log('  Required Attributes:');
    console.log('    - memberId (string, unique via index)');
    console.log('    - name (string)');
    console.log('    - phone (string)');
    console.log('    - planId (string)');
    console.log('    - planName (string)');
    console.log('    - subscriptionStartDate (datetime)');
    console.log('    - subscriptionEndDate (datetime)');
    console.log('    - status (string)');
    console.log('    - totalPaid (float)');
    console.log('  Optional Attributes:');
    console.log('    - email (email)');
    console.log('    - address (string)');
    console.log('    - emergencyContact (string)');
    console.log('\n💡 Excel columns map as follows:');
    console.log('    ID → memberId');
    console.log('    NAME → name');
    console.log('    PHONE → phone');
    console.log('    DURATION → planName');
    console.log('    AMOUNT → totalPaid');
    console.log('    START_DATE → subscriptionStartDate');
    console.log('    END_DATE → subscriptionEndDate');

  } catch (error) {
    console.error('❌ Update failed:', error.message);
    console.error('Full error:', error);
  }
}

updateMembersCollection();
