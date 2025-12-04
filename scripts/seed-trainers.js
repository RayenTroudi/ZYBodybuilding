import { Client, Databases, ID } from 'node-appwrite';
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

const trainers = [
  {
    name: 'Sophie Martin',
    email: 'sophie.martin@gym.com',
    bio: 'Passionnée de fitness depuis 10 ans, Sophie excelle dans les programmes de cardio et de perte de poids.',
    specialty: 'Cardio & Perte de Poids',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    certifications: 'Certifiée ISSA, Nutrition Sportive',
    experienceYears: 10,
    isActive: true,
    order: 1
  },
  {
    name: 'Marc Dubois',
    email: 'marc.dubois@gym.com',
    bio: 'Expert en musculation et bodybuilding, Marc aide ses clients à atteindre leurs objectifs de force.',
    specialty: 'Musculation & Force',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    certifications: 'Personal Trainer NASM, Bodybuilding Coach',
    experienceYears: 12,
    isActive: true,
    order: 2
  },
  {
    name: 'Emma Laurent',
    email: 'emma.laurent@gym.com',
    bio: 'Spécialiste du yoga et du stretching, Emma apporte équilibre et flexibilité à vos entraînements.',
    specialty: 'Yoga & Stretching',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    certifications: 'Yoga Alliance RYT 500, Pilates',
    experienceYears: 8,
    isActive: true,
    order: 3
  },
  {
    name: 'Thomas Rousseau',
    email: 'thomas.rousseau@gym.com',
    bio: 'Coach en HIIT et CrossFit, Thomas crée des programmes intensifs pour maximiser vos performances.',
    specialty: 'HIIT & CrossFit',
    imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    certifications: 'CrossFit Level 2, HIIT Specialist',
    experienceYears: 7,
    isActive: true,
    order: 4
  },
  {
    name: 'Julie Bernard',
    email: 'julie.bernard@gym.com',
    bio: 'Experte en fitness fonctionnel et rééducation, Julie adapte les exercices à chaque personne.',
    specialty: 'Fitness Fonctionnel',
    imageUrl: 'https://randomuser.me/api/portraits/women/21.jpg',
    certifications: 'Functional Training, Kinésiologie',
    experienceYears: 9,
    isActive: true,
    order: 5
  }
];

async function seedTrainers() {
  try {
    const databaseId = envVars.NEXT_PUBLIC_DATABASE_ID;
    const collectionId = envVars.NEXT_PUBLIC_TRAINERS_COLLECTION_ID;

    console.log('Starting trainers seed...\n');

    for (const trainer of trainers) {
      const created = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        trainer
      );
      console.log(`✅ Created trainer: ${created.name}`);
    }

    console.log(`\n✅ Successfully seeded ${trainers.length} trainers!`);
  } catch (error) {
    console.error('Error seeding trainers:', error);
    throw error;
  }
}

seedTrainers();
