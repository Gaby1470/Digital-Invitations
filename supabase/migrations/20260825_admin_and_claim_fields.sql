-- Migration to add Admin and Claim Code fields for Custom Design Flow
-- You can execute this script in your Supabase SQL Editor.

-- 1. Add 'is_admin' column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.profiles.is_admin IS 'Flag to identify website owners/administrators.';

-- 2. Add 'claim_code' and 'is_custom_design' to invitations table
ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS claim_code TEXT UNIQUE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_custom_design BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.invitations.claim_code IS 'Unique token used by clients to claim ownership of an invitation.';
COMMENT ON COLUMN public.invitations.is_custom_design IS 'Flag indicating if this invitation was created specifically as a custom design by an admin.';

-- 3. Update handle_new_user trigger function to ensure the trigger doesn't overwrite is_admin
-- The existing handle_new_user does not reset is_admin, so it is safe.

-- 4. Set first admin profile (Replace with your actual admin email)
-- UPDATE public.profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';
