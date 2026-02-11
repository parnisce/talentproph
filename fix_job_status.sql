
-- Enable RLS on job_posts if not already enabled
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing update policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Employers can update their own job posts" ON public.job_posts;

-- Create a comprehensive update policy for employers
CREATE POLICY "Employers can update their own job posts" 
ON public.job_posts 
FOR UPDATE 
USING (auth.uid() = employer_id);

-- Check if status column has a constraint and drop it if needed
-- (This part is tricky without knowing the constraint name, but we can try to drop a common one if it was named predictably, 
--  or we can just alter the column to ensure it accepts the new value)

-- We can drop the check constraint if we can find it. 
-- Alternatively, we can just alter the column to be of type text, which drops constraints on some DBs or just ensures it's text.
-- But safer is to just add the value if it's an enum, or do nothing if it's text.

-- Let's try to remove any check constraint on status column specifically.
-- This block attempts to find and drop the constraint safely.
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.constraint_column_usage 
        WHERE table_name = 'job_posts' AND column_name = 'status'
    ) LOOP 
        EXECUTE 'ALTER TABLE public.job_posts DROP CONSTRAINT ' || quote_ident(r.constraint_name); 
    END LOOP; 
END $$;

-- Optional: Re-add a constraint that includes 'paused' if you want to enforce values
ALTER TABLE public.job_posts 
ADD CONSTRAINT job_posts_status_check 
CHECK (status IN ('active', 'paused', 'closed', 'draft', 'archived'));
