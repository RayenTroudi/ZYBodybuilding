import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('693189ff0019854c9a7a')
  .setKey('standard_427d0f2505dd03e956a552c110eb5eea4b8dfece917847e64dd71af5a3ab14565a578a91abcbebeb6a21b3296e405907ce1ced5677d1b5e9054f63644f9ef204a47cbef95a1da4d8cd6380214086dcf94faac4fa88f7cce3a0f24e22f0c88763ff8217c1d53a9ba3670019b7c6f38b16eb45a928916fee049df5ff3452cf6725');

const databases = new Databases(client);

const DATABASE_ID = 'gym_management_db';
const USERS_COLLECTION_ID = 'users';

async function setupUsersCollection() {
  try {
    const databaseId = DATABASE_ID;
    const collectionId = USERS_COLLECTION_ID;

    console.log('🔧 Setting up Users collection...');
    console.log('Database ID:', databaseId);
    console.log('Collection ID:', collectionId);

    // Create the users collection
    try {
      const collection = await databases.createCollection(
        databaseId,
        collectionId,
        'Users',
        [
          // Permissions - Admin can read, update, delete
          'read("any")',
          'create("any")',
          'update("any")',
          'delete("any")',
        ]
      );
      console.log('✅ Collection created:', collection.$id);
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Collection already exists');
      } else {
        throw error;
      }
    }

    // Create attributes
    console.log('📝 Creating attributes...');

    const attributes = [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'role', type: 'string', size: 50, required: false, default: 'user' },
      { key: 'createdAt', type: 'string', size: 255, required: true },
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            databaseId,
            collectionId,
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
          console.log(`✅ Created attribute: ${attr.key}`);
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
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create indexes
    console.log('🔍 Creating indexes...');

    const indexes = [
      { key: 'userId_index', type: 'key', attributes: ['userId'] },
      { key: 'email_index', type: 'key', attributes: ['email'] },
      { key: 'role_index', type: 'key', attributes: ['role'] },
    ];

    for (const index of indexes) {
      try {
        await databases.createIndex(
          databaseId,
          collectionId,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✅ Created index: ${index.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Index ${index.key} already exists`);
        } else {
          console.error(`❌ Error creating ${index.key}:`, error.message);
        }
      }
    }

    console.log('\n✅ Users collection setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Add NEXT_PUBLIC_USERS_COLLECTION_ID to your .env.local file');
    console.log(`   NEXT_PUBLIC_USERS_COLLECTION_ID=${collectionId}`);
    console.log('2. Users can now register at /register');
    console.log('3. Admins can manage users at /admin/users');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupUsersCollection();
