# User Registration and Management System

## Overview
This system allows users to register accounts and enables admins to manage user roles and permissions through the admin panel.

## Features Implemented

### 1. User Registration
- **Registration Page**: `/register`
- Users can create accounts with name, email, and password
- Password validation (minimum 8 characters)
- Accounts are automatically saved to Appwrite Auth and Users collection
- Default role: `user`

### 2. Admin User Management
- **Users Management Page**: `/admin/users`
- View all registered users
- Filter users by role (Admin/User)
- Search users by name or email
- **Promote/Demote Users**: Change user roles between 'user' and 'admin'
- Delete users
- Real-time role updates

### 3. Authentication System
- Secure registration with Appwrite Auth
- User metadata stored in dedicated Users collection
- Role-based access control
- Session management

## Setup Instructions

### Step 1: Environment Variables
Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_USERS_COLLECTION_ID=users
```

### Step 2: Create Users Collection in Appwrite
Run the setup script to create the Users collection:

```bash
node scripts/setup-users-collection.js
```

This will create:
- Users collection with proper attributes
- Indexes for userId, email, and role
- Proper permissions

### Step 3: Manual Appwrite Setup (Alternative)
If you prefer to set up manually in Appwrite Console:

1. Go to your Appwrite Console
2. Navigate to your database
3. Create a new collection named "Users" (ID: `users`)
4. Add the following attributes:
   - `userId` (String, 255, Required)
   - `email` (String, 255, Required)
   - `name` (String, 255, Required)
   - `role` (String, 50, Required, Default: "user")
   - `createdAt` (String, 255, Required)

5. Create indexes:
   - Index on `userId` (key)
   - Index on `email` (key)
   - Index on `role` (key)

6. Set permissions:
   - Read: Any
   - Create: Any
   - Update: Any
   - Delete: Any

### Step 4: Make Your First Admin
After setting up, you need to make at least one user an admin:

**Option A: Using the script**
Create a script to promote a user to admin (you can add this to `scripts/make-admin.js`):

```javascript
require('dotenv').config({ path: '.env.local' });
const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function makeAdmin(email) {
  try {
    const { documents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID
    );
    
    const user = documents.find(u => u.email === email);
    
    if (!user) {
      console.error('User not found');
      return;
    }
    
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
      user.$id,
      { role: 'admin' }
    );
    
    console.log(`✅ ${email} is now an admin`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Replace with your email
makeAdmin('your-email@example.com');
```

**Option B: Directly in Appwrite Console**
1. Go to your Users collection
2. Find your user document
3. Edit the document
4. Change `role` field to `admin`

## Usage

### For Users
1. Visit `/register` to create an account
2. Fill in your name, email, and password
3. After registration, you'll be redirected to login
4. Login at `/admin/login`

### For Admins
1. Login at `/admin/login`
2. Navigate to "Users" in the admin sidebar
3. View all registered users
4. **To make someone an admin**: 
   - Find the user in the list
   - Use the role dropdown and select "Admin"
   - The change is applied immediately
5. **To demote an admin to user**:
   - Find the admin in the list
   - Use the role dropdown and select "User"
6. **To delete a user**:
   - Click the "Delete" button
   - Confirm the deletion

## File Structure

### New Files Created
```
src/
├── app/
│   ├── register/
│   │   └── page.js                        # User registration page
│   ├── admin/
│   │   └── users/
│   │       └── page.js                    # Admin users management
│   └── api/
│       ├── auth/
│       │   └── register/
│       │       └── route.js               # Registration API endpoint
│       └── admin/
│           └── users/
│               ├── route.js               # List/Create users API
│               └── [id]/
│                   └── route.js           # Get/Update/Delete user API
├── lib/
│   └── auth.js                            # Updated with register function
└── scripts/
    └── setup-users-collection.js         # Setup script for Users collection
```

### Updated Files
- `src/lib/appwrite/config.js` - Added usersCollectionId
- `src/lib/auth.js` - Added register function
- `src/app/admin/layout.js` - Added Users navigation item
- `src/app/admin/login/page.js` - Added link to registration page

## API Endpoints

### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### GET `/api/admin/users`
Get all users (Admin only)

### GET `/api/admin/users/[id]`
Get single user (Admin only)

### PATCH `/api/admin/users/[id]`
Update user role (Admin only)
```json
{
  "role": "admin"
}
```

### DELETE `/api/admin/users/[id]`
Delete user (Admin only)

## Security Features

1. **Password Validation**: Minimum 8 characters
2. **Role-Based Access**: Only admins can access user management
3. **Secure Storage**: Passwords hashed by Appwrite Auth
4. **Session Management**: HTTP-only cookies for security
5. **Admin Verification**: `requireAdmin()` middleware protects admin routes

## Role Types

- **user**: Regular user with basic access
- **admin**: Full administrative access to:
  - User management
  - Member management
  - Payment management
  - All other admin features

## Troubleshooting

### "Collection not found" error
- Make sure you've run `node scripts/setup-users-collection.js`
- Verify `NEXT_PUBLIC_USERS_COLLECTION_ID` is in your `.env.local`

### "Unauthorized" error
- Make sure your user has admin role
- Check that you're logged in
- Verify the session cookie exists

### Can't promote users to admin
- Ensure you're logged in as an admin
- Check browser console for errors
- Verify API key has proper permissions in Appwrite

### Registration fails
- Check password length (minimum 8 characters)
- Ensure email is unique
- Verify Appwrite connection

## Next Steps

1. Run the setup script
2. Register your first account
3. Manually promote yourself to admin in Appwrite Console
4. Login and test the user management features
5. Register more users and manage them through the admin panel

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify Appwrite collections and permissions
4. Ensure all environment variables are set correctly
