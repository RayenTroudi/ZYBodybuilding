# 🚀 Vercel Deployment Setup - Admin Login Fix

## Problem
Your admin login is not working on Vercel because the **Appwrite environment variables** are missing.

---

## ✅ Solution: Add Environment Variables to Vercel

### Step-by-Step Instructions:

#### 1. **Go to Your Vercel Project Settings**
   - Open [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your **ZYBodybuilding** project
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

#### 2. **Add Each Environment Variable**

Copy and paste these variables **one by one**:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | `690ce00900173a1d9ac7` | Production, Preview, Development |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | `https://cloud.appwrite.io/v1` | Production, Preview, Development |
| `APPWRITE_API_KEY` | `standard_06281a25e8d6f2ea2dc4a5c0bfdb760ec27017f4297fd6753e8e46a5edc500c9009a5c1e8c213d8acc7c9a92faa5b5b086c0b6bf479f1c68bf3d3e959be292eaa339a011fd619220cb07fdf02c2cee9fac2059c33b19434ecc5f185018c7d071654cd1f944efddbe68f015cbe27b496f0e66defe8c4f79553956a3e924ebb6b4` | Production, Preview, Development |
| `NEXT_PUBLIC_DATABASE_ID` | `gym_management_db` | Production, Preview, Development |
| `NEXT_PUBLIC_MEMBERS_COLLECTION_ID` | `members` | Production, Preview, Development |
| `NEXT_PUBLIC_PAYMENTS_COLLECTION_ID` | `payments` | Production, Preview, Development |
| `NEXT_PUBLIC_PLANS_COLLECTION_ID` | `plans` | Production, Preview, Development |

#### 3. **For Each Variable:**
   - Click **"Add New"** button
   - Enter the **Name** (e.g., `NEXT_PUBLIC_APPWRITE_PROJECT_ID`)
   - Enter the **Value** (from table above)
   - Select **All Environments** (Production, Preview, Development)
   - Click **Save**

#### 4. **Redeploy Your Application**
   After adding all variables:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on your latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete (~2-3 minutes)

---

## 🔐 Quick Copy-Paste Format

If Vercel allows bulk import, use this format:

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=690ce00900173a1d9ac7
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_API_KEY=standard_06281a25e8d6f2ea2dc4a5c0bfdb760ec27017f4297fd6753e8e46a5edc500c9009a5c1e8c213d8acc7c9a92faa5b5b086c0b6bf479f1c68bf3d3e959be292eaa339a011fd619220cb07fdf02c2cee9fac2059c33b19434ecc5f185018c7d071654cd1f944efddbe68f015cbe27b496f0e66defe8c4f79553956a3e924ebb6b4
NEXT_PUBLIC_DATABASE_ID=gym_management_db
NEXT_PUBLIC_MEMBERS_COLLECTION_ID=members
NEXT_PUBLIC_PAYMENTS_COLLECTION_ID=payments
NEXT_PUBLIC_PLANS_COLLECTION_ID=plans
```

---

## 🧪 Verify It's Working

After redeployment:

1. **Open your Vercel site**: `https://your-site.vercel.app`
2. **Go to admin login**: `https://your-site.vercel.app/admin/login`
3. **Try logging in** with your Appwrite admin credentials
4. **Check browser console** (F12 → Console) - should see no errors

---

## 🔍 Troubleshooting

### Still can't login?

#### Check 1: Verify Appwrite Connection
Open browser console (F12) and check for errors like:
- `Failed to fetch`
- `CORS error`
- `Invalid API key`

#### Check 2: Verify Appwrite Project Settings
1. Log into [Appwrite Console](https://cloud.appwrite.io)
2. Go to your project (`690ce00900173a1d9ac7`)
3. Click **Settings** → **Platforms**
4. Add your Vercel domain:
   - Platform: **Web App**
   - Name: `Vercel Production`
   - Hostname: `your-site.vercel.app` (replace with actual domain)
   - Click **Add Platform**

#### Check 3: Verify Admin User Exists
1. In Appwrite Console → **Auth** → **Users**
2. Find your admin user
3. Click on user → **Teams** tab
4. Verify user is in `admin_team` team

#### Check 4: Create Admin Team (if missing)
If the `admin_team` doesn't exist:
1. In Appwrite Console → **Auth** → **Teams**
2. Click **Create Team**
3. Name: `admin_team`
4. Team ID: `admin_team` (exactly this)
5. Add your admin user to this team

---

## 📱 Admin Credentials

Make sure you're using credentials from an Appwrite user account:
- Email: Your Appwrite user email
- Password: Your Appwrite user password

**Note**: This is NOT a hardcoded username/password. You must have created a user in your Appwrite project.

---

## 🎯 Expected Behavior After Fix

✅ Admin login page loads without errors  
✅ Can submit login form  
✅ Successful login redirects to `/admin/dashboard`  
✅ Dashboard loads with member data  
✅ Can navigate admin pages  

---

## ⚠️ Security Note

The API key in this file is sensitive. Make sure to:
- ✅ Add `VERCEL_SETUP.md` to `.gitignore` if sharing repository
- ✅ Keep your Appwrite API key private
- ✅ Regenerate API key if exposed publicly

---

## 📞 Need Help?

If login still doesn't work after following these steps, check:
1. Vercel deployment logs for errors
2. Appwrite Console → **Logs** for authentication errors
3. Browser console (F12) for client-side errors

The error message on login page will tell you what's wrong:
- "Failed to fetch" = Environment variables not set correctly
- "Invalid credentials" = Wrong email/password
- "Unauthorized" = User not in admin_team

---

**Last Updated**: November 11, 2025  
**Status**: Ready for deployment ✅
