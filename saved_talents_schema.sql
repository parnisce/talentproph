-- ============================================
-- SAVED TALENTS TABLE SETUP
-- TalentProPH Platform
-- ============================================

-- 1. Create the saved_talents table
CREATE TABLE IF NOT EXISTS public.saved_talents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT unique_saved_talent UNIQUE (employer_id, seeker_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.saved_talents ENABLE ROW LEVEL SECURITY;

-- 3. Set up RLS Policies
CREATE POLICY "Employers can manage their saved talents"
ON public.saved_talents
FOR ALL
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);
