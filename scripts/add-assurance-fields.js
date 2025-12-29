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
const PAYMENTS_COLLECTION_ID = envVars.NEXT_PUBLIC_PAYMENTS_COLLECTION_ID || 'payments';

async function addAssuranceFields() {
  try {
    console.log('🚀 Adding assurance fields to collections...');
    console.log(`📊 Database ID: ${DATABASE_ID}`);

    // ========================================
    // Update Members Collection
    // ========================================
    console.log('\n📋 Updating Members Collection...');
    console.log(`   Collection ID: ${MEMBERS_COLLECTION_ID}`);

    try {
      const membersCollection = await databases.getCollection(DATABASE_ID, MEMBERS_COLLECTION_ID);
      const existingMemberAttrs = membersCollection.attributes.map(attr => attr.key);
      console.log('✅ Members collection found');
      console.log('📝 Existing attributes:', existingMemberAttrs.join(', '));

      // Add hasAssurance (boolean)
      if (!existingMemberAttrs.includes('hasAssurance')) {
        console.log('\n➕ Creating hasAssurance attribute...');
        await databases.createBooleanAttribute(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          'hasAssurance',
          false,
          false // default value
        );
        console.log('✅ hasAssurance attribute created (boolean, default: false)');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('ℹ️  hasAssurance attribute already exists');
      }

      // Add assuranceAmount (float)
      if (!existingMemberAttrs.includes('assuranceAmount')) {
        console.log('➕ Creating assuranceAmount attribute...');
        await databases.createFloatAttribute(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          'assuranceAmount',
          false,
          0 // default value
        );
        console.log('✅ assuranceAmount attribute created (float, default: 0)');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('ℹ️  assuranceAmount attribute already exists');
      }

      console.log('✅ Members collection updated successfully');
    } catch (error) {
      console.error('❌ Error updating Members collection:', error.message);
      throw error;
    }

    // ========================================
    // Update Payments Collection
    // ========================================
    console.log('\n📋 Updating Payments Collection...');
    console.log(`   Collection ID: ${PAYMENTS_COLLECTION_ID}`);

    try {
      const paymentsCollection = await databases.getCollection(DATABASE_ID, PAYMENTS_COLLECTION_ID);
      const existingPaymentAttrs = paymentsCollection.attributes.map(attr => attr.key);
      console.log('✅ Payments collection found');
      console.log('📝 Existing attributes:', existingPaymentAttrs.join(', '));

      // Add includesAssurance (boolean)
      if (!existingPaymentAttrs.includes('includesAssurance')) {
        console.log('\n➕ Creating includesAssurance attribute...');
        await databases.createBooleanAttribute(
          DATABASE_ID,
          PAYMENTS_COLLECTION_ID,
          'includesAssurance',
          false,
          false // default value
        );
        console.log('✅ includesAssurance attribute created (boolean, default: false)');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('ℹ️  includesAssurance attribute already exists');
      }

      // Add assuranceAmount (float)
      if (!existingPaymentAttrs.includes('assuranceAmount')) {
        console.log('➕ Creating assuranceAmount attribute...');
        await databases.createFloatAttribute(
          DATABASE_ID,
          PAYMENTS_COLLECTION_ID,
          'assuranceAmount',
          false,
          0 // default value
        );
        console.log('✅ assuranceAmount attribute created (float, default: 0)');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('ℹ️  assuranceAmount attribute already exists');
      }

      console.log('✅ Payments collection updated successfully');
    } catch (error) {
      console.error('❌ Error updating Payments collection:', error.message);
      throw error;
    }

    // ========================================
    // Summary
    // ========================================
    console.log('\n🎉 Assurance fields added successfully!');
    console.log('\n📊 Updated Collections:');
    console.log('\n1️⃣  Members Collection:');
    console.log('   ✅ hasAssurance (boolean) - Indicates if member has assurance');
    console.log('   ✅ assuranceAmount (float) - Amount paid for assurance (typically 20 DT)');
    console.log('\n2️⃣  Payments Collection:');
    console.log('   ✅ includesAssurance (boolean) - Indicates if this payment includes assurance');
    console.log('   ✅ assuranceAmount (float) - Assurance amount in this payment');
    console.log('\n💡 Usage:');
    console.log('   - When creating a member with assurance:');
    console.log('     • Set hasAssurance = true');
    console.log('     • Set assuranceAmount = 20');
    console.log('   - When creating a payment with assurance:');
    console.log('     • Set includesAssurance = true');
    console.log('     • Set assuranceAmount = 20');
    console.log('\n✨ Your database is now ready for assurance tracking!');

  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

addAssuranceFields();
