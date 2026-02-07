# 🔑 Admin Access Setup Guide

## Quick Start (Recommended)

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**

### Step 2: Run the Admin Grant Query

**For your personal account:**
```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'cyryl.bitangcol@gmail.com';
```

**For any other user:**
```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'their-email@example.com';
```

### Step 3: Verify Admin Access
```sql
SELECT id, email, name, role
FROM profiles
WHERE role = 'admin';
```

---

## Alternative Methods

### Method 1: By Email (Most Common)
```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'user@example.com';
```

### Method 2: By User ID
```sql
UPDATE profiles 
SET role = 'admin'
WHERE id = 'uuid-here';
```

### Method 3: Promote First User (Initial Setup)
```sql
UPDATE profiles 
SET role = 'admin'
WHERE id = (
    SELECT id FROM profiles 
    ORDER BY created_at ASC 
    LIMIT 1
);
```

---

## How to Use

### Via Supabase Dashboard:
1. **Login to Supabase** → https://supabase.com
2. **Select your project** → TalentProPH
3. **Go to SQL Editor** (left sidebar)
4. **Paste the SQL query**
5. **Click "Run"** or press `Ctrl+Enter`
6. **Check results** → Should show "Success. 1 rows affected"

### Via Supabase CLI (Advanced):
```bash
supabase db execute --file admin_access.sql
```

---

## Verification

After running the query, verify with:

```sql
-- Check if admin role was granted
SELECT 
    email, 
    name, 
    role,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin'
        WHEN role = 'employer' THEN '👔 Employer'
        WHEN role = 'seeker' THEN '🔍 Seeker'
    END as role_status
FROM profiles
WHERE email = 'your-email@example.com';
```

Expected result:
```
email                      | name       | role  | role_status
---------------------------|------------|-------|-------------
cyryl.bitangcol@gmail.com | Your Name  | admin | ✅ Admin
```

---

## Testing Admin Access

1. **Logout** from your current session
2. **Login** with the admin account
3. **Navigate to** `/admin`
4. **Should see** → Admin Dashboard (not redirected)

---

## Troubleshooting

### Issue: "No rows affected"
**Cause**: Email doesn't exist in database  
**Solution**: 
1. Check if user is registered:
   ```sql
   SELECT email, role FROM profiles WHERE email = 'your-email@example.com';
   ```
2. If not found, user needs to register first at `/register`

### Issue: Still can't access /admin
**Possible causes**:
1. **Browser cache** → Clear cache or use incognito mode
2. **Not logged out/in** → Logout and login again
3. **Wrong email** → Double-check the email in the SQL query

### Issue: Multiple admins needed
```sql
UPDATE profiles 
SET role = 'admin'
WHERE email IN (
    'admin1@example.com',
    'admin2@example.com',
    'admin3@example.com'
);
```

---

## Security Best Practices

✅ **DO:**
- Grant admin access only to trusted users
- Keep a record of who has admin access
- Regularly audit admin users
- Use strong passwords for admin accounts

❌ **DON'T:**
- Share admin credentials
- Grant admin to test accounts
- Leave unused admin accounts active

---

## Revoking Admin Access

If you need to remove admin access:

```sql
-- Demote to employer
UPDATE profiles 
SET role = 'employer'
WHERE email = 'user@example.com';

-- Or demote to seeker
UPDATE profiles 
SET role = 'seeker'
WHERE email = 'user@example.com';
```

---

## Quick Reference

| Action | SQL Command |
|--------|-------------|
| Grant Admin | `UPDATE profiles SET role = 'admin' WHERE email = '...'` |
| Check Admins | `SELECT * FROM profiles WHERE role = 'admin'` |
| Revoke Admin | `UPDATE profiles SET role = 'employer' WHERE email = '...'` |
| Count by Role | `SELECT role, COUNT(*) FROM profiles GROUP BY role` |

---

**Need Help?** Check `admin_access.sql` for more examples and options.
