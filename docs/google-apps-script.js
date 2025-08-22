/**
 * Google Apps Script for 7k Metals South America Lead Capture Form
 * This script receives form data via HTTP POST and adds it to Google Sheets
 * 
 * Instructions:
 * 1. Copy this entire code into Google Apps Script
 * 2. Deploy as web app with execute permissions for "Anyone"
 * 3. Copy the deployment URL and add it to your form JavaScript
 */

// Main function to handle form submissions
function doPost(e) {
  try {
    // Get the spreadsheet (replace with your actual spreadsheet ID)
    const SPREADSHEET_ID = '1mxdZcajk-6W9YaiRULUSmfvym4pHlP6zPLU_WFUwJSs'; // You'll replace this
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Prepare the row data in the order of your spreadsheet columns
    const rowData = [
      new Date(), // Timestamp
      data.referrerFirstName || '',
      data.referrerLastName || '',
      data.referrerMobile || '',
      data.interestLevel || '',
      data.packagePreferred || '',
      data.paymentMethod || '',
      data.firstName || '',
      data.lastName || '',
      data.mobile || '',
      data.email || '',
      data.mailingAddress || '',
      data.shippingAddress || '',
      data.sameAsMailingAddress ? 'Yes' : 'No',
      data.notes || '',
      data.submissionTime || '',
      data.userAgent || ''
    ];

    // Add the data to the spreadsheet
    sheet.appendRow(rowData);

    // Log successful submission
    console.log('Form submission added successfully:', data.email);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error for debugging
    console.error('Error processing form submission:', error);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to set up the spreadsheet headers (run this once manually)
function setupSpreadsheetHeaders() {
  try {
    const SPREADSHEET_ID = '1mxdZcajk-6W9YaiRULUSmfvym4pHlP6zPLU_WFUwJSs'; // Replace with your actual ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();

    // Define the headers
    const headers = [
      'Timestamp',
      'Referrer First Name',
      'Referrer Last Name',
      'Referrer Mobile',
      'Interest Level',
      'Package Preferred',
      'Payment Method',
      'Contact First Name',
      'Contact Last Name',
      'Contact Mobile',
      'Contact Email',
      'Mailing Address',
      'Shipping Address',
      'Same as Mailing',
      'Notes',
      'Submission Time',
      'User Agent'
    ];

    // Clear existing content and add headers
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format the header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#B8860B'); // Gold background
    headerRange.setFontColor('#FFFFFF'); // White text
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);

    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);

    // Freeze the header row
    sheet.setFrozenRows(1);

    console.log('Spreadsheet headers set up successfully!');
    return 'Headers added successfully';

  } catch (error) {
    console.error('Error setting up headers:', error);
    return 'Error: ' + error.toString();
  }
}

// Function to test the script (run this to verify it works)
function testFormSubmission() {
  const testData = {
    referrerFirstName: 'Test',
    referrerLastName: 'Referrer',
    referrerMobile: '+58 414 123 4567',
    interestLevel: 'high',
    packagePreferred: 'legacy',
    paymentMethod: 'credit-card',
    firstName: 'John',
    lastName: 'Doe',
    mobile: '+58 414 987 6543',
    email: 'john.doe@example.com',
    mailingAddress: '123 Test Street, Caracas, Venezuela',
    shippingAddress: '456 Shipping Ave, Caracas, Venezuela',
    sameAsMailingAddress: false,
    notes: 'This is a test submission',
    submissionTime: new Date().toISOString(),
    userAgent: 'Test User Agent'
  };

  // Simulate the doPost function
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
  return result.getContent();
}

// Function to get spreadsheet info (helpful for debugging)
function getSpreadsheetInfo() {
  try {
    const SPREADSHEET_ID = '1mxdZcajk-6W9YaiRULUSmfvym4pHlP6zPLU_WFUwJSs'; // Replace with your actual ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();

    const info = {
      spreadsheetName: spreadsheet.getName(),
      sheetName: sheet.getName(),
      rowCount: sheet.getLastRow(),
      columnCount: sheet.getLastColumn(),
      url: spreadsheet.getUrl()
    };

    console.log('Spreadsheet info:', info);
    return info;

  } catch (error) {
    console.error('Error getting spreadsheet info:', error);
    return 'Error: ' + error.toString();
  }
}