import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('690ce00900173a1d9ac7')
  .setKey('standard_06281a25e8d6f2ea2dc4a5c0bfdb760ec27017f4297fd6753e8e46a5edc500c9009a5c1e8c213d8acc7c9a92faa5b5b086c0b6bf479f1c68bf3d3e959be292eaa339a011fd619220cb07fdf02c2cee9fac2059c33b19434ecc5f185018c7d071654cd1f944efddbe68f015cbe27b496f0e66defe8c4f79553956a3e924ebb6b4');

const databases = new Databases(client);

const DATABASE_ID = 'gym_management_db';
const MEMBERS_COLLECTION_ID = 'members';

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
