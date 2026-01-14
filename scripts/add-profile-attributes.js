import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('693189ff0019854c9a7a')
  .setKey('standard_427d0f2505dd03e956a552c110eb5eea4b8dfece917847e64dd71af5a3ab14565a578a91abcbebeb6a21b3296e405907ce1ced5677d1b5e9054f63644f9ef204a47cbef95a1da4d8cd6380214086dcf94faac4fa88f7cce3a0f24e22f0c88763ff8217c1d53a9ba3670019b7c6f38b16eb45a928916fee049df5ff3452cf6725');

const databases = new Databases(client);

const DATABASE_ID = 'gym_management_db';
const USER_PROFILES_COLLECTION_ID = 'user_profiles';

async function addMissingProfileAttributes() {
  try {
    console.log('🔧 Adding missing attributes to User Profiles collection...');

    const newAttributes = [
      { key: 'heightUnit', type: 'enum', elements: ['cm', 'ft'], required: false, default: 'cm' },
      { key: 'preferredWeightUnit', type: 'enum', elements: ['kg', 'lbs'], required: false, default: 'kg' },
    ];

    for (const attr of newAttributes) {
      try {
        if (attr.type === 'enum') {
          await databases.createEnumAttribute(
            DATABASE_ID,
            USER_PROFILES_COLLECTION_ID,
            attr.key,
            attr.elements,
            attr.required,
            attr.default
          );
          console.log(`✅ Created enum attribute: ${attr.key}`);
        }
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating ${attr.key}:`, error.message);
        }
      }
    }

    // Wait for attributes to be available
    console.log('⏳ Waiting for attributes to be available...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('✅ Done adding profile attributes!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

addMissingProfileAttributes();
