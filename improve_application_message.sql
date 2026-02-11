-- FUNCTION & TRIGGER: Auto-log Application Message with Improved Content
-- Replaces the existing function to include Applicant Name and Job Title

CREATE OR REPLACE FUNCTION public.handle_new_application_message()
RETURNS TRIGGER AS $$
DECLARE
    v_employer_id UUID;
    v_conversation_id UUID;
    v_message_content TEXT;
    v_seeker_name TEXT;
    v_job_title TEXT;
BEGIN
    -- Get Employer ID and Job Title from Job Post
    SELECT employer_id, job_title INTO v_employer_id, v_job_title
    FROM public.job_posts
    WHERE id = NEW.job_id;

    -- Get Seeker Name from Profiles
    SELECT full_name INTO v_seeker_name
    FROM public.profiles
    WHERE id = NEW.seeker_id;

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
    -- If user provided a custom message, use it, but append the system notification style header
    IF NEW.message IS NOT NULL AND NEW.message <> '' THEN
         v_message_content := format('Hello, I have applied for the %s position. %s', v_job_title, NEW.message);
    ELSE
         v_message_content := format('Hello, I have applied for the **%s** position. I am excited about this opportunity and would love to discuss how I can contribute to your team. Please check my profile for more details.

Best regards,
%s', v_job_title, COALESCE(v_seeker_name, 'The Applicant'));
    END IF;
    
    -- Insert Message
    -- Note: Sender is the Seeker (NEW.seeker_id) so it appears as their first message
    INSERT INTO public.messages (conversation_id, sender_id, content, type)
    VALUES (v_conversation_id, NEW.seeker_id, v_message_content, 'application');

    -- Update conversation last message strictly
    UPDATE public.conversations 
    SET last_message = v_message_content, last_message_at = NOW()
    WHERE id = v_conversation_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
