import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('693189ff0019854c9a7a')
  .setKey('standard_427d0f2505dd03e956a552c110eb5eea4b8dfece917847e64dd71af5a3ab14565a578a91abcbebeb6a21b3296e405907ce1ced5677d1b5e9054f63644f9ef204a47cbef95a1da4d8cd6380214086dcf94faac4fa88f7cce3a0f24e22f0c88763ff8217c1d53a9ba3670019b7c6f38b16eb45a928916fee049df5ff3452cf6725');

const databases = new Databases(client);

const DATABASE_ID = 'gym_management_db';
const USERS_COLLECTION_ID = 'users';

async function makeAdmin(email) {
  try {
    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: npm run make-admin your-email@example.com');
      process.exit(1);
    }

    console.log(`🔍 Looking for user with email: ${email}`);
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('email', email)]
    );
    
    if (response.documents.length === 0) {
      console.error('❌ User not found with email:', email);
      console.log('\nMake sure:');
      console.log('1. The user has registered at /register');
      console.log('2. The email is correct');
      process.exit(1);
    }
    
    const user = response.documents[0];
    console.log('✅ User found:', user.name);
    console.log('Current role:', user.role || 'user');
    
    if (user.role === 'admin') {
      console.log('ℹ️  User is already an admin');
      process.exit(0);
    }
    
    await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.$id,
      { role: 'admin' }
    );
    
    console.log('\n✅ Success!');
    console.log(`👤 ${email} is now an admin`);
    console.log('\nYou can now:');
    console.log('1. Login at /admin/login');
    console.log('2. Access the admin panel');
    console.log('3. Manage users at /admin/users');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/make-admin.js <email>');
  console.log('Example: node scripts/make-admin.js user@example.com');
  process.exit(1);
}

makeAdmin(email);
