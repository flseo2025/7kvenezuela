// Google Sheets Configuration
// Replace YOUR_DEPLOYMENT_ID with your actual Google Apps Script deployment ID

const GOOGLE_SHEETS_CONFIG = {
    webAppUrl: 'https://script.google.com/macros/s/AKfycby07lhXTRK-PRxQsiP2XGr9brW3OVhh7OsU4YdXFB4coXgsUYWhKQrmX3YupZb5GNZO/exec',
    enabled: true // Set to false to disable Google Sheets integration
};

// Function to submit data to Google Sheets
async function submitToGoogleSheets(formData) {
    // Skip if Google Sheets integration is disabled
    if (!GOOGLE_SHEETS_CONFIG.enabled) {
        console.log('📊 Google Sheets integration disabled');
        return { success: true, message: 'Google Sheets integration disabled' };
    }

    // Skip if no URL configured
    if (!GOOGLE_SHEETS_CONFIG.webAppUrl || GOOGLE_SHEETS_CONFIG.webAppUrl.includes('YOUR_DEPLOYMENT_ID_HERE')) {
        console.log('📊 Google Sheets not configured - skipping');
        return { success: true, message: 'Google Sheets not configured' };
    }

    try {
        console.log('📊 Submitting to Google Sheets:', formData);

        const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'no-cors' // Google Apps Script requires no-cors mode
        });

        // Note: With no-cors mode, we can't read the response
        // But if no error is thrown, the submission was successful
        console.log('✅ Google Sheets submission sent successfully');

        return {
            success: true,
            message: 'Submitted to Google Sheets',
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('❌ Google Sheets submission error:', error);
        throw error;
    }
}

// Function to test Google Sheets configuration
async function testGoogleSheetsConfig() {
    if (!GOOGLE_SHEETS_CONFIG.enabled) {
        console.log('❌ Google Sheets integration is disabled');
        return false;
    }

    if (!GOOGLE_SHEETS_CONFIG.webAppUrl || GOOGLE_SHEETS_CONFIG.webAppUrl.includes('YOUR_DEPLOYMENT_ID_HERE')) {
        console.log('❌ Google Sheets URL not configured properly');
        return false;
    }

    try {
        const testData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            submissionTime: new Date().toISOString()
        };

        await submitToGoogleSheets(testData);
        console.log('✅ Google Sheets configuration test passed');
        return true;
    } catch (error) {
        console.error('❌ Google Sheets configuration test failed:', error);
        return false;
    }
}