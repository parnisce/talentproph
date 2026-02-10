-- ============================================
-- INTERVIEWS TABLE SETUP
-- TalentProPH Platform
-- ============================================

-- 1. Create the interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE NOT NULL,
    employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    location_type TEXT DEFAULT 'Virtual' CHECK (location_type IN ('Virtual', 'In-Person', 'Phone')),
    location_details TEXT, -- Zoom/Google Meet link or address
    notes TEXT,
    status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled'))
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- 3. Set up RLS Policies

-- Allow employers to manage their interviews
CREATE POLICY "Employers can manage their interviews"
ON public.interviews
FOR ALL
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);

-- Allow seekers to view their interviews
CREATE POLICY "Seekers can view their interviews"
ON public.interviews
FOR SELECT
USING (auth.uid() = seeker_id);

-- 4. Update job_application status when an interview is scheduled (Trigger or Handle in Code)
-- For simplicity, we will handle logical status updates in the application code.
