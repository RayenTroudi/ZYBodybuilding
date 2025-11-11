import { Client, Users, Teams, ID } from 'node-appwrite';
import * as readline from 'readline/promises';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('690ce00900173a1d9ac7')
  .setKey('standard_06281a25e8d6f2ea2dc4a5c0bfdb760ec27017f4297fd6753e8e46a5edc500c9009a5c1e8c213d8acc7c9a92faa5b5b086c0b6bf479f1c68bf3d3e959be292eaa339a011fd619220cb07fdf02c2cee9fac2059c33b19434ecc5f185018c7d071654cd1f944efddbe68f015cbe27b496f0e66defe8c4f79553956a3e924ebb6b4');

const users = new Users(client);
const teams = new Teams(client);

const ADMIN_TEAM_ID = 'admin_team';

async function createAdminUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log('🔐 Admin User Creation Script\n');

    const name = await rl.question('Enter admin name: ');
    const email = await rl.question('Enter admin email: ');
    const password = await rl.question('Enter admin password (min 8 chars): ');

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    console.log('\n📝 Creating admin user...');

    // Create user
    const user = await users.create(
      ID.unique(),
      email,
      undefined, // phone
      password,
      name
    );

    console.log('✅ User created:', user.name);

    // Create or get admin team
    let team;
    try {
      team = await teams.get(ADMIN_TEAM_ID);
      console.log('ℹ️ Admin team already exists');
    } catch (error) {
      if (error.code === 404) {
        team = await teams.create(ADMIN_TEAM_ID, 'Administrators');
        console.log('✅ Admin team created');
      } else {
        throw error;
      }
    }

    // Add user to admin team
    try {
      await teams.createMembership(
        ADMIN_TEAM_ID,
        ['admin'],
        email
      );
      console.log('✅ User added to admin team');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ User already in admin team');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Admin user setup completed!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 You can now login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

createAdminUser();
