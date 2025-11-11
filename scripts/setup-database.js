import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('690ce00900173a1d9ac7')
  .setKey('standard_06281a25e8d6f2ea2dc4a5c0bfdb760ec27017f4297fd6753e8e46a5edc500c9009a5c1e8c213d8acc7c9a92faa5b5b086c0b6bf479f1c68bf3d3e959be292eaa339a011fd619220cb07fdf02c2cee9fac2059c33b19434ecc5f185018c7d071654cd1f944efddbe68f015cbe27b496f0e66defe8c4f79553956a3e924ebb6b4');

const databases = new Databases(client);

const DATABASE_ID = 'gym_management_db';
const MEMBERS_COLLECTION_ID = 'members';
const PAYMENTS_COLLECTION_ID = 'payments';
const PLANS_COLLECTION_ID = 'plans';

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');

    // Create Database
    try {
      const database = await databases.create(
        DATABASE_ID,
        'Gym Management Database'
      );
      console.log('✅ Database created:', database.name);
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ Database already exists');
      } else {
        throw error;
      }
    }

    // Create Plans Collection
    try {
      const plansCollection = await databases.createCollection(
        DATABASE_ID,
        PLANS_COLLECTION_ID,
        'Subscription Plans',
        [
          Permission.read(Role.any()),
          Permission.create(Role.team('admin_team')),
          Permission.update(Role.team('admin_team')),
          Permission.delete(Role.team('admin_team')),
        ]
      );
      console.log('✅ Plans collection created');

      // Add attributes for Plans
      await databases.createStringAttribute(DATABASE_ID, PLANS_COLLECTION_ID, 'name', 100, true);
      await databases.createStringAttribute(DATABASE_ID, PLANS_COLLECTION_ID, 'description', 500, false);
      await databases.createIntegerAttribute(DATABASE_ID, PLANS_COLLECTION_ID, 'duration', true); // in days
      await databases.createFloatAttribute(DATABASE_ID, PLANS_COLLECTION_ID, 'price', true);
      await databases.createStringAttribute(DATABASE_ID, PLANS_COLLECTION_ID, 'type', 50, true); // Monthly, 3-Month, Yearly
      await databases.createBooleanAttribute(DATABASE_ID, PLANS_COLLECTION_ID, 'isActive', true, true);
      
      console.log('✅ Plans attributes created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ Plans collection already exists');
      } else {
        console.error('❌ Error creating Plans collection:', error.message);
      }
    }

    // Wait a bit for attributes to be created
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create Members Collection
    try {
      const membersCollection = await databases.createCollection(
        DATABASE_ID,
        MEMBERS_COLLECTION_ID,
        'Gym Members',
        [
          Permission.read(Role.team('admin_team')),
          Permission.create(Role.team('admin_team')),
          Permission.update(Role.team('admin_team')),
          Permission.delete(Role.team('admin_team')),
        ]
      );
      console.log('✅ Members collection created');

      // Add attributes for Members
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'memberId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'name', 100, true);
      await databases.createEmailAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'email', true);
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'phone', 20, true);
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'planId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'planName', 100, true);
      await databases.createDatetimeAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'subscriptionStartDate', true);
      await databases.createDatetimeAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'subscriptionEndDate', true);
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'status', 20, true); // Active, Expired, Pending
      await databases.createFloatAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'totalPaid', true, 0);
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'address', 500, false);
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_COLLECTION_ID, 'emergencyContact', 100, false);
      
      console.log('✅ Members attributes created');

      // Create indexes
      await databases.createIndex(DATABASE_ID, MEMBERS_COLLECTION_ID, 'email_idx', 'key', ['email'], ['asc']);
      await databases.createIndex(DATABASE_ID, MEMBERS_COLLECTION_ID, 'memberId_idx', 'key', ['memberId'], ['asc']);
      await databases.createIndex(DATABASE_ID, MEMBERS_COLLECTION_ID, 'status_idx', 'key', ['status'], ['asc']);
      
      console.log('✅ Members indexes created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ Members collection already exists');
      } else {
        console.error('❌ Error creating Members collection:', error.message);
      }
    }

    // Wait a bit for attributes to be created
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create Payments Collection
    try {
      const paymentsCollection = await databases.createCollection(
        DATABASE_ID,
        PAYMENTS_COLLECTION_ID,
        'Payment Records',
        [
          Permission.read(Role.team('admin_team')),
          Permission.create(Role.team('admin_team')),
          Permission.update(Role.team('admin_team')),
          Permission.delete(Role.team('admin_team')),
        ]
      );
      console.log('✅ Payments collection created');

      // Add attributes for Payments
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'memberId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'memberName', 100, true);
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'planId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'planName', 100, true);
      await databases.createFloatAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'amount', true);
      await databases.createDatetimeAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'paymentDate', true);
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'paymentMethod', 50, false); // Cash, Card, Online
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'transactionId', 100, false);
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'status', 20, true); // Completed, Pending, Failed
      await databases.createStringAttribute(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'notes', 500, false);
      
      console.log('✅ Payments attributes created');

      // Create indexes
      await databases.createIndex(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'memberId_idx', 'key', ['memberId'], ['asc']);
      await databases.createIndex(DATABASE_ID, PAYMENTS_COLLECTION_ID, 'paymentDate_idx', 'key', ['paymentDate'], ['desc']);
      
      console.log('✅ Payments indexes created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ Payments collection already exists');
      } else {
        console.error('❌ Error creating Payments collection:', error.message);
      }
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Collection IDs:');
    console.log(`   - Database: ${DATABASE_ID}`);
    console.log(`   - Plans: ${PLANS_COLLECTION_ID}`);
    console.log(`   - Members: ${MEMBERS_COLLECTION_ID}`);
    console.log(`   - Payments: ${PAYMENTS_COLLECTION_ID}`);
    console.log('\n⚠️ Remember to update these IDs in your .env.local file if different!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupDatabase();
