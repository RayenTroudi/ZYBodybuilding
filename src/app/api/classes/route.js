import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// GET - Fetch all active classes with trainer information
export async function GET(request) {
  try {
    const { databases } = createAdminClient();
    
    // Fetch classes ordered by day and time
    const classes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.classesCollectionId,
      [
        Query.orderAsc('startTime')
      ]
    );

    // Fetch all trainers
    const trainers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.trainersCollectionId
    );

    // Create a map of trainers by ID for quick lookup
    const trainerMap = {};
    trainers.documents.forEach(trainer => {
      trainerMap[trainer.$id] = trainer;
    });

    // Populate trainer information in classes
    const classesWithTrainers = classes.documents.map(classDoc => {
      const trainer = classDoc.trainerId ? trainerMap[classDoc.trainerId] : null;
      
      return {
        ...classDoc,
        trainer: trainer ? {
          $id: trainer.$id,
          name: trainer.name,
          imageUrl: trainer.imageUrl,
          specialty: trainer.specialty
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      classes: classesWithTrainers
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
