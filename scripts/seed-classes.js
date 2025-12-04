import { Client, Databases, ID, Query } from 'node-appwrite';
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

async function seedClasses() {
  try {
    const databaseId = envVars.NEXT_PUBLIC_DATABASE_ID;
    const trainersCollectionId = envVars.NEXT_PUBLIC_TRAINERS_COLLECTION_ID;
    const classesCollectionId = envVars.NEXT_PUBLIC_CLASSES_COLLECTION_ID;

    console.log('Fetching trainers...\n');

    // Get all trainers
    const trainers = await databases.listDocuments(
      databaseId,
      trainersCollectionId
    );

    if (trainers.documents.length === 0) {
      console.error('No trainers found! Please run seed-trainers.js first.');
      return;
    }

    // Create a map of trainers by name for easy reference
    const trainerMap = {};
    trainers.documents.forEach(trainer => {
      trainerMap[trainer.name] = trainer.$id;
    });

    console.log(`Found ${trainers.documents.length} trainers\n`);

    const classes = [
      // Lundi
      {
        title: 'Cardio Matinal',
        description: 'Commencez la semaine avec une séance cardio énergisante pour brûler des calories.',
        dayOfWeek: 'Lundi',
        startTime: '07:00',
        endTime: '08:00',
        trainerId: trainerMap['Sophie Martin'],
        difficulty: 'Intermédiaire',
        category: 'Cardio',
        caloriesBurn: 450,
        duration: 60,
        availableSpots: 20,
        bookedSpots: 0,
        color: '#FF6B6B',
        icon: '🏃',
        isActive: true,
        order: 1
      },
      {
        title: 'Musculation Force',
        description: 'Développez votre force avec un programme de musculation complet.',
        dayOfWeek: 'Lundi',
        startTime: '09:00',
        endTime: '10:30',
        trainerId: trainerMap['Marc Dubois'],
        difficulty: 'Avancé',
        category: 'Musculation',
        caloriesBurn: 350,
        duration: 90,
        availableSpots: 15,
        bookedSpots: 0,
        color: '#4ECDC4',
        icon: '💪',
        isActive: true,
        order: 2
      },
      {
        title: 'Yoga Doux',
        description: 'Séance de yoga relaxante pour améliorer votre flexibilité et réduire le stress.',
        dayOfWeek: 'Lundi',
        startTime: '18:00',
        endTime: '19:00',
        trainerId: trainerMap['Emma Laurent'],
        difficulty: 'Débutant',
        category: 'Yoga',
        caloriesBurn: 200,
        duration: 60,
        availableSpots: 25,
        bookedSpots: 0,
        color: '#95E1D3',
        icon: '🧘',
        isActive: true,
        order: 3
      },
      
      // Mardi
      {
        title: 'HIIT Explosif',
        description: 'Entraînement par intervalles à haute intensité pour maximiser la combustion des graisses.',
        dayOfWeek: 'Mardi',
        startTime: '06:30',
        endTime: '07:30',
        trainerId: trainerMap['Thomas Rousseau'],
        difficulty: 'Avancé',
        category: 'HIIT',
        caloriesBurn: 600,
        duration: 60,
        availableSpots: 18,
        bookedSpots: 0,
        color: '#F38181',
        icon: '🔥',
        isActive: true,
        order: 4
      },
      {
        title: 'Fitness Fonctionnel',
        description: 'Mouvements fonctionnels pour améliorer votre quotidien et prévenir les blessures.',
        dayOfWeek: 'Mardi',
        startTime: '10:00',
        endTime: '11:00',
        trainerId: trainerMap['Julie Bernard'],
        difficulty: 'Intermédiaire',
        category: 'Fitness',
        caloriesBurn: 380,
        duration: 60,
        availableSpots: 20,
        bookedSpots: 0,
        color: '#AA96DA',
        icon: '⚡',
        isActive: true,
        order: 5
      },
      {
        title: 'Cardio Dance',
        description: 'Dansez et brûlez des calories sur des rythmes entraînants.',
        dayOfWeek: 'Mardi',
        startTime: '19:00',
        endTime: '20:00',
        trainerId: trainerMap['Sophie Martin'],
        difficulty: 'Débutant',
        category: 'Cardio',
        caloriesBurn: 420,
        duration: 60,
        availableSpots: 30,
        bookedSpots: 0,
        color: '#FCBAD3',
        icon: '💃',
        isActive: true,
        order: 6
      },

      // Mercredi
      {
        title: 'Body Building',
        description: 'Construction musculaire ciblée pour sculpter votre physique.',
        dayOfWeek: 'Mercredi',
        startTime: '08:00',
        endTime: '09:30',
        trainerId: trainerMap['Marc Dubois'],
        difficulty: 'Avancé',
        category: 'Musculation',
        caloriesBurn: 400,
        duration: 90,
        availableSpots: 12,
        bookedSpots: 0,
        color: '#A8D8EA',
        icon: '🏋️',
        isActive: true,
        order: 7
      },
      {
        title: 'Stretching & Mobilité',
        description: 'Améliorez votre souplesse et votre amplitude de mouvement.',
        dayOfWeek: 'Mercredi',
        startTime: '12:30',
        endTime: '13:30',
        trainerId: trainerMap['Emma Laurent'],
        difficulty: 'Débutant',
        category: 'Stretching',
        caloriesBurn: 150,
        duration: 60,
        availableSpots: 20,
        bookedSpots: 0,
        color: '#B4E7CE',
        icon: '🤸',
        isActive: true,
        order: 8
      },
      {
        title: 'CrossFit WOD',
        description: 'Workout of the Day - Entraînement CrossFit varié et intense.',
        dayOfWeek: 'Mercredi',
        startTime: '18:30',
        endTime: '19:30',
        trainerId: trainerMap['Thomas Rousseau'],
        difficulty: 'Avancé',
        category: 'CrossFit',
        caloriesBurn: 550,
        duration: 60,
        availableSpots: 16,
        bookedSpots: 0,
        color: '#F7DC6F',
        icon: '⚔️',
        isActive: true,
        order: 9
      },

      // Jeudi
      {
        title: 'Cardio Bike',
        description: 'Séance de vélo en salle énergisante et motivante.',
        dayOfWeek: 'Jeudi',
        startTime: '07:00',
        endTime: '08:00',
        trainerId: trainerMap['Sophie Martin'],
        difficulty: 'Intermédiaire',
        category: 'Cardio',
        caloriesBurn: 500,
        duration: 60,
        availableSpots: 25,
        bookedSpots: 0,
        color: '#85C1E2',
        icon: '🚴',
        isActive: true,
        order: 10
      },
      {
        title: 'Renforcement Core',
        description: 'Renforcez votre sangle abdominale et améliorez votre stabilité.',
        dayOfWeek: 'Jeudi',
        startTime: '10:00',
        endTime: '11:00',
        trainerId: trainerMap['Julie Bernard'],
        difficulty: 'Intermédiaire',
        category: 'Fitness',
        caloriesBurn: 300,
        duration: 60,
        availableSpots: 18,
        bookedSpots: 0,
        color: '#C7CEEA',
        icon: '🎯',
        isActive: true,
        order: 11
      },
      {
        title: 'Power Yoga',
        description: 'Yoga dynamique combinant force, flexibilité et respiration.',
        dayOfWeek: 'Jeudi',
        startTime: '19:00',
        endTime: '20:00',
        trainerId: trainerMap['Emma Laurent'],
        difficulty: 'Intermédiaire',
        category: 'Yoga',
        caloriesBurn: 320,
        duration: 60,
        availableSpots: 22,
        bookedSpots: 0,
        color: '#FFDAC1',
        icon: '🧘',
        isActive: true,
        order: 12
      },

      // Vendredi
      {
        title: 'Full Body HIIT',
        description: 'HIIT complet du corps pour finir la semaine en force.',
        dayOfWeek: 'Vendredi',
        startTime: '06:30',
        endTime: '07:30',
        trainerId: trainerMap['Thomas Rousseau'],
        difficulty: 'Avancé',
        category: 'HIIT',
        caloriesBurn: 580,
        duration: 60,
        availableSpots: 20,
        bookedSpots: 0,
        color: '#FF8B94',
        icon: '🔥',
        isActive: true,
        order: 13
      },
      {
        title: 'Musculation Hypertrophie',
        description: 'Programme spécialisé pour la prise de masse musculaire.',
        dayOfWeek: 'Vendredi',
        startTime: '09:00',
        endTime: '10:30',
        trainerId: trainerMap['Marc Dubois'],
        difficulty: 'Avancé',
        category: 'Musculation',
        caloriesBurn: 380,
        duration: 90,
        availableSpots: 14,
        bookedSpots: 0,
        color: '#9DD9D2',
        icon: '💪',
        isActive: true,
        order: 14
      },
      {
        title: 'Zumba Party',
        description: 'Terminez la semaine en beauté avec une session de Zumba festive!',
        dayOfWeek: 'Vendredi',
        startTime: '18:00',
        endTime: '19:00',
        trainerId: trainerMap['Sophie Martin'],
        difficulty: 'Débutant',
        category: 'Cardio',
        caloriesBurn: 480,
        duration: 60,
        availableSpots: 35,
        bookedSpots: 0,
        color: '#FFF8DC',
        icon: '🎉',
        isActive: true,
        order: 15
      }
    ];

    console.log('Starting classes seed...\n');

    for (const classData of classes) {
      const created = await databases.createDocument(
        databaseId,
        classesCollectionId,
        ID.unique(),
        classData
      );
      console.log(`✅ Created class: ${created.title} - ${created.dayOfWeek} ${created.startTime}`);
    }

    console.log(`\n✅ Successfully seeded ${classes.length} classes!`);
  } catch (error) {
    console.error('Error seeding classes:', error);
    throw error;
  }
}

seedClasses();
