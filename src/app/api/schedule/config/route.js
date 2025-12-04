import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

// GET /api/schedule/config - Fetch schedule configuration
export async function GET(request) {
  try {
    const { databases } = createAdminClient();

    const configs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleConfigCollectionId,
      [Query.equal('isActive', true), Query.limit(1)]
    );

    if (configs.documents.length === 0) {
      // Return default config if none exists
      return NextResponse.json({
        success: true,
        config: {
          sectionTitle: 'Programme des Cours Collectifs',
          sectionSubtitle: '',
          displayDays: [1, 2, 3, 4, 5],
          dayLabels: {
            1: 'Lundi',
            2: 'Mardi',
            3: 'Mercredi',
            4: 'Jeudi',
            5: 'Vendredi',
            6: 'Samedi',
            7: 'Dimanche'
          },
          timeFormat: '24h',
          showCoachInfo: true,
          showCapacity: false,
          enableBooking: false
        }
      });
    }

    const config = configs.documents[0];

    // Parse JSON fields
    const parsedConfig = {
      ...config,
      displayDays: JSON.parse(config.displayDays || '[1,2,3,4,5]'),
      dayLabels: JSON.parse(config.dayLabels || '{"1":"Lundi","2":"Mardi","3":"Mercredi","4":"Jeudi","5":"Vendredi"}'),
      theme: config.theme ? JSON.parse(config.theme) : null
    };

    return NextResponse.json({
      success: true,
      config: parsedConfig
    });
  } catch (error) {
    console.error('Error fetching schedule config:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
