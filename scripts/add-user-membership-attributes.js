import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('693189ff0019854c9a7a')
  .setKey('standard_427d0f2505dd03e956a552c110eb5eea4b8dfece917847e64dd71af5a3ab14565a578a91abcbebeb6a21b3296e405907ce1ced5677d1b5e9054f63644f9ef204a47cbef95a1da4d8cd6380214086dcf94faac4fa88f7cce3a0f24e22f0c88763ff8217c1d53a9ba3670019b7c6f38b16eb45a928916fee049df5ff3452cf6725');

const databases = new Databases(client);

const DATABASE_ID = 'gym_management_db';
const USERS_COLLECTION_ID = 'users';

async function addMembershipAttributes() {
  try {
    console.log('🔧 Adding membership-related attributes to Users collection...');

    // New attributes needed for membership flow
    const newAttributes = [
      { key: 'memberId', type: 'string', size: 50, required: false },
      { key: 'requiresPasswordReset', type: 'boolean', required: false, default: false },
      { key: 'createdByAdmin', type: 'boolean', required: false, default: false },
      { key: 'passwordResetCompletedAt', type: 'string', size: 255, required: false },
    ];

    for (const attr of newAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
          console.log(`✅ Created string attribute: ${attr.key}`);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            attr.key,
            attr.required,
            attr.default
          );
          console.log(`✅ Created boolean attribute: ${attr.key}`);
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

    // Create index for memberId
    try {
      await databases.createIndex(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        'memberId_index',
        'key',
        ['memberId']
      );
      console.log('✅ Created index: memberId_index');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Index memberId_index already exists');
      } else {
        console.error('❌ Error creating index:', error.message);
      }
    }

    console.log('✅ Done adding membership attributes!');
    console.log('');
    console.log('You can now create new members with user accounts.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

addMembershipAttributes();
