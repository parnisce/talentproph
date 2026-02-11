-- RE-DEFINE ALL POLICIES FOR JOB_POSTS TO FIX "NEW ROW VIOLATES RLS" error

-- 1. Enable RLS
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to ensure a clean slate
-- (We use separate statements to avoid errors if they don't exist)
DROP POLICY IF EXISTS "Employers can update their own job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Employers can insert reviews" ON public.job_posts; -- unlikely but checking
DROP POLICY IF EXISTS "Public can view active job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Employers can view own job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Employers can insert job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Employers can delete their own job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.job_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.job_posts;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.job_posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.job_posts;

-- 3. Create NEW, CORRECT policies

-- A. VIEW (SELECT)
-- Logic: Anyone can see 'active' jobs. Employers can see ALL jobs they own (including paused/draft).
CREATE POLICY "View Policy" ON public.job_posts
FOR SELECT USING (
  status = 'active' 
  OR 
  auth.uid() = employer_id
);

-- B. INSERT
-- Logic: Authenticated users (employers) can create jobs, provided they assign them to themselves.
CREATE POLICY "Insert Policy" ON public.job_posts
FOR INSERT WITH CHECK (
  auth.uid() = employer_id
);

-- C. UPDATE (The one causing the error)
-- Logic: Employers can update their own jobs. 
-- WE DO NOT LIMIT columns or status values here (other than check constraints).
CREATE POLICY "Update Policy" ON public.job_posts
FOR UPDATE USING (
  auth.uid() = employer_id
);

-- D. DELETE
-- Logic: Employers can delete their own jobs.
CREATE POLICY "Delete Policy" ON public.job_posts
FOR DELETE USING (
  auth.uid() = employer_id
);

-- 4. Ensure the 'status' column allows the new values
-- We prefer dropping the constraint if it exists to allow flexibility, or updating it.
DO $$ 
BEGIN
    -- Try to drop the constraint if it uses the standard naming convention or if we can identify it
    -- For now, we will perform a safe alter to text if possible or add the constraint
    
    -- First, let's just make sure the check allows our values.
    -- We drop the constraint named 'job_posts_status_check' if it exists.
    BEGIN
        ALTER TABLE public.job_posts DROP CONSTRAINT job_posts_status_check;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
END $$;

-- Re-add the constraint with 'paused' included
ALTER TABLE public.job_posts 
ADD CONSTRAINT job_posts_status_check 
CHECK (status IN ('active', 'paused', 'closed', 'draft', 'archived'));
