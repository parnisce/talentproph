-- ============================================
-- BILLING AND PAYMENT METHODS SCHEMA
-- TalentProPH Platform
-- ============================================

-- 1. Create Payment Methods Table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    brand TEXT NOT NULL, -- e.g., 'visa', 'mastercard'
    last4 TEXT NOT NULL,
    expiry TEXT NOT NULL, -- e.g., '12/25'
    name TEXT, -- Cardholder name
    is_default BOOLEAN DEFAULT FALSE
);

-- 2. Create Billing History Table
CREATE TABLE IF NOT EXISTS public.billing_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
    invoice_number TEXT UNIQUE NOT NULL,
    description TEXT,
    receipt_url TEXT
);

-- 3. Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- 4. Set up RLS Policies
-- Payment Methods
DROP POLICY IF EXISTS "Users can manage their own payment methods" ON public.payment_methods;
CREATE POLICY "Users can manage their own payment methods"
ON public.payment_methods
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Billing History
DROP POLICY IF EXISTS "Users can view their own billing history" ON public.billing_history;
CREATE POLICY "Users can manage their own billing history"
ON public.billing_history
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Insert some sample billing history for testing (optional, but helpful)
-- Note: Replace 'USER_ID_HERE' with an actual user ID if running manually for a specific user
-- INSERT INTO public.billing_history (user_id, amount, invoice_number, description)
-- VALUES ('...', 69.00, '#INV-2026-001', 'Pro Plan Monthly Subscription');
