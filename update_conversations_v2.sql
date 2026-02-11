
-- Update Conversations Table to support pinning and archiving for both roles
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS is_pinned_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_pinned_seeker BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_archived_employer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_archived_seeker BOOLEAN DEFAULT FALSE;

-- Ensure RLS allows updating these fields
-- We need to check which role is updating and allow it if they are the correct user
CREATE POLICY "Users can update their own pinned/archived status"
ON public.conversations FOR UPDATE
USING (auth.uid() = employer_id OR auth.uid() = seeker_id)
WITH CHECK (auth.uid() = employer_id OR auth.uid() = seeker_id);

-- Add unique index or check if messages table needs any updates
-- (is_read is already there)
