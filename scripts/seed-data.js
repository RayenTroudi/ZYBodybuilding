import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('690ce00900173a1d9ac7')
  .setKey('standard_06281a25e8d6f2ea2dc4a5c0bfdb760ec27017f4297fd6753e8e46a5edc500c9009a5c1e8c213d8acc7c9a92faa5b5b086c0b6bf479f1c68bf3d3e959be292eaa339a011fd619220cb07fdf02c2cee9fac2059c33b19434ecc5f185018c7d071654cd1f944efddbe68f015cbe27b496f0e66defe8c4f79553956a3e924ebb6b4');

const databases = new Databases(client);

const DATABASE_ID = 'gym_management_db';
const MEMBERS_COLLECTION_ID = 'members';
const PAYMENTS_COLLECTION_ID = 'payments';
const PLANS_COLLECTION_ID = 'plans';

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Create Plans
    const plans = [
      {
        name: 'Monthly Plan',
        description: 'Access to all gym facilities for 1 month',
        duration: 30,
        price: 50.00,
        type: 'Monthly',
        isActive: true,
      },
      {
        name: '3-Month Plan',
        description: 'Access to all gym facilities for 3 months with 10% discount',
        duration: 90,
        price: 135.00,
        type: '3-Month',
        isActive: true,
      },
      {
        name: 'Yearly Plan',
        description: 'Access to all gym facilities for 1 year with 20% discount',
        duration: 365,
        price: 480.00,
        type: 'Yearly',
        isActive: true,
      },
    ];

    console.log('📋 Creating subscription plans...');
    const createdPlans = [];
    for (const plan of plans) {
      try {
        const created = await databases.createDocument(
          DATABASE_ID,
          PLANS_COLLECTION_ID,
          ID.unique(),
          plan
        );
        createdPlans.push(created);
        console.log(`✅ Created plan: ${plan.name}`);
      } catch (error) {
        console.log(`⚠️ Plan may already exist: ${plan.name}`);
      }
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create Members with varied histories
    const now = new Date();
    const members = [
      {
        memberId: 'MEM001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        planId: createdPlans[0].$id,
        planName: 'Monthly Plan',
        subscriptionStartDate: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(),
        subscriptionEndDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
        status: 'Active',
        totalPaid: 200.00,
        address: '123 Main St, City, State 12345',
        emergencyContact: 'Jane Smith: +1234567891',
      },
      {
        memberId: 'MEM002',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1234567892',
        planId: createdPlans[1].$id,
        planName: '3-Month Plan',
        subscriptionStartDate: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString(),
        subscriptionEndDate: new Date(now.getFullYear(), now.getMonth() + 2, 15).toISOString(),
        status: 'Active',
        totalPaid: 270.00,
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: 'Mike Johnson: +1234567893',
      },
      {
        memberId: 'MEM003',
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        phone: '+1234567894',
        planId: createdPlans[2].$id,
        planName: 'Yearly Plan',
        subscriptionStartDate: new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString(),
        subscriptionEndDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        status: 'Expired',
        totalPaid: 480.00,
        address: '789 Pine Rd, City, State 12345',
        emergencyContact: 'Lisa Brown: +1234567895',
      },
      {
        memberId: 'MEM004',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '+1234567896',
        planId: createdPlans[0].$id,
        planName: 'Monthly Plan',
        subscriptionStartDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        subscriptionEndDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
        status: 'Active',
        totalPaid: 50.00,
        address: '321 Elm St, City, State 12345',
        emergencyContact: 'Tom Davis: +1234567897',
      },
      {
        memberId: 'MEM005',
        name: 'David Wilson',
        email: 'david.w@example.com',
        phone: '+1234567898',
        planId: createdPlans[1].$id,
        planName: '3-Month Plan',
        subscriptionStartDate: new Date(now.getFullYear(), now.getMonth() - 2, 10).toISOString(),
        subscriptionEndDate: new Date(now.getFullYear(), now.getMonth() + 1, 10).toISOString(),
        status: 'Active',
        totalPaid: 135.00,
        address: '654 Maple Dr, City, State 12345',
        emergencyContact: 'Amy Wilson: +1234567899',
      },
    ];

    console.log('👥 Creating members...');
    const createdMembers = [];
    for (const member of members) {
      try {
        const created = await databases.createDocument(
          DATABASE_ID,
          MEMBERS_COLLECTION_ID,
          ID.unique(),
          member
        );
        createdMembers.push(created);
        console.log(`✅ Created member: ${member.name}`);
      } catch (error) {
        console.log(`⚠️ Member may already exist: ${member.name}`, error.message);
      }
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create Payment Records
    const payments = [
      // John Smith - 4 monthly payments
      {
        memberId: 'MEM001',
        memberName: 'John Smith',
        planId: createdPlans[0].$id,
        planName: 'Monthly Plan',
        amount: 50.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(),
        paymentMethod: 'Card',
        transactionId: 'TXN001',
        status: 'Completed',
        notes: 'Initial payment',
      },
      {
        memberId: 'MEM001',
        memberName: 'John Smith',
        planId: createdPlans[0].$id,
        planName: 'Monthly Plan',
        amount: 50.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
        paymentMethod: 'Card',
        transactionId: 'TXN002',
        status: 'Completed',
        notes: 'Renewal payment',
      },
      {
        memberId: 'MEM001',
        memberName: 'John Smith',
        planId: createdPlans[0].$id,
        planName: 'Monthly Plan',
        amount: 50.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        paymentMethod: 'Online',
        transactionId: 'TXN003',
        status: 'Completed',
        notes: 'Renewal payment',
      },
      {
        memberId: 'MEM001',
        memberName: 'John Smith',
        planId: createdPlans[0].$id,
        planName: 'Monthly Plan',
        amount: 50.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        paymentMethod: 'Cash',
        transactionId: 'TXN004',
        status: 'Completed',
        notes: 'Renewal payment',
      },
      // Sarah Johnson - 2 payments (3-month plans)
      {
        memberId: 'MEM002',
        memberName: 'Sarah Johnson',
        planId: createdPlans[1].$id,
        planName: '3-Month Plan',
        amount: 135.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 4, 15).toISOString(),
        paymentMethod: 'Card',
        transactionId: 'TXN005',
        status: 'Completed',
        notes: 'Initial payment',
      },
      {
        memberId: 'MEM002',
        memberName: 'Sarah Johnson',
        planId: createdPlans[1].$id,
        planName: '3-Month Plan',
        amount: 135.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString(),
        paymentMethod: 'Online',
        transactionId: 'TXN006',
        status: 'Completed',
        notes: 'Renewal payment',
      },
      // Michael Brown - Yearly payment
      {
        memberId: 'MEM003',
        memberName: 'Michael Brown',
        planId: createdPlans[2].$id,
        planName: 'Yearly Plan',
        amount: 480.00,
        paymentDate: new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString(),
        paymentMethod: 'Card',
        transactionId: 'TXN007',
        status: 'Completed',
        notes: 'Annual payment',
      },
      // Emily Davis - Recent payment
      {
        memberId: 'MEM004',
        memberName: 'Emily Davis',
        planId: createdPlans[0].$id,
        planName: 'Monthly Plan',
        amount: 50.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        paymentMethod: 'Cash',
        transactionId: 'TXN008',
        status: 'Completed',
        notes: 'Initial payment',
      },
      // David Wilson - 3-month payment
      {
        memberId: 'MEM005',
        memberName: 'David Wilson',
        planId: createdPlans[1].$id,
        planName: '3-Month Plan',
        amount: 135.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 2, 10).toISOString(),
        paymentMethod: 'Online',
        transactionId: 'TXN009',
        status: 'Completed',
        notes: 'Initial payment',
      },
    ];

    console.log('💳 Creating payment records...');
    for (const payment of payments) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          PAYMENTS_COLLECTION_ID,
          ID.unique(),
          payment
        );
        console.log(`✅ Created payment for: ${payment.memberName}`);
      } catch (error) {
        console.log(`⚠️ Payment may already exist for: ${payment.memberName}`);
      }
    }

    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Plans created: 3`);
    console.log(`   - Members created: 5`);
    console.log(`   - Payment records: 9`);
    console.log('\n✨ You can now use the admin panel!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedData();
