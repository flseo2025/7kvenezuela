# 📊 Complete Google Sheets Integration Guide
## 7k Metals South America Lead Capture Form

This guide will set up automatic form submissions to Google Sheets in **20 minutes**.

---

## 📋 Step 1: Create Google Spreadsheet

1. **Go to Google Sheets**: Visit [sheets.google.com](https://sheets.google.com)
2. **Create New Spreadsheet**: Click "Blank" or "+"
3. **Name Your Spreadsheet**: 
   - Click "Untitled spreadsheet" at the top
   - Name it: `7k Metals South America Leads`
4. **Copy Spreadsheet ID**:
   - Look at the URL: `https://docs.google.com/spreadsheets/d/1mxdZcajk-6W9YaiRULUSmfvym4pHlP6zPLU_WFUwJSs/edit`
   - Copy the long ID between `/d/` and `/edit`
   - Save this ID - you'll need it later

---

## 🔧 Step 2: Set Up Google Apps Script

1. **Open Apps Script**: Go to [script.google.com](https://script.google.com)
2. **Create New Project**: Click "New Project"
3. **Name Your Project**: Click "Untitled project" → Name it `7k Metals Form Handler`
4. **Replace Default Code**:
   - Delete all existing code in the editor
   - Copy and paste the **entire contents** of `docs/google-apps-script.js`
5. **Update Spreadsheet ID**:
   - Find line: `const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';`
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
   - Save: Ctrl+S / Cmd+S

---

## 🚀 Step 3: Deploy the Web App

1. **Deploy**: Click "Deploy" → "New deployment"
2. **Choose Type**: Click gear icon ⚙️ → Select "Web app"
3. **Configure Deployment**:
   - **Description**: `7k Metals Form Handler v1`
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. **Authorize**: Click "Deploy" → "Authorize access"
5. **Grant Permissions**:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to 7k Metals Form Handler (unsafe)"
   - Click "Allow"
6. **Copy Web App URL**:
   - Copy the URL that looks like: `https://script.google.com/macros/s/ABC123.../exec`
   - **Save this URL** - you'll need it for the form

---

## 📊 Step 4: Set Up Spreadsheet Headers

1. **Back in Apps Script**: Click the function dropdown
2. **Select Function**: Choose `setupSpreadsheetHeaders`
3. **Run Function**: Click "Run" ▶️
4. **Check Your Spreadsheet**: 
   - Go back to your Google Sheet
   - You should see formatted headers in row 1
   - Headers should be gold background with white text

**Expected Headers:**
| Timestamp | Referrer First Name | Referrer Last Name | ... | Notes | User Agent |

---

## 🧪 Step 5: Test the Integration

### **Test in Apps Script**
1. **Select Test Function**: Choose `testFormSubmission` from dropdown
2. **Run Test**: Click "Run" ▶️
3. **Check Results**:
   - Should see "Test result: {success: true...}" in logs
   - Check your spreadsheet for a new test row

### **Test the Web App URL**
Open terminal/command prompt and run:
```bash
curl -X POST "YOUR_WEB_APP_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}'
```

**Expected Response:**
```json
{"success":true,"message":"Form submitted successfully","timestamp":"..."}
```

---

## ⚙️ Step 6: Configure Your Form

Now update your form to send data to Google Sheets:

1. **Create Configuration File**: Create `src/js/google-sheets-config.js`
2. **Add Your Web App URL**:

```javascript
// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    webAppUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
};

// Function to submit data to Google Sheets
async function submitToGoogleSheets(formData) {
    try {
        console.log('📊 Submitting to Google Sheets:', formData);
        
        const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Google Sheets submission successful:', result);
            return result;
        } else {
            throw new Error(result.error || 'Google Sheets submission failed');
        }
        
    } catch (error) {
        console.error('❌ Google Sheets submission error:', error);
        throw error;
    }
}
```

3. **Add Script to HTML**: In `src/index.html`, add before the closing `</body>` tag:

```html
<!-- Google Sheets Integration -->
<script src="js/google-sheets-config.js"></script>
```

---

## 🔄 Step 7: Update Form Submission Logic

The form will now send data to **both Supabase AND Google Sheets** for redundancy.

**Benefits:**
- ✅ **Supabase**: Primary database with advanced features
- ✅ **Google Sheets**: Backup storage, easy viewing/sharing
- ✅ **Dual redundancy**: If one fails, the other works
- ✅ **Easy access**: View submissions in familiar spreadsheet format

---

## 📊 Step 8: Verify Everything Works

### **Complete Form Test**
1. **Fill out your form** with real test data
2. **Submit the form**
3. **Check both locations**:
   - **Supabase Dashboard**: Should show new submission
   - **Google Sheets**: Should show new row with formatted data

### **Expected Google Sheets Format**
| Timestamp | Referrer First Name | Referrer Last Name | Referrer Mobile | Interest Level | Package Preferred | Payment Method | Contact First Name | Contact Last Name | Contact Mobile | Contact Email | Mailing Address | Shipping Address | Same as Mailing | Notes | Submission Time | User Agent |
|-----------|-------------------|-------------------|----------------|---------------|------------------|---------------|------------------|------------------|---------------|--------------|----------------|-----------------|----------------|-------|----------------|------------|
| 2025-01-22 10:30:15 | John | Doe | +58 414 123 4567 | high | legacy | credit-card | Jane | Smith | +58 414 987 6543 | jane@example.com | 123 Main St | 456 Ship Ave | No | Test notes | 2025-01-22T15:30:15.123Z | Mozilla/5.0... |

---

## 🚨 Troubleshooting

### **❌ Error: "Script function not found"**
- **Cause**: Web app not deployed properly
- **Fix**: Redeploy with correct permissions

### **❌ Error: "Exception: Cannot read properties"**
- **Cause**: Wrong spreadsheet ID
- **Fix**: Double-check spreadsheet ID in script

### **❌ Error: "Access denied"**
- **Cause**: Insufficient permissions
- **Fix**: Ensure "Who has access" is set to "Anyone"

### **❌ No data appearing in spreadsheet**
- **Check**: Console logs in browser (F12)
- **Verify**: Web app URL is correct
- **Test**: Run `testFormSubmission` function manually

### **❌ CORS errors**
- **Note**: Google Apps Script handles CORS automatically
- **If seeing CORS errors**: Check web app deployment settings

---

## 🔒 Security Notes

### **What's Safe**
- ✅ Web app URL can be public (designed for form submissions)
- ✅ No sensitive API keys exposed
- ✅ Google handles authentication and security

### **Best Practices**
- 🔄 **Regular backups**: Export spreadsheet data periodically
- 👀 **Monitor submissions**: Check for unusual activity
- 🚫 **Limit access**: Only share spreadsheet with necessary people
- 📊 **Data analysis**: Use Google Sheets features for insights

---

## 📈 Advanced Features (Optional)

### **Email Notifications**
Add to your Apps Script:
```javascript
// Add after successful submission in doPost function
GmailApp.sendEmail(
  'your-email@domain.com',
  'New Lead Submission - 7k Metals',
  `New lead: ${data.firstName} ${data.lastName} (${data.email})`
);
```

### **Data Validation**
Add data validation rules in Google Sheets:
- **Email column**: Data → Data validation → Custom formula: `=ISEMAIL(K2)`
- **Phone column**: Data → Data validation → Custom formula: `=LEN(D2)>=7`

### **Conditional Formatting**
Highlight important leads:
- **High interest**: Format → Conditional formatting → "high" = green background
- **Recent submissions**: Format cells where timestamp is within last 24 hours

---

## 📞 Need Help?

### **Common Google Sheets Functions**
- **Filter data**: Data → Create a filter
- **Sort by date**: Click timestamp column → Data → Sort sheet Z→A
- **Export data**: File → Download → CSV/Excel
- **Share access**: Share button → Add people/groups

### **Apps Script Debugging**
- **View logs**: In Apps Script, go to Executions to see detailed logs
- **Test functions**: Use the function dropdown to test individual functions
- **Version control**: Deploy → Manage deployments to update

---

**🎉 Congratulations! Your form now automatically saves to both Supabase and Google Sheets!**

**Next Steps:**
1. Share the Google Sheet with your team
2. Set up email notifications (optional)
3. Create data analysis dashboards
4. Monitor form performance and submissions