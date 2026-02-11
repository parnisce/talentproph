
-- MESSAGING SYSTEM SCHEMA & LOGIC

-- 1. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    employer_id UUID NOT NULL REFERENCES public.profiles(id),
    seeker_id UUID NOT NULL REFERENCES public.profiles(id),
    job_id UUID REFERENCES public.job_posts(id) ON DELETE SET NULL,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(employer_id, seeker_id, job_id)
);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type TEXT DEFAULT 'text' -- 'text', 'application', 'interview', 'system'
);

-- 3. Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Conversations: Users can view conversations they are part of
CREATE POLICY "Users can view their own conversations" 
ON public.conversations FOR SELECT 
USING (
    auth.uid() = employer_id OR auth.uid() = seeker_id
);

-- Messages: Users can view messages in conversations they belong to
-- (Ideally we check via conversation link, but simple check on sender/recipient context is harder without join in RLS. 
--  Common pattern: Check if auth.uid() is the sender OR if the conversation belongs to them.
--  For simplicity and performance in Supabase, we often use a function or direct link if possible, 
--  but let's rely on the conversation existence check which is safest.)

CREATE POLICY "Users can view messages for their conversations"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND (c.employer_id = auth.uid() OR c.seeker_id = auth.uid())
    )
);

-- Messages: Users can insert messages if they are part of the conversation
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

-- 5. FUNCTION & TRIGGER: Auto-log Application Message
-- When a job seeker applies, create conversation and log the message.

CREATE OR REPLACE FUNCTION public.handle_new_application_message()
RETURNS TRIGGER AS $$
DECLARE
    v_employer_id UUID;
    v_conversation_id UUID;
    v_message_content TEXT;
BEGIN
    -- Get Employer ID from Job Post
    SELECT employer_id INTO v_employer_id
    FROM public.job_posts
    WHERE id = NEW.job_id;

    -- If no employer found (orphaned job?), exit
    IF v_employer_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Check/Create Conversation
    INSERT INTO public.conversations (employer_id, seeker_id, job_id, last_message, last_message_at)
    VALUES (v_employer_id, NEW.seeker_id, NEW.job_id, 'New Application', NOW())
    ON CONFLICT (employer_id, seeker_id, job_id) 
    DO UPDATE SET updated_at = NOW()
    RETURNING id INTO v_conversation_id;

    -- Determine Message Content
    -- Use the application message if provided, else standard text
    v_message_content := COALESCE(NEW.message, 'I have applied for this position.');
    
    -- Insert Message
    -- Note: Sender is the Seeker (NEW.seeker_id)
    INSERT INTO public.messages (conversation_id, sender_id, content, type)
    VALUES (v_conversation_id, NEW.seeker_id, v_message_content, 'application');

    -- Update conversation last message strictly
    UPDATE public.conversations 
    SET last_message = v_message_content, last_message_at = NOW()
    WHERE id = v_conversation_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid duplication
DROP TRIGGER IF EXISTS on_application_created ON public.job_applications;

CREATE TRIGGER on_application_created
AFTER INSERT ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_application_message();


-- 6. FUNCTION & TRIGGER: Auto-notify on Interview Schedule
-- When an employer schedules an interview, notify the seeker.

CREATE OR REPLACE FUNCTION public.handle_interview_scheduled_message()
RETURNS TRIGGER AS $$
DECLARE
    v_conversation_id UUID;
    v_message_content TEXT;
BEGIN
    -- Find existing conversation for this job/pair
    SELECT id INTO v_conversation_id
    FROM public.conversations
    WHERE job_id = NEW.job_id 
    AND employer_id = NEW.employer_id 
    AND seeker_id = NEW.seeker_id;

    -- If no conversation (edge case), create one
    IF v_conversation_id IS NULL THEN
        INSERT INTO public.conversations (employer_id, seeker_id, job_id, last_message, last_message_at)
        VALUES (NEW.employer_id, NEW.seeker_id, NEW.job_id, 'Interview Scheduled', NOW())
        RETURNING id INTO v_conversation_id;
    END IF;

    -- Construct Message
    v_message_content := format(
        'Interview Scheduled!
        Date: %s
        Time: %s
        Location: %s (%s)
        Notes: %s',
        to_char(NEW.scheduled_at, 'Mon DD, YYYY'),
        to_char(NEW.scheduled_at, 'HH:MI AM'),
        NEW.location_type,
        NEW.location_details,
        COALESCE(NEW.notes, 'No notes provided.')
    );

    -- Insert Message
    -- Sender is Employer
    INSERT INTO public.messages (conversation_id, sender_id, content, type)
    VALUES (v_conversation_id, NEW.employer_id, v_message_content, 'interview');

    -- Update conversation
    UPDATE public.conversations 
    SET last_message = 'Interview Invitation Sent', last_message_at = NOW()
    WHERE id = v_conversation_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_interview_scheduled ON public.interviews;

CREATE TRIGGER on_interview_scheduled
AFTER INSERT ON public.interviews
FOR EACH ROW
EXECUTE FUNCTION public.handle_interview_scheduled_message();

