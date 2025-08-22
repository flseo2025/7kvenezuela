-- 7k Metals South America Pre-Launch - Lead Submissions Table
-- Run this SQL in your Supabase SQL Editor to create the table

CREATE TABLE lead_submissions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Referrer Information
    referred_by_first_name VARCHAR(100) NOT NULL,
    referred_by_last_name VARCHAR(100) NOT NULL,
    referred_by_mobile VARCHAR(20) NOT NULL,
    
    -- Interest and Package Information
    interest_level VARCHAR(50) NOT NULL CHECK (interest_level IN ('high', 'need-more-info')),
    package_preferred VARCHAR(50) NOT NULL CHECK (package_preferred IN ('legacy', 'basic', 'undecided')),
    payment_method VARCHAR(100) NOT NULL,
    
    -- Contact Information
    contact_first_name VARCHAR(100) NOT NULL,
    contact_last_name VARCHAR(100) NOT NULL,
    contact_mobile VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    
    -- Address Information
    mailing_address TEXT NOT NULL,
    shipping_address TEXT,
    same_as_mailing BOOLEAN DEFAULT FALSE,
    
    -- Additional Information
    notes TEXT,
    
    -- Metadata
    submission_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET
);

-- Create indexes for better query performance
CREATE INDEX idx_lead_submissions_created_at ON lead_submissions(created_at);
CREATE INDEX idx_lead_submissions_email ON lead_submissions(contact_email);
CREATE INDEX idx_lead_submissions_interest_level ON lead_submissions(interest_level);
CREATE INDEX idx_lead_submissions_package_preferred ON lead_submissions(package_preferred);

-- Enable Row Level Security (RLS)
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts for anonymous users (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON lead_submissions
    FOR INSERT WITH CHECK (true);

-- Create a policy to allow reads for authenticated users only
CREATE POLICY "Allow authenticated reads" ON lead_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Create a view for easier data analysis
CREATE OR REPLACE VIEW lead_submissions_summary AS
SELECT 
    id,
    created_at,
    referred_by_first_name || ' ' || referred_by_last_name AS referrer_name,
    referred_by_mobile AS referrer_mobile,
    interest_level,
    package_preferred,
    payment_method,
    contact_first_name || ' ' || contact_last_name AS contact_name,
    contact_mobile,
    contact_email,
    CASE 
        WHEN same_as_mailing THEN mailing_address 
        ELSE shipping_address 
    END AS shipping_address,
    notes
FROM lead_submissions
ORDER BY created_at DESC;

-- Grant permissions to the view
GRANT SELECT ON lead_submissions_summary TO anon, authenticated;