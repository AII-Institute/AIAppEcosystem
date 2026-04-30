-- Enable email OTP in Supabase:
-- Dashboard → Authentication → Providers → Email
--   ✓ Enable Email provider
--   ✓ Disable "Confirm email" (we use OTP instead of magic link)
--   OTP Expiry: 600 (10 min, default is fine)
--
-- Enable MFA (TOTP) support:
-- Dashboard → Authentication → MFA
--   ✓ Enable TOTP (Time-based One-Time Password)
--
-- No SQL changes needed — Supabase Auth manages its own schema in auth.*
-- Our public.onboarding_users table links via email after auth is verified.

-- Optional: update RLS on onboarding_users to also allow auth.uid() based access
-- once users are authenticated via Supabase Auth.

-- Update RLS policies to allow authenticated users to manage their own records
ALTER POLICY "anon can insert onboarding_users" ON public.onboarding_users
  RENAME TO "users can insert onboarding_users";

ALTER POLICY "anon can select onboarding_users" ON public.onboarding_users
  RENAME TO "users can select onboarding_users";

ALTER POLICY "anon can insert onboarding_state" ON public.onboarding_state
  RENAME TO "users can insert onboarding_state";

ALTER POLICY "anon can select onboarding_state" ON public.onboarding_state
  RENAME TO "users can select onboarding_state";

ALTER POLICY "anon can update onboarding_state" ON public.onboarding_state
  RENAME TO "users can update onboarding_state";
