/**
 * Setup script for User Panel collections in Appwrite
 * Run with: node scripts/setup-user-panel-collections.js
 */

import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;

// Collection IDs for User Panel
const COLLECTIONS = {
  USER_PROFILES: 'user_profiles',
  EXERCISES: 'exercises',
  WORKOUT_PLANS: 'workout_plans',
  WORKOUT_PLAN_EXERCISES: 'workout_plan_exercises',
  WORKOUT_LOGS: 'workout_logs',
  WORKOUT_LOG_SETS: 'workout_log_sets',
  BODY_METRICS: 'body_metrics',
  FITNESS_GOALS: 'fitness_goals',
  USER_STREAKS: 'user_streaks',
  DAILY_TIPS: 'daily_tips',
};

async function createCollection(collectionId, name, attributes, indexes = []) {
  try {
    console.log(`\n📦 Creating collection: ${name}...`);
    
    await databases.createCollection(
      databaseId,
      collectionId,
      name,
      [
        // Permissions - users can read/write their own data
      ]
    );
    console.log(`✅ Collection ${name} created`);

    // Create attributes
    for (const attr of attributes) {
      try {
        console.log(`  📝 Creating attribute: ${attr.key}...`);
        
        switch (attr.type) {
          case 'string':
            await databases.createStringAttribute(
              databaseId,
              collectionId,
              attr.key,
              attr.size || 255,
              attr.required || false,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'integer':
            await databases.createIntegerAttribute(
              databaseId,
              collectionId,
              attr.key,
              attr.required || false,
              attr.min || null,
              attr.max || null,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'float':
            await databases.createFloatAttribute(
              databaseId,
              collectionId,
              attr.key,
              attr.required || false,
              attr.min || null,
              attr.max || null,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'boolean':
            await databases.createBooleanAttribute(
              databaseId,
              collectionId,
              attr.key,
              attr.required || false,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'datetime':
            await databases.createDatetimeAttribute(
              databaseId,
              collectionId,
              attr.key,
              attr.required || false,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'enum':
            await databases.createEnumAttribute(
              databaseId,
              collectionId,
              attr.key,
              attr.elements,
              attr.required || false,
              attr.default || null,
              attr.array || false
            );
            break;
        }
        console.log(`  ✅ Attribute ${attr.key} created`);
      } catch (attrError) {
        if (attrError.code === 409) {
          console.log(`  ⚠️  Attribute ${attr.key} already exists`);
        } else {
          console.error(`  ❌ Failed to create attribute ${attr.key}:`, attrError.message);
        }
      }
    }

    // Wait for attributes to be ready
    console.log('  ⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create indexes
    for (const index of indexes) {
      try {
        console.log(`  🔍 Creating index: ${index.key}...`);
        await databases.createIndex(
          databaseId,
          collectionId,
          index.key,
          index.type,
          index.attributes,
          index.orders || []
        );
        console.log(`  ✅ Index ${index.key} created`);
      } catch (indexError) {
        if (indexError.code === 409) {
          console.log(`  ⚠️  Index ${index.key} already exists`);
        } else {
          console.error(`  ❌ Failed to create index ${index.key}:`, indexError.message);
        }
      }
    }

  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Collection ${name} already exists`);
    } else {
      console.error(`❌ Failed to create collection ${name}:`, error.message);
      throw error;
    }
  }
}

async function setupCollections() {
  console.log('🚀 Setting up User Panel collections...\n');

  // 1. User Profiles - Extended user data for gym users
  await createCollection(COLLECTIONS.USER_PROFILES, 'User Profiles', [
    { key: 'userId', type: 'string', size: 36, required: true },
    { key: 'displayName', type: 'string', size: 100, required: false },
    { key: 'avatar', type: 'string', size: 500, required: false },
    { key: 'dateOfBirth', type: 'datetime', required: false },
    { key: 'gender', type: 'enum', elements: ['male', 'female', 'other', 'prefer_not_to_say'], required: false },
    { key: 'height', type: 'float', required: false }, // in cm
    { key: 'fitnessLevel', type: 'enum', elements: ['beginner', 'intermediate', 'advanced', 'elite'], required: false },
    { key: 'fitnessGoals', type: 'string', size: 500, array: true, required: false },
    { key: 'preferredWorkoutDays', type: 'string', size: 20, array: true, required: false },
    { key: 'preferredWorkoutTime', type: 'enum', elements: ['morning', 'afternoon', 'evening', 'night'], required: false },
    { key: 'injuries', type: 'string', size: 500, required: false },
    { key: 'equipmentAccess', type: 'string', size: 100, array: true, required: false },
    { key: 'onboardingCompleted', type: 'boolean', required: false, default: false },
    { key: 'createdAt', type: 'datetime', required: false },
    { key: 'updatedAt', type: 'datetime', required: false },
  ], [
    { key: 'userId_idx', type: 'unique', attributes: ['userId'] },
  ]);

  // 2. Exercises - Master list of exercises
  await createCollection(COLLECTIONS.EXERCISES, 'Exercises', [
    { key: 'name', type: 'string', size: 100, required: true },
    { key: 'description', type: 'string', size: 1000, required: false },
    { key: 'muscleGroup', type: 'enum', elements: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'core', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'full_body', 'cardio'], required: true },
    { key: 'secondaryMuscles', type: 'string', size: 50, array: true, required: false },
    { key: 'equipment', type: 'enum', elements: ['none', 'barbell', 'dumbbell', 'cable', 'machine', 'kettlebell', 'resistance_band', 'bodyweight', 'smith_machine', 'ez_bar', 'pull_up_bar', 'bench', 'other'], required: true },
    { key: 'difficulty', type: 'enum', elements: ['beginner', 'intermediate', 'advanced'], required: true },
    { key: 'exerciseType', type: 'enum', elements: ['strength', 'cardio', 'flexibility', 'balance', 'plyometric'], required: true },
    { key: 'instructions', type: 'string', size: 2000, required: false },
    { key: 'tips', type: 'string', size: 1000, required: false },
    { key: 'videoUrl', type: 'string', size: 500, required: false },
    { key: 'imageUrl', type: 'string', size: 500, required: false },
    { key: 'isActive', type: 'boolean', required: false, default: true },
  ], [
    { key: 'muscleGroup_idx', type: 'key', attributes: ['muscleGroup'] },
    { key: 'equipment_idx', type: 'key', attributes: ['equipment'] },
    { key: 'difficulty_idx', type: 'key', attributes: ['difficulty'] },
  ]);

  // 3. Workout Plans - User's workout routines
  await createCollection(COLLECTIONS.WORKOUT_PLANS, 'Workout Plans', [
    { key: 'userId', type: 'string', size: 36, required: true },
    { key: 'name', type: 'string', size: 100, required: true },
    { key: 'description', type: 'string', size: 500, required: false },
    { key: 'type', type: 'enum', elements: ['push_pull_legs', 'upper_lower', 'full_body', 'bro_split', 'custom'], required: true },
    { key: 'daysPerWeek', type: 'integer', required: true, min: 1, max: 7 },
    { key: 'difficulty', type: 'enum', elements: ['beginner', 'intermediate', 'advanced'], required: true },
    { key: 'estimatedDuration', type: 'integer', required: false }, // in minutes
    { key: 'targetMuscleGroups', type: 'string', size: 50, array: true, required: false },
    { key: 'isTemplate', type: 'boolean', required: false, default: false },
    { key: 'isActive', type: 'boolean', required: false, default: true },
    { key: 'createdAt', type: 'datetime', required: false },
    { key: 'updatedAt', type: 'datetime', required: false },
  ], [
    { key: 'userId_idx', type: 'key', attributes: ['userId'] },
    { key: 'type_idx', type: 'key', attributes: ['type'] },
  ]);

  // 4. Workout Plan Exercises - Exercises within a plan
  await createCollection(COLLECTIONS.WORKOUT_PLAN_EXERCISES, 'Workout Plan Exercises', [
    { key: 'planId', type: 'string', size: 36, required: true },
    { key: 'exerciseId', type: 'string', size: 36, required: true },
    { key: 'dayOfWeek', type: 'integer', required: true, min: 1, max: 7 }, // 1=Monday, 7=Sunday
    { key: 'orderIndex', type: 'integer', required: true },
    { key: 'targetSets', type: 'integer', required: true, min: 1, max: 20 },
    { key: 'targetReps', type: 'string', size: 20, required: true }, // e.g., "8-12" or "AMRAP"
    { key: 'restSeconds', type: 'integer', required: false, default: 90 },
    { key: 'notes', type: 'string', size: 500, required: false },
    { key: 'supersetGroup', type: 'string', size: 36, required: false }, // for supersets
  ], [
    { key: 'planId_idx', type: 'key', attributes: ['planId'] },
    { key: 'planDay_idx', type: 'key', attributes: ['planId', 'dayOfWeek'] },
  ]);

  // 5. Workout Logs - Record of completed workouts
  await createCollection(COLLECTIONS.WORKOUT_LOGS, 'Workout Logs', [
    { key: 'userId', type: 'string', size: 36, required: true },
    { key: 'planId', type: 'string', size: 36, required: false }, // optional, can log without plan
    { key: 'planName', type: 'string', size: 100, required: false },
    { key: 'workoutDate', type: 'datetime', required: true },
    { key: 'startTime', type: 'datetime', required: false },
    { key: 'endTime', type: 'datetime', required: false },
    { key: 'durationMinutes', type: 'integer', required: false },
    { key: 'totalVolume', type: 'float', required: false }, // weight x reps x sets
    { key: 'exerciseCount', type: 'integer', required: false },
    { key: 'caloriesBurned', type: 'integer', required: false },
    { key: 'rating', type: 'integer', required: false, min: 1, max: 5 }, // how good was the workout
    { key: 'notes', type: 'string', size: 1000, required: false },
    { key: 'mood', type: 'enum', elements: ['great', 'good', 'okay', 'tired', 'exhausted'], required: false },
    { key: 'createdAt', type: 'datetime', required: false },
  ], [
    { key: 'userId_idx', type: 'key', attributes: ['userId'] },
    { key: 'userDate_idx', type: 'key', attributes: ['userId', 'workoutDate'] },
  ]);

  // 6. Workout Log Sets - Individual sets within a workout
  await createCollection(COLLECTIONS.WORKOUT_LOG_SETS, 'Workout Log Sets', [
    { key: 'workoutLogId', type: 'string', size: 36, required: true },
    { key: 'exerciseId', type: 'string', size: 36, required: true },
    { key: 'exerciseName', type: 'string', size: 100, required: true },
    { key: 'setNumber', type: 'integer', required: true, min: 1 },
    { key: 'weight', type: 'float', required: false }, // in kg
    { key: 'reps', type: 'integer', required: false },
    { key: 'duration', type: 'integer', required: false }, // for timed exercises, in seconds
    { key: 'distance', type: 'float', required: false }, // for cardio, in km
    { key: 'setType', type: 'enum', elements: ['normal', 'warmup', 'dropset', 'failure', 'rest_pause'], required: false, default: 'normal' },
    { key: 'rpe', type: 'integer', required: false, min: 1, max: 10 }, // Rate of Perceived Exertion
    { key: 'isPersonalRecord', type: 'boolean', required: false, default: false },
    { key: 'notes', type: 'string', size: 200, required: false },
  ], [
    { key: 'workoutLogId_idx', type: 'key', attributes: ['workoutLogId'] },
    { key: 'exerciseId_idx', type: 'key', attributes: ['exerciseId'] },
  ]);

  // 7. Body Metrics - User body measurements over time
  await createCollection(COLLECTIONS.BODY_METRICS, 'Body Metrics', [
    { key: 'userId', type: 'string', size: 36, required: true },
    { key: 'recordedAt', type: 'datetime', required: true },
    { key: 'weight', type: 'float', required: false }, // in kg
    { key: 'bodyFat', type: 'float', required: false }, // percentage
    { key: 'muscleMass', type: 'float', required: false }, // in kg
    { key: 'chest', type: 'float', required: false }, // in cm
    { key: 'waist', type: 'float', required: false },
    { key: 'hips', type: 'float', required: false },
    { key: 'bicepsLeft', type: 'float', required: false },
    { key: 'bicepsRight', type: 'float', required: false },
    { key: 'thighLeft', type: 'float', required: false },
    { key: 'thighRight', type: 'float', required: false },
    { key: 'calfLeft', type: 'float', required: false },
    { key: 'calfRight', type: 'float', required: false },
    { key: 'neck', type: 'float', required: false },
    { key: 'shoulders', type: 'float', required: false },
    { key: 'forearmLeft', type: 'float', required: false },
    { key: 'forearmRight', type: 'float', required: false },
    { key: 'notes', type: 'string', size: 500, required: false },
    { key: 'photoUrl', type: 'string', size: 500, required: false },
  ], [
    { key: 'userId_idx', type: 'key', attributes: ['userId'] },
    { key: 'userDate_idx', type: 'key', attributes: ['userId', 'recordedAt'] },
  ]);

  // 8. Fitness Goals
  await createCollection(COLLECTIONS.FITNESS_GOALS, 'Fitness Goals', [
    { key: 'userId', type: 'string', size: 36, required: true },
    { key: 'title', type: 'string', size: 100, required: true },
    { key: 'description', type: 'string', size: 500, required: false },
    { key: 'goalType', type: 'enum', elements: ['weight_loss', 'weight_gain', 'strength', 'endurance', 'muscle_gain', 'body_recomposition', 'flexibility', 'habit', 'custom'], required: true },
    { key: 'targetValue', type: 'float', required: false },
    { key: 'currentValue', type: 'float', required: false },
    { key: 'unit', type: 'string', size: 20, required: false }, // kg, reps, minutes, etc.
    { key: 'startDate', type: 'datetime', required: true },
    { key: 'targetDate', type: 'datetime', required: false },
    { key: 'completedDate', type: 'datetime', required: false },
    { key: 'status', type: 'enum', elements: ['active', 'completed', 'abandoned', 'paused'], required: false, default: 'active' },
    { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high'], required: false, default: 'medium' },
    { key: 'milestones', type: 'string', size: 1000, required: false }, // JSON string of milestones
    { key: 'createdAt', type: 'datetime', required: false },
    { key: 'updatedAt', type: 'datetime', required: false },
  ], [
    { key: 'userId_idx', type: 'key', attributes: ['userId'] },
    { key: 'userStatus_idx', type: 'key', attributes: ['userId', 'status'] },
  ]);

  // 9. User Streaks - Track consistency
  await createCollection(COLLECTIONS.USER_STREAKS, 'User Streaks', [
    { key: 'userId', type: 'string', size: 36, required: true },
    { key: 'currentStreak', type: 'integer', required: false, default: 0 },
    { key: 'longestStreak', type: 'integer', required: false, default: 0 },
    { key: 'lastWorkoutDate', type: 'datetime', required: false },
    { key: 'totalWorkouts', type: 'integer', required: false, default: 0 },
    { key: 'totalMinutes', type: 'integer', required: false, default: 0 },
    { key: 'totalVolume', type: 'float', required: false, default: 0 },
    { key: 'workoutsThisWeek', type: 'integer', required: false, default: 0 },
    { key: 'workoutsThisMonth', type: 'integer', required: false, default: 0 },
    { key: 'weekStartDate', type: 'datetime', required: false },
    { key: 'monthStartDate', type: 'datetime', required: false },
    { key: 'achievements', type: 'string', size: 2000, required: false }, // JSON array of earned achievements
    { key: 'updatedAt', type: 'datetime', required: false },
  ], [
    { key: 'userId_idx', type: 'unique', attributes: ['userId'] },
  ]);

  // 10. Daily Tips - Motivational content
  await createCollection(COLLECTIONS.DAILY_TIPS, 'Daily Tips', [
    { key: 'title', type: 'string', size: 100, required: true },
    { key: 'content', type: 'string', size: 1000, required: true },
    { key: 'category', type: 'enum', elements: ['motivation', 'nutrition', 'workout', 'recovery', 'mindset', 'technique'], required: true },
    { key: 'author', type: 'string', size: 100, required: false },
    { key: 'imageUrl', type: 'string', size: 500, required: false },
    { key: 'isActive', type: 'boolean', required: false, default: true },
    { key: 'displayDate', type: 'datetime', required: false },
    { key: 'createdAt', type: 'datetime', required: false },
  ], [
    { key: 'category_idx', type: 'key', attributes: ['category'] },
    { key: 'isActive_idx', type: 'key', attributes: ['isActive'] },
  ]);

  console.log('\n✅ All User Panel collections created successfully!');
  console.log('\n📋 Collection IDs to add to your .env.local:');
  console.log('----------------------------------------');
  Object.entries(COLLECTIONS).forEach(([key, value]) => {
    console.log(`NEXT_PUBLIC_${key}_COLLECTION_ID=${value}`);
  });
  console.log('----------------------------------------');
}

// Seed default exercises
async function seedExercises() {
  console.log('\n🌱 Seeding default exercises...');
  
  const exercises = [
    // Chest
    { name: 'Barbell Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'The king of chest exercises. Lie on bench, lower bar to chest, press up.' },
    { name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Targets upper chest. Set bench to 30-45 degrees.' },
    { name: 'Cable Flyes', muscleGroup: 'chest', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', description: 'Great for chest isolation and stretch.' },
    { name: 'Push-Ups', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', description: 'Classic bodyweight chest exercise.' },
    { name: 'Dumbbell Flyes', muscleGroup: 'chest', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', description: 'Isolation movement for chest stretch and contraction.' },
    
    // Back
    { name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced', exerciseType: 'strength', description: 'Compound movement for overall back development.' },
    { name: 'Pull-Ups', muscleGroup: 'back', equipment: 'pull_up_bar', difficulty: 'intermediate', exerciseType: 'strength', description: 'Bodyweight back exercise for lats.' },
    { name: 'Barbell Rows', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Bent over row for back thickness.' },
    { name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', description: 'Cable exercise for lat development.' },
    { name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', description: 'Targets middle back muscles.' },
    
    // Shoulders
    { name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Primary shoulder mass builder.' },
    { name: 'Lateral Raises', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', description: 'Isolation for side delts.' },
    { name: 'Face Pulls', muscleGroup: 'shoulders', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', description: 'Great for rear delts and shoulder health.' },
    { name: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Rotational press hitting all delt heads.' },
    
    // Biceps
    { name: 'Barbell Curl', muscleGroup: 'biceps', equipment: 'barbell', difficulty: 'beginner', exerciseType: 'strength', description: 'Classic bicep mass builder.' },
    { name: 'Hammer Curls', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', description: 'Targets brachialis and forearms.' },
    { name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Great stretch on the bicep.' },
    { name: 'Cable Curl', muscleGroup: 'biceps', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', description: 'Constant tension throughout movement.' },
    
    // Triceps
    { name: 'Close Grip Bench Press', muscleGroup: 'triceps', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Compound tricep movement.' },
    { name: 'Tricep Pushdown', muscleGroup: 'triceps', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', description: 'Cable isolation for triceps.' },
    { name: 'Skull Crushers', muscleGroup: 'triceps', equipment: 'ez_bar', difficulty: 'intermediate', exerciseType: 'strength', description: 'Lying tricep extension.' },
    { name: 'Overhead Tricep Extension', muscleGroup: 'triceps', equipment: 'dumbbell', difficulty: 'beginner', exerciseType: 'strength', description: 'Targets long head of tricep.' },
    
    // Legs
    { name: 'Barbell Squat', muscleGroup: 'quadriceps', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'King of leg exercises.' },
    { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Targets hamstrings and glutes.' },
    { name: 'Leg Press', muscleGroup: 'quadriceps', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', description: 'Machine compound leg movement.' },
    { name: 'Leg Curl', muscleGroup: 'hamstrings', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', description: 'Isolation for hamstrings.' },
    { name: 'Leg Extension', muscleGroup: 'quadriceps', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', description: 'Isolation for quadriceps.' },
    { name: 'Bulgarian Split Squat', muscleGroup: 'quadriceps', equipment: 'dumbbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Unilateral leg exercise.' },
    { name: 'Hip Thrust', muscleGroup: 'glutes', equipment: 'barbell', difficulty: 'intermediate', exerciseType: 'strength', description: 'Best glute isolation exercise.' },
    { name: 'Calf Raises', muscleGroup: 'calves', equipment: 'machine', difficulty: 'beginner', exerciseType: 'strength', description: 'Standing or seated calf work.' },
    
    // Core
    { name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', description: 'Isometric core exercise.' },
    { name: 'Cable Crunch', muscleGroup: 'core', equipment: 'cable', difficulty: 'beginner', exerciseType: 'strength', description: 'Weighted ab exercise.' },
    { name: 'Hanging Leg Raise', muscleGroup: 'core', equipment: 'pull_up_bar', difficulty: 'intermediate', exerciseType: 'strength', description: 'Advanced ab exercise.' },
    { name: 'Russian Twist', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', exerciseType: 'strength', description: 'Rotational core movement.' },
    
    // Cardio
    { name: 'Treadmill Running', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner', exerciseType: 'cardio', description: 'Cardiovascular running exercise.' },
    { name: 'Cycling', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner', exerciseType: 'cardio', description: 'Low impact cardio on stationary bike.' },
    { name: 'Rowing Machine', muscleGroup: 'cardio', equipment: 'machine', difficulty: 'beginner', exerciseType: 'cardio', description: 'Full body cardio workout.' },
    { name: 'Jump Rope', muscleGroup: 'cardio', equipment: 'other', difficulty: 'intermediate', exerciseType: 'cardio', description: 'High intensity cardio.' },
  ];

  for (const exercise of exercises) {
    try {
      await databases.createDocument(
        databaseId,
        COLLECTIONS.EXERCISES,
        ID.unique(),
        {
          ...exercise,
          secondaryMuscles: [],
          instructions: '',
          tips: '',
          isActive: true,
        }
      );
      console.log(`  ✅ Added exercise: ${exercise.name}`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ⚠️  Exercise ${exercise.name} already exists`);
      } else {
        console.error(`  ❌ Failed to add ${exercise.name}:`, error.message);
      }
    }
  }
}

// Seed daily tips
async function seedDailyTips() {
  console.log('\n💡 Seeding daily tips...');
  
  const tips = [
    { title: 'Progressive Overload', content: 'To build muscle, gradually increase the weight, frequency, or reps in your workouts. Your body adapts to stress, so keep challenging it!', category: 'workout' },
    { title: 'Sleep for Gains', content: 'Muscles grow during rest, not during workouts. Aim for 7-9 hours of quality sleep to maximize recovery and growth.', category: 'recovery' },
    { title: 'Protein Timing', content: 'Consume protein within 2 hours after your workout. Aim for 0.8-1g of protein per pound of bodyweight daily.', category: 'nutrition' },
    { title: 'Mind-Muscle Connection', content: 'Focus on feeling the target muscle work during each rep. This mental focus can significantly improve muscle activation.', category: 'technique' },
    { title: 'Consistency Over Intensity', content: 'Showing up regularly beats occasional intense sessions. Build the habit first, then optimize intensity.', category: 'motivation' },
    { title: 'Warm Up Properly', content: 'Never skip your warm-up. 5-10 minutes of light cardio and dynamic stretching prevents injuries and improves performance.', category: 'workout' },
    { title: 'Track Everything', content: 'What gets measured gets managed. Log your workouts, meals, and progress to identify what works for you.', category: 'motivation' },
    { title: 'Hydration Matters', content: 'Dehydration can reduce strength by up to 25%. Drink at least 3 liters of water daily, more on training days.', category: 'nutrition' },
    { title: 'Control the Negative', content: 'The eccentric (lowering) phase of an exercise is just as important as lifting. Control the weight for 2-3 seconds on the way down.', category: 'technique' },
    { title: 'Rest Between Sets', content: 'For strength: 2-5 minutes rest. For hypertrophy: 60-90 seconds. For endurance: 30-60 seconds.', category: 'workout' },
  ];

  for (const tip of tips) {
    try {
      await databases.createDocument(
        databaseId,
        COLLECTIONS.DAILY_TIPS,
        ID.unique(),
        {
          ...tip,
          isActive: true,
          createdAt: new Date().toISOString(),
        }
      );
      console.log(`  ✅ Added tip: ${tip.title}`);
    } catch (error) {
      console.error(`  ❌ Failed to add tip ${tip.title}:`, error.message);
    }
  }
}

async function main() {
  try {
    await setupCollections();
    await seedExercises();
    await seedDailyTips();
    console.log('\n🎉 User Panel setup complete!');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
