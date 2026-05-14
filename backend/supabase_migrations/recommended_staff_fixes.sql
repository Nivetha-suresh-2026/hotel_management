-- Recommended fixes for staff-related enums/defaults (run in Supabase SQL editor)

-- 1) Fix defaults to match CHECK constraints (case-sensitive)
ALTER TABLE public.staff
  ALTER COLUMN shift SET DEFAULT 'Morning',
  ALTER COLUMN employment_type SET DEFAULT 'Full Time';

-- Optional: enforce uniqueness on emails at the app-table layer too
-- (Supabase Auth already enforces unique emails in auth.users)
-- ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);
-- ALTER TABLE public.staff ADD CONSTRAINT staff_email_key UNIQUE (email);

-- 2) If you previously created a function that directly INSERTs into auth.users,
--    it is recommended to drop it and create users via the Auth Admin API instead.
-- DROP FUNCTION IF EXISTS public.create_staff_user(
--   text, text, text, uuid, uuid, text, text, text, text, integer, text, text, text, uuid
-- );

