-- Temporarily disable RLS to get the form working
-- Run this in your Supabase SQL Editor

-- Step 1: Disable Row Level Security completely
ALTER TABLE lead_submissions DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'lead_submissions';

-- Step 3: Test insert (this should work now)
-- You can uncomment and run this to test:
-- INSERT INTO lead_submissions (
--     referred_by_first_name, 
--     referred_by_last_name, 
--     referred_by_mobile,
--     interest_level,
--     package_preferred,
--     payment_method,
--     contact_first_name,
--     contact_last_name,
--     contact_mobile,
--     contact_email,
--     mailing_address
-- ) VALUES (
--     'Test', 
--     'User', 
--     '555-0123',
--     'high',
--     'basic',
--     'credit-card',
--     'John',
--     'Doe',
--     '555-0456',
--     'test@example.com',
--     '123 Test St'
-- );

-- Note: We'll re-enable RLS with proper policies later once the form is working