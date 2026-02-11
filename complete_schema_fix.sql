-- COMPLETE MESSAGING SYSTEM UPDATE
-- Run this in your Supabase SQL Editor to fix missing columns and tables

-- 1. Add all missing status columns to conversations table
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS is_pinned_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_archived_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_spam_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_deleted_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_pinned_seeker BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_archived_seeker BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_spam_seeker BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_deleted_seeker BOOLEAN DEFAULT FALSE;

-- 2. Create Labels table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.labels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#64748b',
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)
);

-- 3. Create Conversation Labels mapping table
CREATE TABLE IF NOT EXISTS public.conversation_labels (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, label_id)
);

-- 4. Enable RLS for new tables
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_labels ENABLE ROW LEVEL SECURITY;

-- 5. Policies for labels
DROP POLICY IF EXISTS "Users can manage their own labels" ON public.labels;
CREATE POLICY "Users can manage their own labels" ON public.labels
    FOR ALL USING (auth.uid() = user_id);

-- 6. Policies for conversation_labels
DROP POLICY IF EXISTS "Users can manage labels on their conversations" ON public.conversation_labels;
CREATE POLICY "Users can manage labels on their conversations" ON public.conversation_labels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = conversation_id 
            AND (c.employer_id = auth.uid() OR c.seeker_id = auth.uid())
        )
    );

-- 7. Ensure Conversation Policies allow fetching
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" 
ON public.conversations FOR SELECT 
USING (
    auth.uid() = employer_id OR auth.uid() = seeker_id
);

DROP POLICY IF EXISTS "Users can update their own conversations" ON public.conversations;
CREATE POLICY "Users can update their own conversations" 
ON public.conversations FOR UPDATE
USING (
    auth.uid() = employer_id OR auth.uid() = seeker_id
);

-- 8. Fix Message Policies
DROP POLICY IF EXISTS "Users can view messages for their conversations" ON public.messages;
CREATE POLICY "Users can view messages for their conversations"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND (c.employer_id = auth.uid() OR c.seeker_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can insert messages into their conversations" ON public.messages;
CREATE POLICY "Users can insert messages into their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = conversation_id 
        AND (c.employer_id = auth.uid() OR c.seeker_id = auth.uid())
    )
    AND auth.uid() = sender_id
);

DROP POLICY IF EXISTS "Users can update messages in their conversations" ON public.messages;
CREATE POLICY "Users can update messages in their conversations"
ON public.messages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND (c.employer_id = auth.uid() OR c.seeker_id = auth.uid())
    )
);
