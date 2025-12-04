import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/schedule/config
export async function GET(request) {
  try {
    await requireAdmin();

    const { databases } = createAdminClient();

    const configs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleConfigCollectionId
    );

    const config = configs.documents[0] || null;

    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PATCH /api/admin/schedule/config
export async function PATCH(request) {
  try {
    await requireAdmin();

    const data = await request.json();
    const { databases } = createAdminClient();

    // Get existing config
    const configs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleConfigCollectionId
    );

    const updateData = {};
    
    // Parse arrays/objects to JSON strings
    if (data.displayDays !== undefined) {
      updateData.displayDays = Array.isArray(data.displayDays) 
        ? JSON.stringify(data.displayDays) 
        : data.displayDays;
    }
    if (data.dayLabels !== undefined) {
      updateData.dayLabels = typeof data.dayLabels === 'object' 
        ? JSON.stringify(data.dayLabels) 
        : data.dayLabels;
    }
    if (data.theme !== undefined) {
      updateData.theme = typeof data.theme === 'object' 
        ? JSON.stringify(data.theme) 
        : data.theme;
    }
    if (data.startHour !== undefined) updateData.startHour = data.startHour;
    if (data.endHour !== undefined) updateData.endHour = data.endHour;
    if (data.showCoach !== undefined) updateData.showCoach = data.showCoach;
    if (data.showCapacity !== undefined) updateData.showCapacity = data.showCapacity;
    if (data.timeFormat !== undefined) updateData.timeFormat = data.timeFormat;
    if (data.autoRefresh !== undefined) updateData.autoRefresh = data.autoRefresh;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    let config;
    if (configs.documents.length > 0) {
      // Update existing config
      config = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.scheduleConfigCollectionId,
        configs.documents[0].$id,
        updateData
      );
    } else {
      // Create new config with defaults
      config = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.scheduleConfigCollectionId,
        'unique()',
        {
          displayDays: updateData.displayDays || JSON.stringify([1, 2, 3, 4, 5]),
          dayLabels: updateData.dayLabels || JSON.stringify({
            1: 'Lundi',
            2: 'Mardi',
            3: 'Mercredi',
            4: 'Jeudi',
            5: 'Vendredi',
            6: 'Samedi',
            7: 'Dimanche'
          }),
          theme: updateData.theme || JSON.stringify({
            primaryColor: '#CC1303',
            secondaryColor: '#1a1a1a',
            cardBackground: '#ffffff'
          }),
          startHour: updateData.startHour || '06:00',
          endHour: updateData.endHour || '22:00',
          showCoach: updateData.showCoach !== undefined ? updateData.showCoach : true,
          showCapacity: updateData.showCapacity !== undefined ? updateData.showCapacity : true,
          timeFormat: updateData.timeFormat || '24h',
          autoRefresh: updateData.autoRefresh !== undefined ? updateData.autoRefresh : false,
          isActive: updateData.isActive !== undefined ? updateData.isActive : true
        }
      );
    }

    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
