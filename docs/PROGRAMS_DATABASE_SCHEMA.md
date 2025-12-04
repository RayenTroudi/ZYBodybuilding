# Programs Database Schema

## Overview
This document defines the database schema for the dynamic Programs management system. The system allows administrators to manage workout programs displayed on the homepage.

---

## Collection: `programs`

**Purpose**: Store workout program information displayed on the homepage

### Attributes

| Attribute | Type | Size | Required | Description |
|-----------|------|------|----------|-------------|
| `title` | String | 100 | ✅ | Program name (e.g., "Strength Training") |
| `description` | String | 500 | ✅ | Brief description of the program |
| `icon` | String | 10 | ❌ | Emoji icon (default: 🏋️) |
| `imageUrl` | String | 2000 | ❌ | Optional image URL for the program |
| `color` | String | 20 | ❌ | Accent color for the card (default: #CC1303) |
| `order` | Integer | - | ❌ | Display order (default: 0, lower = first) |
| `features` | String | 2000 | ❌ | JSON array of program features/benefits |
| `targetAudience` | String | 200 | ❌ | Who this program is for (e.g., "Beginners", "Advanced") |
| `duration` | String | 100 | ❌ | Typical duration (e.g., "4-6 weeks", "Ongoing") |
| `isActive` | Boolean | - | ❌ | Active status (default: true) |

### Indexes

| Key | Type | Attributes | Purpose |
|-----|------|------------|---------|
| `order_active` | ASC | `order`, `isActive` | Efficient ordered queries for active programs |
| `active` | - | `isActive` | Filter active programs |

### Permissions

**Read**:
- `users` (any authenticated user)
- Guest access for homepage display

**Write**:
- `team:admin_team` (admin role only)

**Update**:
- `team:admin_team`

**Delete**:
- `team:admin_team`

---

## Environment Variables

Add to `.env.local`:

```env
# Programs Collection
NEXT_PUBLIC_PROGRAMS_COLLECTION_ID=your_programs_collection_id
```

---

## API Endpoints

### Public Endpoints

#### GET `/api/programs`
Fetch all active programs ordered by `order` field.

**Response**:
```json
{
  "success": true,
  "programs": [
    {
      "$id": "...",
      "title": "Strength Training",
      "description": "Build strength and stamina.",
      "icon": "💪",
      "imageUrl": null,
      "color": "#CC1303",
      "order": 1,
      "features": "[\"Progressive overload\", \"Compound movements\"]",
      "targetAudience": "All levels",
      "duration": "8-12 weeks",
      "isActive": true
    }
  ]
}
```

### Admin Endpoints

#### GET `/api/admin/programs`
Fetch all programs (including inactive).

**Auth**: Required (admin role)

**Response**:
```json
{
  "success": true,
  "programs": [...]
}
```

#### POST `/api/admin/programs`
Create a new program.

**Auth**: Required (admin role)

**Request Body**:
```json
{
  "title": "HIIT Training",
  "description": "High intensity interval training.",
  "icon": "⚡",
  "color": "#FF5722",
  "order": 5,
  "features": ["Fat burning", "Cardio boost"],
  "targetAudience": "Intermediate",
  "duration": "4 weeks"
}
```

**Response**:
```json
{
  "success": true,
  "program": {...}
}
```

#### GET `/api/admin/programs/[id]`
Fetch a single program by ID.

**Auth**: Required (admin role)

#### PATCH `/api/admin/programs/[id]`
Update a program.

**Auth**: Required (admin role)

**Request Body** (partial updates supported):
```json
{
  "title": "Updated Title",
  "isActive": false
}
```

#### DELETE `/api/admin/programs/[id]`
Delete a program.

**Auth**: Required (admin role)

---

## Data Model Examples

### Strength Training
```json
{
  "title": "Strength Training",
  "description": "Build strength and stamina with progressive resistance training.",
  "icon": "💪",
  "color": "#CC1303",
  "order": 1,
  "features": "[\"Progressive overload\", \"Compound movements\", \"Muscle hypertrophy\"]",
  "targetAudience": "All levels",
  "duration": "8-12 weeks",
  "isActive": true
}
```

### Cardio Workouts
```json
{
  "title": "Cardio Workouts",
  "description": "Boost your endurance and cardiovascular health.",
  "icon": "🏃",
  "color": "#2196F3",
  "order": 2,
  "features": "[\"Heart health\", \"Endurance building\", \"Calorie burning\"]",
  "targetAudience": "All levels",
  "duration": "Ongoing",
  "isActive": true
}
```

### Body Building
```json
{
  "title": "Body Building",
  "description": "Achieve your dream physique with targeted muscle building.",
  "icon": "🏋️",
  "color": "#FFC107",
  "order": 3,
  "features": "[\"Muscle mass\", \"Symmetry\", \"Definition\"]",
  "targetAudience": "Intermediate to Advanced",
  "duration": "12+ weeks",
  "isActive": true
}
```

### Weight Loss
```json
{
  "title": "Weight Loss",
  "description": "Lose weight effectively with our comprehensive program.",
  "icon": "⚖️",
  "color": "#4CAF50",
  "order": 4,
  "features": "[\"Fat loss\", \"Metabolism boost\", \"Nutrition guidance\"]",
  "targetAudience": "All levels",
  "duration": "6-8 weeks",
  "isActive": true
}
```

---

## Validation Rules

### Title
- Required
- 3-100 characters
- Must be unique

### Description
- Required
- 10-500 characters

### Icon
- Optional
- Single emoji character
- Default: 🏋️

### Color
- Optional
- Valid hex color format (#RRGGBB)
- Default: #CC1303

### Order
- Optional
- Integer >= 0
- Default: 0

### Features
- Optional
- JSON array of strings
- Example: `["Feature 1", "Feature 2"]`

---

## Migration Notes

### Static Data to Migrate
From `Programs.js`:
1. Strength Training (💪)
2. Cardio Workouts (🏃)
3. Body Building (🏋️)
4. Weight Loss (⚖️)

### Migration Script
See `scripts/seed-programs.js` for automated migration.

---

## Admin UI Pages

### `/admin/programs`
- List all programs with status badges
- Quick edit inline
- Add new program button
- Drag-and-drop reordering

### `/admin/programs/new`
- Form to create new program
- Icon picker
- Color picker
- Features array input
- Preview card

### `/admin/programs/[id]`
- Edit existing program
- Delete confirmation
- Activity toggle
- Preview card

---

## Testing Checklist

- [ ] Create program via API
- [ ] Update program via API
- [ ] Delete program via API
- [ ] Fetch active programs (public)
- [ ] Fetch all programs (admin)
- [ ] Order validation
- [ ] Icon rendering
- [ ] Color application
- [ ] Features parsing
- [ ] Homepage display
- [ ] Admin panel CRUD
- [ ] Permissions enforcement
