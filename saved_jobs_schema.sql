-- ============================================
-- SAVED JOBS TABLE SETUP
-- TalentProPH Platform
-- ============================================

-- 1. Create the saved_jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT unique_saved_job UNIQUE (seeker_id, job_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- 3. Set up RLS Policies

-- Allow seekers to verify/select/insert/delete their own saved jobs
CREATE POLICY "Seekers can manage their saved jobs"
ON public.saved_jobs
FOR ALL
USING (auth.uid() = seeker_id)
WITH CHECK (auth.uid() = seeker_id);

-- Optional: Allow employers to see who saved their job? (Probably not needed for now, only seekers need access)
