-- Add Verification Columns to Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS government_id_url TEXT,
ADD COLUMN IF NOT EXISTS billing_address TEXT,
ADD COLUMN IF NOT EXISTS is_verified_pro BOOLEAN DEFAULT FALSE;

-- The mobile number is already there as 'phone' in database or we can add 'mobile_number' for clarity
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mobile_number TEXT;

COMMENT ON COLUMN public.profiles.verification_status IS 'Can be unverified, pending, or verified';
