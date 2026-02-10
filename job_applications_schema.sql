-- ============================================
-- JOB APPLICATIONS TABLE SETUP
-- TalentProPH Platform
-- ============================================

-- 1. Create the job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    job_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE NOT NULL,
    seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT,
    message TEXT,
    contact_info TEXT,
    points_used INTEGER DEFAULT 0,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Shortlisted', 'Interviewed', 'Hired', 'Contracted', 'Rejected'))
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 3. Set up RLS Policies

-- Allow seekers to insert their own applications
CREATE POLICY "Seekers can insert their own applications"
ON public.job_applications
FOR INSERT
WITH CHECK (auth.uid() = seeker_id);

-- Allow seekers to view their own applications
CREATE POLICY "Seekers can view their own applications"
ON public.job_applications
FOR SELECT
USING (auth.uid() = seeker_id);

-- Allow employers to view applications for their own jobs
CREATE POLICY "Employers can view applications for their jobs"
ON public.job_applications
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.job_posts
        WHERE public.job_posts.id = public.job_applications.job_id
        AND public.job_posts.employer_id = auth.uid()
    )
);

-- Allow employers to update application status (e.g., Shortlist, Interviewed)
CREATE POLICY "Employers can update application status"
ON public.job_applications
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.job_posts
        WHERE public.job_posts.id = public.job_applications.job_id
        AND public.job_posts.employer_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.job_posts
        WHERE public.job_posts.id = public.job_applications.job_id
        AND public.job_posts.employer_id = auth.uid()
    )
);

-- 4. Notify about cache refresh
-- PostgREST usually refreshes the schema cache automatically when a table is created.
-- If you still see the error, you can try running:
-- NOTIFY pgrst, 'reload schema';
