-- Fix Row Level Security Policy for Anonymous Form Submissions
-- Run this SQL in your Supabase SQL Editor to fix the submission issue

-- First, drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow anonymous inserts" ON lead_submissions;

-- Create a new policy that allows all inserts (since this is a lead capture form)
CREATE POLICY "Allow all inserts for lead capture" ON lead_submissions
    FOR INSERT WITH CHECK (true);

-- Alternatively, if you want to be more specific, you can use this policy instead:
-- This allows inserts from both anonymous users and authenticated users
-- CREATE POLICY "Allow public form submissions" ON lead_submissions
--     FOR INSERT WITH CHECK (
--         auth.role() = 'anon' OR 
--         auth.role() = 'authenticated'
--     );

-- Verify the policy was created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'lead_submissions';