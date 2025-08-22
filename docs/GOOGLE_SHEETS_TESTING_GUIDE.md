# 🧪 Google Sheets Integration Testing Guide
## 7k Metals South America Lead Capture Form

Complete testing instructions to verify your Google Sheets integration works perfectly.

---

## ✅ Pre-Testing Checklist

Before testing, ensure you've completed:
- [ ] Created Google Spreadsheet
- [ ] Set up Google Apps Script with your spreadsheet ID
- [ ] Deployed the web app with "Anyone" access
- [ ] Added headers using `setupSpreadsheetHeaders` function
- [ ] Updated `google-sheets-config.js` with your deployment URL
- [ ] Added the script tag to your HTML

---

## 🚀 Testing Steps

### **Step 1: Test Google Apps Script Directly**

1. **Open Google Apps Script**: Go to your script project
2. **Test setupSpreadsheetHeaders**:
   - Select `setupSpreadsheetHeaders` from function dropdown
   - Click "Run" ▶️
   - **Expected**: Your spreadsheet should have formatted headers

3. **Test testFormSubmission**:
   - Select `testFormSubmission` from function dropdown
   - Click "Run" ▶️
   - **Expected**: New test row appears in your spreadsheet

4. **Check Execution Log**:
   - Go to "Executions" tab
   - Should see successful runs with no errors

### **Step 2: Test Web App URL**

**Using Browser Console:**
1. Open your form in browser
2. Press F12 → Console tab
3. Paste and run this test:

```javascript
// Test Google Sheets submission
const testData = {
    referrerFirstName: 'Console',
    referrerLastName: 'Test',
    referrerMobile: '+58 414 123 4567',
    interestLevel: 'high',
    packagePreferred: 'legacy',
    paymentMethod: 'credit-card',
    firstName: 'Browser',
    lastName: 'Test',
    mobile: '+58 414 987 6543',
    email: 'browser.test@example.com',
    mailingAddress: '123 Browser Test St, Caracas',
    notes: 'Console test submission',
    submissionTime: new Date().toISOString()
};

submitToGoogleSheets(testData)
    .then(result => console.log('✅ Test successful:', result))
    .catch(error => console.error('❌ Test failed:', error));
```

**Expected Result:**
```
📊 Submitting to Google Sheets: {referrerFirstName: "Console", ...}
✅ Google Sheets submission sent successfully
✅ Test successful: {success: true, message: "Submitted to Google Sheets", ...}
```

### **Step 3: Test Complete Form Submission**

1. **Fill Out Form**: Use these test values:

| Field | Test Value |
|-------|------------|
| Referrer First Name | Maria |
| Referrer Last Name | Rodriguez |
| Referrer Mobile | +58 212 555 0123 |
| Interest Level | High |
| Package Preferred | Legacy at $599 |
| Payment Method | Credit Card |
| Your First Name | Carlos |
| Your Last Name | Mendoza |
| Your Mobile | +58 414 555 0456 |
| Your Email | carlos.mendoza@email.com |
| Mailing Address | Av. Francisco de Miranda, Torre XYZ, Piso 15, Caracas 1060, Venezuela |
| Shipping Address | (leave blank or same as mailing) |
| Notes | Full form integration test |

2. **Submit Form**: Click "Submit Registration"

3. **Check Console**: Should see both:
   ```
   ✅ Supabase submission successful
   ✅ Google Sheets submission successful
   ```

4. **Verify Data Storage**:
   - **Supabase**: Check your Supabase table
   - **Google Sheets**: Check your spreadsheet for new row

---

## 📊 Expected Google Sheets Format

Your spreadsheet should show data like this:

| Timestamp | Referrer First Name | Referrer Last Name | Referrer Mobile | Interest Level | Package Preferred | Payment Method | Contact First Name | Contact Last Name | Contact Mobile | Contact Email | Mailing Address | Shipping Address | Same as Mailing | Notes | Submission Time | User Agent |
|-----------|-------------------|-------------------|----------------|---------------|------------------|---------------|------------------|------------------|---------------|--------------|----------------|-----------------|----------------|-------|----------------|------------|
| 1/22/2025 15:30:15 | Maria | Rodriguez | +58 212 555 0123 | high | legacy | credit-card | Carlos | Mendoza | +58 414 555 0456 | carlos.mendoza@email.com | Av. Francisco de Miranda... | | No | Full form integration test | 2025-01-22T20:30:15.123Z | Mozilla/5.0... |

---

## 🔍 Debugging Failed Tests

### **❌ "Google Sheets not configured - skipping"**
**Cause**: Deployment URL not set properly
**Fix**: 
1. Check `src/js/google-sheets-config.js`
2. Ensure `webAppUrl` doesn't contain "YOUR_DEPLOYMENT_ID_HERE"
3. Use the complete deployment URL from Google Apps Script

### **❌ "Access to fetch at '...' from origin '...' has been blocked by CORS policy"**
**Cause**: This is expected with Google Apps Script
**Fix**: This error can be ignored - the submission still works with `no-cors` mode

### **❌ No data appearing in spreadsheet**
**Debug Steps**:
1. **Check Apps Script Executions**:
   - Go to Google Apps Script → Executions
   - Look for recent executions of your web app
   - Check for errors

2. **Verify Spreadsheet ID**:
   - Ensure the ID in your script matches your actual spreadsheet
   - Test with `getSpreadsheetInfo()` function

3. **Check Permissions**:
   - Ensure web app is deployed with "Execute as: Me"
   - Ensure "Who has access: Anyone"

### **❌ "Exception: Cannot read properties of null"**
**Cause**: Spreadsheet not found or wrong ID
**Fix**: 
1. Copy spreadsheet ID again from URL
2. Update the script and redeploy

### **❌ Form shows success but data missing**
**Debug**:
1. Check browser console for JavaScript errors
2. Verify both scripts are loading correctly
3. Test individual components (Supabase vs Google Sheets)

---

## 🧪 Advanced Testing Scenarios

### **Test 1: Google Sheets Only (Supabase Disabled)**
```javascript
// Temporarily disable Supabase for testing
const originalSubmitToAPI = LeadCaptureForm.prototype.submitToAPI;
LeadCaptureForm.prototype.submitToAPI = () => {
    throw new Error('Supabase disabled for testing');
};

// Fill and submit form - should still work with Google Sheets backup
```

### **Test 2: Error Handling**
```javascript
// Test with invalid Google Sheets URL
GOOGLE_SHEETS_CONFIG.webAppUrl = 'https://invalid-url.com';
// Submit form - should show appropriate error message
```

### **Test 3: Load Testing**
Submit multiple forms quickly to test rate limiting and performance.

### **Test 4: International Characters**
Test with special characters, emojis, and international text:
- Names: José, María, François
- Addresses: Caracas, São Paulo, México
- Notes: Test with accents: ñ, ç, á, é, í, ó, ú

---

## 📊 Monitoring and Analytics

### **Daily Checks**
- [ ] Verify new submissions appear in spreadsheet
- [ ] Check Google Apps Script execution logs
- [ ] Monitor form performance in browser console

### **Weekly Reviews**
- [ ] Export spreadsheet data for backup
- [ ] Review submission patterns and trends
- [ ] Check for any failed submissions in logs

### **Data Analysis**
Use Google Sheets features:
- **Pivot Tables**: Analyze submissions by interest level, package preference
- **Charts**: Visualize submission trends over time
- **Filters**: Find specific leads or date ranges
- **Conditional Formatting**: Highlight high-value leads

---

## 🔧 Maintenance Tasks

### **Monthly Tasks**
- [ ] Review and clean test data
- [ ] Update Google Apps Script if needed
- [ ] Check spreadsheet performance (Google Sheets has 10M cell limit)
- [ ] Archive old data if spreadsheet gets large

### **When to Redeploy**
- Making changes to the Google Apps Script code
- Changing spreadsheet structure or headers
- Updating error handling or validation

### **Backup Strategy**
- **Weekly**: Download spreadsheet as Excel/CSV
- **Monthly**: Create copy of entire spreadsheet
- **Before changes**: Always backup before modifying script

---

## 📈 Success Metrics

### **Integration Health Check**
- ✅ **Form submissions**: Both Supabase and Google Sheets receive data
- ✅ **Data integrity**: All form fields properly mapped
- ✅ **Error handling**: Graceful degradation if one service fails
- ✅ **Performance**: Form submits within 5 seconds
- ✅ **Reliability**: 99%+ success rate for submissions

### **Data Quality Indicators**
- All required fields populated
- Valid email and phone formats
- Reasonable timestamp alignment
- No duplicate submissions (unless expected)

---

**🎉 Once all tests pass, your Google Sheets integration is production-ready!**

**Your form now provides:**
- 🗄️ **Primary storage**: Supabase database
- 📊 **Backup storage**: Google Sheets
- 🔄 **Redundancy**: If one fails, the other works
- 👥 **Easy sharing**: Spreadsheet can be shared with team
- 📈 **Analytics**: Built-in Google Sheets analysis tools