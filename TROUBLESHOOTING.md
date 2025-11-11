# 🔍 Admin Login Troubleshooting Guide

## 🚀 Quick Diagnosis Steps

I've added **debugging tools** to help identify the exact issue. Follow these steps:

---

## Step 1: Test Appwrite Connection

### On Vercel (After Deployment):

1. **Visit the test page**: `https://your-vercel-url.vercel.app/admin/test-connection`
2. **Click "Run Connection Test"**
3. **Check the results**:
   - ✅ All green checkmarks = Configuration is correct
   - ❌ Red X marks = Configuration issue (see fixes below)

---

## Step 2: Check Browser Console Logs

### On Vercel:

1. Open your site: `https://your-vercel-url.vercel.app/admin/login`
2. Open **Developer Tools** (Press F12)
3. Go to **Console** tab
4. Try logging in
5. **Look for emoji logs**:
   ```
   🔐 Attempting login...
   🔧 Creating admin client...
   🔑 Creating email/password session...
   ✅ Session created: [session-id]
   🍪 Setting session cookie...
   ✅ Cookie set successfully
   ```

### What the logs mean:

| Log Message | Meaning | Fix |
|-------------|---------|-----|
| `🔐 Attempting login...` | Login started | ✅ Working |
| `❌ SignIn error: Invalid credentials` | Wrong email/password | Use correct Appwrite credentials |
| `❌ SignIn error: Project not found` | Wrong `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Check Vercel env vars |
| `❌ SignIn error: Failed to fetch` | Can't reach Appwrite | Check `NEXT_PUBLIC_APPWRITE_ENDPOINT` |
| `❌ SignIn error: Invalid API key` | Wrong `APPWRITE_API_KEY` | Regenerate API key in Appwrite |
| `✅ Session created` but redirect fails | Cookie issue | See Step 3 |
| `❌ No session cookie found` | Cookie not being set | See Step 3 |

---

## Step 3: Common Issues & Fixes

### Issue 1: "Invalid credentials" ❌

**Problem**: Wrong email or password

**Fix**:
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project (`690ce00900173a1d9ac7`)
3. Go to **Auth** → **Users**
4. Find your user or create a new one:
   - Click **"Create user"**
   - Add email and password
   - Save user ID
5. Go to **Auth** → **Teams**
6. Find or create `admin_team` (exact ID must be `admin_team`)
7. Add your user to this team

---

### Issue 2: "Project not found" or "Invalid project ID" ❌

**Problem**: `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is wrong or missing

**Fix**:
1. In Vercel → Settings → Environment Variables
2. Check `NEXT_PUBLIC_APPWRITE_PROJECT_ID` = `690ce00900173a1d9ac7`
3. If missing or different, update it
4. **Redeploy** (Deployments tab → ⋯ → Redeploy)

---

### Issue 3: "Failed to fetch" or Network Error ❌

**Problem**: Can't connect to Appwrite endpoint

**Fix**:
1. In Vercel → Settings → Environment Variables
2. Check `NEXT_PUBLIC_APPWRITE_ENDPOINT` = `https://cloud.appwrite.io/v1`
3. Make sure there's **no trailing slash**
4. **Redeploy**

---

### Issue 4: Login succeeds but redirect fails ❌

**Problem**: Session cookie not being set or not being read

**Possible Causes**:
1. Cookie `sameSite` or `secure` issues in production
2. Domain mismatch
3. Vercel Edge Runtime limitations

**Fix Option A - Check Cookie Settings**:
1. Open DevTools → **Application** tab
2. Go to **Cookies** in left sidebar
3. Select your Vercel domain
4. Look for `session` cookie
5. If missing after login = cookie setting issue

**Fix Option B - Verify Vercel Runtime**:
1. Open `src/app/admin/dashboard/page.js`
2. Add this at the top:
   ```javascript
   export const runtime = 'nodejs'; // Force Node.js runtime
   ```
3. Commit and push
4. Redeploy

---

### Issue 5: "User is not admin" ❌

**Problem**: User logged in but not in admin team

**Fix**:
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Go to **Auth** → **Teams**
4. Check if `admin_team` exists:
   - **Team ID must be exactly**: `admin_team` (not "Admin Team" or "admin-team")
   - If wrong ID, delete team and recreate with correct ID
5. Click on `admin_team`
6. Click **"Add Member"**
7. Search for your user email
8. Add user to team

---

### Issue 6: Environment Variables Not Working ❌

**Problem**: Variables added but still not available

**Fix**:
1. In Vercel, check that ALL variables have:
   - ✅ Production checked
   - ✅ Preview checked
   - ✅ Development checked
2. **CRITICAL**: After adding/changing env vars, you MUST:
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment
   - Click **"Redeploy"**
   - Wait for completion
   - Variables only load on NEW deployments!

---

## Step 4: Verify Appwrite Platform Settings

Your Vercel domain must be registered in Appwrite:

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select project `690ce00900173a1d9ac7`
3. Go to **Settings** → **Platforms**
4. Click **"Add Platform"**
5. Select **"Web App"**
6. Enter details:
   - **Name**: `Vercel Production`
   - **Hostname**: Your Vercel URL (e.g., `zy-gym.vercel.app`)
     - ⚠️ Do NOT include `https://`
     - ⚠️ Do NOT include trailing slash
     - ⚠️ Example: `my-gym-app.vercel.app` ✅
     - ⚠️ NOT: `https://my-gym-app.vercel.app/` ❌
7. Click **"Add Platform"**
8. Try logging in again

---

## Step 5: Check Vercel Deployment Logs

If login still fails:

1. In Vercel → **Deployments** tab
2. Click on your latest deployment
3. Go to **Functions** tab
4. Look for errors related to:
   - `/admin/login`
   - `/admin/dashboard`
   - Appwrite connection errors
5. Share any errors you find

---

## 🧪 Test Locally First

Before testing on Vercel, verify it works locally:

```powershell
# Make sure you have .env.local with all variables
npm run dev

# Open browser to http://localhost:3000/admin/login
# Try logging in
# Check console for debug logs
```

If it works locally but not on Vercel = environment variable issue

---

## 📋 Complete Checklist

Before asking for help, verify:

- [ ] All 7 environment variables added to Vercel
- [ ] All variables have Production + Preview + Development checked
- [ ] Redeployed after adding variables
- [ ] Vercel domain added to Appwrite Platforms
- [ ] User exists in Appwrite Auth → Users
- [ ] Team `admin_team` exists with exact ID
- [ ] User is member of `admin_team`
- [ ] Tested connection page shows all ✅
- [ ] Checked browser console logs
- [ ] Checked Vercel deployment logs

---

## 🆘 Still Not Working?

Share the following information:

1. **Test Connection Results**: Screenshot from `/admin/test-connection`
2. **Browser Console Logs**: Copy the emoji logs from login attempt
3. **Error Message**: What error shows on the login page?
4. **Vercel Logs**: Any errors in deployment logs?

---

**Last Updated**: November 11, 2025  
**Debug Tools Added**: ✅ Connection test page, Console logging
