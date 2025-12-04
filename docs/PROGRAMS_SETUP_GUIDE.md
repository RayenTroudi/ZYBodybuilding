# Programs Module Setup Guide

This guide will help you set up the dynamic Programs management system.

## Overview

The Programs module allows administrators to manage workout programs displayed on the homepage through a full CRUD admin interface.

---

## 1. Database Setup (Appwrite)

### Create Programs Collection

1. Log in to your Appwrite Console
2. Navigate to your database
3. Click "Add Collection"
4. Name: `programs`
5. Collection ID: Copy this for your environment variables

### Add Attributes

Create the following attributes:

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| `title` | String | 100 | ✅ Yes | - |
| `description` | String | 500 | ✅ Yes | - |
| `icon` | String | 10 | ❌ No | 🏋️ |
| `imageUrl` | String | 2000 | ❌ No | - |
| `color` | String | 20 | ❌ No | #CC1303 |
| `order` | Integer | - | ❌ No | 0 |
| `features` | String | 2000 | ❌ No | - |
| `targetAudience` | String | 200 | ❌ No | - |
| `duration` | String | 100 | ❌ No | - |
| `isActive` | Boolean | - | ❌ No | true |

### Create Indexes

1. **Index 1**: `order_active`
   - Type: Key
   - Attributes: `order` (ASC), `isActive` (ASC)

2. **Index 2**: `active`
   - Type: Key
   - Attributes: `isActive` (ASC)

### Set Permissions

**Read Permissions:**
- Role: `users` (any authenticated user)
- Add guest access for public viewing

**Create Permissions:**
- Role: `team:admin_team`

**Update Permissions:**
- Role: `team:admin_team`

**Delete Permissions:**
- Role: `team:admin_team`

---

## 2. Environment Variables

Add to your `.env.local` file:

```env
# Programs Collection
NEXT_PUBLIC_PROGRAMS_COLLECTION_ID=your_programs_collection_id_here
```

Replace `your_programs_collection_id_here` with the actual Collection ID from Appwrite.

---

## 3. Seed Initial Data

Run the seed script to migrate static programs to the database:

```bash
node scripts/seed-programs.js
```

This will create 4 initial programs:
- Strength Training 💪
- Cardio Workouts 🏃
- Body Building 🏋️
- Weight Loss ⚖️

**Note:** Ensure you have `APPWRITE_API_KEY` in your environment variables for the seed script to work.

---

## 4. File Structure

```
src/app/
├── api/
│   ├── programs/
│   │   └── route.js                    # Public API (GET active programs)
│   └── admin/
│       └── programs/
│           ├── route.js                # Admin API (GET all, POST create)
│           └── [id]/
│               └── route.js            # Admin API (GET, PATCH, DELETE)
├── admin/
│   └── programs/
│       ├── page.js                     # Programs list + management
│       ├── new/
│       │   └── page.js                 # Create new program form
│       └── [id]/
│           └── page.js                 # Edit program form
└── components/
    └── Programs.js                      # Dynamic homepage component

scripts/
└── seed-programs.js                     # Database seed script

docs/
└── PROGRAMS_DATABASE_SCHEMA.md         # Complete schema documentation
```

---

## 5. Testing the Setup

### Test Public API

```bash
curl http://localhost:3000/api/programs
```

Expected response:
```json
{
  "success": true,
  "programs": [...]
}
```

### Test Admin Panel

1. Navigate to: `http://localhost:3000/admin/programs`
2. You should see the list of programs
3. Click "Add Program" to create a new one
4. Click "Edit" on any program to modify it
5. Toggle active/inactive status
6. Delete programs (with confirmation)

### Test Homepage

1. Navigate to: `http://localhost:3000`
2. Scroll to "Our Programs" section
3. You should see programs loaded from the database
4. Programs should display with custom colors and icons

---

## 6. Admin Features

### Programs List (`/admin/programs`)
- View all programs (active and inactive)
- Status badges (green for active, gray for inactive)
- Quick actions: Edit, Activate/Deactivate, Delete
- Color-coded borders matching program colors
- Icon display
- Metadata (target audience, duration, order)

### Create Program (`/admin/programs/new`)
- Title and description (required)
- Icon picker (emoji)
- Color picker (hex color)
- Target audience and duration
- Display order (lower = first)
- Active status toggle
- Live preview card

### Edit Program (`/admin/programs/[id]`)
- Pre-filled form with existing data
- Same features as create
- Delete button with confirmation
- Live preview

---

## 7. API Endpoints

### Public Endpoints

#### `GET /api/programs`
Fetch all active programs ordered by `order` field.

**Response:**
```json
{
  "success": true,
  "programs": [
    {
      "$id": "...",
      "title": "Strength Training",
      "description": "Build strength and stamina.",
      "icon": "💪",
      "color": "#CC1303",
      "order": 1,
      "isActive": true
    }
  ]
}
```

### Admin Endpoints (Require Authentication)

#### `GET /api/admin/programs`
Fetch all programs (including inactive).

#### `POST /api/admin/programs`
Create a new program.

**Request Body:**
```json
{
  "title": "HIIT Training",
  "description": "High intensity interval training.",
  "icon": "⚡",
  "color": "#FF5722",
  "order": 5
}
```

#### `GET /api/admin/programs/[id]`
Fetch a single program.

#### `PATCH /api/admin/programs/[id]`
Update a program (partial updates supported).

#### `DELETE /api/admin/programs/[id]`
Delete a program.

---

## 8. Validation Rules

### Title
- Required
- Minimum 3 characters
- Maximum 100 characters

### Description
- Required
- Minimum 10 characters
- Maximum 500 characters

### Icon
- Optional (default: 🏋️)
- Single emoji character
- Maximum 10 characters (for multi-byte emojis)

### Color
- Optional (default: #CC1303)
- Hex color format
- Maximum 20 characters

### Order
- Optional (default: 0)
- Integer >= 0
- Lower numbers display first

---

## 9. Troubleshooting

### Programs Not Showing on Homepage

1. Check if programs exist in database
2. Verify programs have `isActive: true`
3. Check browser console for API errors
4. Verify environment variable is set correctly

### Cannot Create/Edit Programs

1. Verify you're logged in as admin
2. Check admin team permissions in Appwrite
3. Check browser console for API errors
4. Verify `APPWRITE_API_KEY` is set for server routes

### Seed Script Fails

1. Ensure `APPWRITE_API_KEY` is in `.env.local`
2. Verify collection ID is correct
3. Check Appwrite server status
4. Run with: `node scripts/seed-programs.js`

---

## 10. Customization

### Add More Fields

1. Add attribute in Appwrite collection
2. Update API routes to handle new field
3. Update admin forms to include input
4. Update frontend component to display field

### Change Default Values

Edit these files:
- `src/app/api/admin/programs/route.js` (API defaults)
- `src/app/admin/programs/new/page.js` (Form defaults)
- `scripts/seed-programs.js` (Seed data)

### Styling

- Colors: Defined in Tailwind config
- Animations: Framer Motion in `Programs.js`
- Card styling: Edit component classes

---

## 11. Best Practices

1. **Always set display order** to control program appearance
2. **Use descriptive titles** for better UX
3. **Keep descriptions concise** (under 200 chars for best display)
4. **Test color contrast** to ensure readability
5. **Use relevant emojis** that match program theme
6. **Deactivate instead of delete** to preserve history
7. **Review changes in preview** before saving

---

## 12. Next Steps

- Add image upload support for program cards
- Implement drag-and-drop reordering
- Add program categories/tags
- Create program details page with more info
- Add analytics tracking
- Implement bulk actions

---

For detailed database schema, see `docs/PROGRAMS_DATABASE_SCHEMA.md`
