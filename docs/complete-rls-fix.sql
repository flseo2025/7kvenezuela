-- Complete RLS Fix for Lead Submissions
-- Run this ENTIRE script in your Supabase SQL Editor

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON lead_submissions;
DROP POLICY IF EXISTS "Allow authenticated reads" ON lead_submissions;
DROP POLICY IF EXISTS "Allow all inserts for lead capture" ON lead_submissions;
DROP POLICY IF EXISTS "Allow public form submissions" ON lead_submissions;

-- Step 2: Temporarily disable RLS to test
ALTER TABLE lead_submissions DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS with proper policies
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a simple policy that allows anyone to insert
CREATE POLICY "Enable insert for anyone" ON lead_submissions
    FOR INSERT WITH CHECK (true);

-- Step 5: Create a policy for reading (optional - only authenticated users)
CREATE POLICY "Enable read for authenticated users only" ON lead_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Step 6: Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'lead_submissions';

-- Step 7: Test with a simple insert (this should work)
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