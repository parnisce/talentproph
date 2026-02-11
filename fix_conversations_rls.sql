-- FIX ROW LEVEL SECURITY FOR CONVERSATIONS
-- This allows employers and seekers to start conversations and update them.

-- 1. Conversation Insert Policy
CREATE POLICY "Users can create their own conversations" 
ON public.conversations FOR INSERT 
WITH CHECK (
    auth.uid() = employer_id OR auth.uid() = seeker_id
);

-- 2. Conversation Update Policy (Important for last_message and read status)
CREATE POLICY "Users can update their own conversations" 
ON public.conversations FOR UPDATE
USING (
    auth.uid() = employer_id OR auth.uid() = seeker_id
);

-- 3. Message Update Policy (Important for marking as read)
CREATE POLICY "Users can update messages in their conversations"
ON public.messages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND (c.employer_id = auth.uid() OR c.seeker_id = auth.uid())
    )
);
