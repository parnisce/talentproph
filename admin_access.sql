-- ============================================
-- ADMIN ACCESS MANAGEMENT SQL SCRIPTS
-- TalentProPH Platform
-- ============================================

-- ============================================
-- OPTION 1: Grant Admin Access to Existing User by Email
-- ============================================
-- Replace 'user@example.com' with the actual email address

UPDATE profiles 
SET role = 'admin'
WHERE email = 'user@example.com';

-- Example:
-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE email = 'cyryl.bitangcol@gmail.com';


-- ============================================
-- OPTION 2: Grant Admin Access by User ID
-- ============================================
-- Replace 'user-uuid-here' with the actual user ID

UPDATE profiles 
SET role = 'admin'
WHERE id = 'user-uuid-here';


-- ============================================
-- OPTION 3: Create New Admin User
-- ============================================
-- This creates a completely new admin account
-- Note: You'll need to set a password through Supabase Auth separately

INSERT INTO profiles (
    id,
    email,
    name,
    role,
    photo,
    created_at
) VALUES (
    gen_random_uuid(),
    'admin@talentproph.com',
    'Admin User',
    'admin',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    NOW()
);


-- ============================================
-- OPTION 4: Grant Admin to Multiple Users at Once
-- ============================================
-- Replace emails with actual user emails

UPDATE profiles 
SET role = 'admin'
WHERE email IN (
    'admin1@example.com',
    'admin2@example.com',
    'admin3@example.com'
);


-- ============================================
-- OPTION 5: Promote First Registered User to Admin
-- ============================================
-- Useful for initial setup

UPDATE profiles 
SET role = 'admin'
WHERE id = (
    SELECT id 
    FROM profiles 
    ORDER BY created_at ASC 
    LIMIT 1
);


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all admin users
SELECT id, email, name, role, created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Check specific user's role
SELECT id, email, name, role
FROM profiles
WHERE email = 'user@example.com';

-- Count users by role
SELECT role, COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;


-- ============================================
-- REVOKE ADMIN ACCESS (If needed)
-- ============================================

-- Demote admin back to employer
UPDATE profiles 
SET role = 'employer'
WHERE email = 'user@example.com';

-- Demote admin back to seeker
UPDATE profiles 
SET role = 'seeker'
WHERE email = 'user@example.com';


-- ============================================
-- SAFETY: Ensure at least one admin exists
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
        -- If no admin exists, promote the first user
        UPDATE profiles 
        SET role = 'admin'
        WHERE id = (
            SELECT id 
            FROM profiles 
            ORDER BY created_at ASC 
            LIMIT 1
        );
        RAISE NOTICE 'No admin found. First user has been promoted to admin.';
    ELSE
        RAISE NOTICE 'Admin user(s) already exist.';
    END IF;
END $$;


-- ============================================
-- RECOMMENDED: Quick Admin Setup
-- ============================================
-- Use this for your personal account
-- Replace with your actual email

UPDATE profiles 
SET role = 'admin'
WHERE email = 'cyryl.bitangcol@gmail.com';

-- Verify the change
SELECT 
    id, 
    email, 
    name, 
    role, 
    created_at,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin Access Granted'
        ELSE '❌ Not Admin'
    END as status
FROM profiles
WHERE email = 'cyryl.bitangcol@gmail.com';
