import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/schedule - Fetch all active sessions with course and coach data
export async function GET(request) {
  try {
    // Validate required environment variables
    if (!appwriteConfig.databaseId || !appwriteConfig.scheduleSessionsCollectionId) {
      console.error('Missing required configuration:', {
        databaseId: !!appwriteConfig.databaseId,
        scheduleSessionsCollectionId: !!appwriteConfig.scheduleSessionsCollectionId,
        courseTypesCollectionId: !!appwriteConfig.courseTypesCollectionId,
        coachesCollectionId: !!appwriteConfig.coachesCollectionId,
      });
      return NextResponse.json({
        success: false,
        sessions: [],
        error: 'Missing required configuration'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');

    const { databases } = createAdminClient();

    // Build queries
    let queries = [
      Query.equal('isActive', true),
      Query.equal('status', 'active'),
      Query.orderAsc('dayOfWeek'),
      Query.orderAsc('startTime')
    ];

    if (day && day !== 'all') {
      queries.push(Query.equal('dayOfWeek', parseInt(day)));
    }

    // Fetch sessions
    const sessions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.scheduleSessionsCollectionId,
      queries
    );

    // Fetch course types and coaches for joining
    const [courseTypes, coaches] = await Promise.all([
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.courseTypesCollectionId,
        [Query.equal('isActive', true)]
      ),
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.coachesCollectionId,
        [Query.equal('isActive', true)]
      )
    ]);

    // Join data manually
    const enrichedSessions = sessions.documents.map(session => {
      const courseType = courseTypes.documents.find(c => c.$id === session.courseTypeId);
      const coach = coaches.documents.find(c => c.$id === session.coachId);

      return {
        ...session,
        courseType: courseType || null,
        coach: coach || null
      };
    });

    return NextResponse.json({
      success: true,
      sessions: enrichedSessions,
      total: sessions.total
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360'
      }
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
