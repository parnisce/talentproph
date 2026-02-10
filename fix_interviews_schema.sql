-- ===========================================
-- MASTER RE-SYNC: INTERVIEWS TABLE
-- Run this if you get "column not found" errors
-- ===========================================

-- 1. CLEANUP (Only if you want a fresh start)
DROP TABLE IF EXISTS public.interviews;

-- 2. CREATE TABLE WITH EXACT COLUMNS
CREATE TABLE public.interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE NOT NULL,
    employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    location_type TEXT DEFAULT 'Virtual' CHECK (location_type IN ('Virtual', 'In-Person', 'Phone')),
    location_details TEXT, -- Zoom/Google Meet link or address
    notes TEXT,
    status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled'))
);

-- 3. ENABLE SECURITY
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- 4. PERMISSIONS
-- Employers can do EVERYTHING with their interviews
CREATE POLICY "Employers can manage their interviews"
ON public.interviews
FOR ALL
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);

-- Seekers can see interviews they are invited to
CREATE POLICY "Seekers can view their interviews"
ON public.interviews
FOR SELECT
USING (auth.uid() = seeker_id);

-- 5. REFRESH API CACHE HINT
-- If error persists, go to Supabase -> Settings -> API -> "Reload PostgREST" (at bottom)
