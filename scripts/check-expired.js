import { Client, Databases, Query } from 'node-appwrite';
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

const DATABASE_ID = envVars.NEXT_PUBLIC_DATABASE_ID;
const MEMBERS_COLLECTION_ID = envVars.NEXT_PUBLIC_MEMBERS_COLLECTION_ID;

async function checkExpiredSubscriptions() {
  try {
    console.log('🔍 Checking for expired subscriptions...\n');

    // Get all active members
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_COLLECTION_ID,
      [Query.equal('status', 'Active'), Query.limit(500)]
    );

    const now = new Date();
    let expiredCount = 0;
    const expiredMembers = [];

    for (const member of members.documents) {
      const endDate = new Date(member.subscriptionEndDate);
      
      if (endDate < now) {
        // Update member status to Expired
        await databases.updateDocument(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          member.$id,
          { status: 'Expired' }
        );

        expiredMembers.push({
          name: member.name,
          email: member.email,
          endDate: endDate.toLocaleDateString(),
        });

        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      console.log(`✅ Updated ${expiredCount} expired memberships:\n`);
      expiredMembers.forEach(member => {
        console.log(`   - ${member.name} (${member.email}) - Expired on ${member.endDate}`);
      });
    } else {
      console.log('✨ No expired memberships found!');
    }

    // Check for memberships expiring soon
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSoon = members.documents.filter(member => {
      const endDate = new Date(member.subscriptionEndDate);
      return endDate > now && endDate <= sevenDaysFromNow;
    });

    if (expiringSoon.length > 0) {
      console.log(`\n⚠️ ${expiringSoon.length} memberships expiring within 7 days:\n`);
      expiringSoon.forEach(member => {
        const daysLeft = Math.ceil((new Date(member.subscriptionEndDate) - now) / (1000 * 60 * 60 * 24));
        console.log(`   - ${member.name} (${member.email}) - ${daysLeft} days left`);
      });
    }

    console.log('\n📊 Summary:');
    console.log(`   Total Active Members: ${members.documents.filter(m => new Date(m.subscriptionEndDate) >= now).length}`);
    console.log(`   Expired Today: ${expiredCount}`);
    console.log(`   Expiring Soon: ${expiringSoon.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkExpiredSubscriptions();
