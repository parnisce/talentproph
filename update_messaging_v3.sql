
-- Expand Conversations with Spam and Deletion flags
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS is_spam_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_deleted_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_spam_seeker BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_deleted_seeker BOOLEAN DEFAULT FALSE;

-- Create Labels table
CREATE TABLE IF NOT EXISTS public.labels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#64748b',
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)
);

-- Create Conversation Labels mapping table
CREATE TABLE IF NOT EXISTS public.conversation_labels (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, label_id)
);

-- Enable RLS
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_labels ENABLE ROW LEVEL SECURITY;

-- Policies for labels
DROP POLICY IF EXISTS "Users can manage their own labels" ON public.labels;
CREATE POLICY "Users can manage their own labels" ON public.labels
    FOR ALL USING (auth.uid() = user_id);

-- Policies for conversation_labels
DROP POLICY IF EXISTS "Users can manage labels on their conversations" ON public.conversation_labels;
CREATE POLICY "Users can manage labels on their conversations" ON public.conversation_labels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = conversation_id 
            AND (c.employer_id = auth.uid() OR c.seeker_id = auth.uid())
        )
    );
