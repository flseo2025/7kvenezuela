// Supabase Configuration
// Replace these values with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    // Get these from your Supabase project settings
    url: 'https://vephxwkhhwjakzjrhlvq.supabase.co',  // e.g., 'https://abcdefghijklmnop.supabase.co'
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcGh4d2toaHdqYWt6anJobHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjY1MjUsImV4cCI6MjA3MTQwMjUyNX0.ZAXTXCulreaoOqMwCXvjNrXrzEHk6g3_j8Jklf9soyk'  // Your public anon key
};

// Initialize Supabase client
let supabaseClient = null;

// Function to initialize Supabase (called after the library loads)
function initializeSupabase() {
    try {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        console.log('✅ Supabase client initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return false;
    }
}

// Function to get the Supabase client
function getSupabaseClient() {
    if (!supabaseClient) {
        console.error('❌ Supabase client not initialized. Make sure to call initializeSupabase() first.');
        return null;
    }
    return supabaseClient;
}

// Test connection function
async function testSupabaseConnection() {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
        // Simple test query to check connection
        const { data, error } = await client.from('lead_submissions').select('count').limit(1);
        if (error) {
            console.error('❌ Supabase connection test failed:', error.message);
            return false;
        }
        console.log('✅ Supabase connection test successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection test error:', error);
        return false;
    }
}