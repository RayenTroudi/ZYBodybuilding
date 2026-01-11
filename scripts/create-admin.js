import { Client, Users, Teams, ID } from 'node-appwrite';
import * as readline from 'readline/promises';
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
    console.log('\n🔗 You can now login at: http://localhost:3000/admin/ironcore/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

createAdminUser();
