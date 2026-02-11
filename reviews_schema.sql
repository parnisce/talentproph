-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    seeker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    employer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.job_posts(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    UNIQUE(seeker_id, employer_id, job_id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies

-- Everyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews FOR SELECT 
USING (true);

-- Employers can insert reviews for seekers they have hired
-- Ideally we check if they actually hired them, but for now we'll trust the UI/Logic or simple auth check
CREATE POLICY "Employers can insert reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (
    auth.uid() = employer_id
);

-- Employers can update their own reviews
CREATE POLICY "Employers can update their own reviews" 
ON public.reviews FOR UPDATE 
USING (auth.uid() = employer_id);

-- Employers can delete their own reviews
CREATE POLICY "Employers can delete their own reviews" 
ON public.reviews FOR DELETE 
USING (auth.uid() = employer_id);
