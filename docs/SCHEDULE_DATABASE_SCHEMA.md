# Schedule Management Database Schema

## Collections Overview

This document describes the database collections required for the dynamic schedule management system.

### 1. course_types

**Purpose**: Master data for course offerings

**Attributes**:
- `name` (string, 100, required) - Course name (e.g., "Yoga", "HIIT")
- `description` (string, 5000) - Detailed course description
- `imageUrl` (string, 500) - Course promotional image URL
- `color` (string, 20, default: "#CC1303") - Brand color for UI
- `icon` (string, 50) - Emoji or icon identifier
- `duration` (integer, required, default: 60) - Duration in minutes
- `difficulty` (string, 50) - "Débutant", "Intermédiaire", "Avancé"
- `maxCapacity` (integer, default: 20) - Maximum participants
- `isActive` (boolean, required, default: true)

**Indexes**:
- `name_idx` on `name`
- `active_idx` on `isActive`

**Permissions**:
- Read: any
- Create/Update/Delete: admin

---

### 2. coaches

**Purpose**: Instructor profiles

**Attributes**:
- `name` (string, 100, required) - Coach full name
- `email` (string, 255) - Contact email
- `phone` (string, 20) - Contact phone
- `bio` (string, 2000) - Biography
- `photoUrl` (string, 500) - Profile photo URL
- `specialties` (string array, 500) - Course specializations
- `certification` (string, 500) - Certifications
- `isActive` (boolean, required, default: true)

**Indexes**:
- `name_idx` on `name`
- `active_idx` on `isActive`

**Permissions**:
- Read: any
- Create/Update/Delete: admin

---

### 3. schedule_sessions

**Purpose**: Individual scheduled class sessions

**Attributes**:
- `courseTypeId` (string, 255, required) - FK to course_types
- `coachId` (string, 255, required) - FK to coaches
- `dayOfWeek` (integer, required, min: 1, max: 7) - 1=Monday, 7=Sunday
- `startTime` (string, 10, required) - "HH:MM" format
- `endTime` (string, 10, required) - "HH:MM" format
- `location` (string, 100) - Room/area name
- `currentCapacity` (integer, default: 0) - Current attendees
- `isRecurring` (boolean, required, default: true) - Weekly repeat
- `effectiveDate` (string, 20) - Start date (YYYY-MM-DD)
- `expiryDate` (string, 20) - End date (YYYY-MM-DD)
- `status` (string, 50, default: "active") - "active", "cancelled", "full"
- `notes` (string, 1000) - Admin notes
- `isActive` (boolean, required, default: true)

**Indexes**:
- `day_idx` on `dayOfWeek`
- `course_idx` on `courseTypeId`
- `coach_idx` on `coachId`
- `active_idx` on `isActive`

**Permissions**:
- Read: any
- Create/Update/Delete: admin

---

### 4. schedule_config

**Purpose**: UI configuration for schedule display

**Attributes**:
- `sectionTitle` (string, 200, required) - Main heading
- `sectionSubtitle` (string, 500) - Subheading
- `displayDays` (string, 100, required) - JSON array [1,2,3,4,5]
- `dayLabels` (string, 500, required) - JSON object {1: "Lundi", ...}
- `timeFormat` (string, 10, default: "24h") - "24h" or "12h"
- `theme` (string, 2000) - JSON theme configuration
- `showCoachInfo` (boolean, default: true)
- `showCapacity` (boolean, default: false)
- `enableBooking` (boolean, default: false)
- `isActive` (boolean, default: true)

**Permissions**:
- Read: any
- Update: admin

---

## Environment Variables Required

Add these to `.env.local`:

```env
NEXT_PUBLIC_COURSE_TYPES_COLLECTION_ID=course_types
NEXT_PUBLIC_COACHES_COLLECTION_ID=coaches
NEXT_PUBLIC_SCHEDULE_SESSIONS_COLLECTION_ID=schedule_sessions
NEXT_PUBLIC_SCHEDULE_CONFIG_COLLECTION_ID=schedule_config
```

## Setup Instructions

1. Create collections in Appwrite Console
2. Configure attributes as specified above
3. Set up indexes for performance
4. Configure permissions
5. Run seed script to populate initial data
