# 🧪 Testing Guide
## 7k Metals South America Pre-Launch Lead Capture Form

Complete testing instructions to verify all features including bilingual functionality and integrations.

---

## 🌍 **NEW: Language Toggle Testing (30 seconds)**

### **Test Bilingual Functionality**
1. **Load the page** - Should default to English
2. **Click 🇪🇸 ES button** - Everything should translate to Spanish instantly
3. **Click 🇺🇸 EN button** - Should switch back to English
4. **Refresh page** - Should remember your language preference
5. **Check footer** - Should translate: "Pre-Lanzamiento Sudamérica" / "South America Pre-Launch"

### **Mobile Language Toggle**
- **Test on mobile** - Toggle should be positioned properly in top-right
- **Tap both flags** - Should work without issues on touch devices

---

## 🚀 Quick Test (2 minutes)

### **1. Start the Application**
```bash
cd /home/wmsgeorge/7kvenezuela
npm start
# or
npm run dev
```

### **2. Open Browser Console**
- Press `F12` or right-click → "Inspect"
- Go to "Console" tab
- Look for these messages:
  ```
  ✅ Supabase client initialized successfully
  ✅ Supabase connection test successful
  🥇 7k Metals South America Pre-Launch Lead Capture Form Initialized
  ```

### **3. Submit Test Form**
Fill out the form with test data:

| Field | Test Value |
|-------|------------|
| Referrer First Name | John |
| Referrer Last Name | Doe |
| Referrer Mobile | +1-555-0123 |
| Interest Level | High |
| Package Preferred | Legacy at $599 |
| Payment Methods | Credit Card + Digital Wallet USDT (select multiple) |
| Your First Name | Jane |
| Your Last Name | Smith |
| Your Mobile | +1-555-0456 |
| Your Email | jane@example.com |
| Mailing Address | 123 Main St, City, State 12345 |
| Notes | This is a test submission |

### **4. Verify Success**
- Look for: `Registration Successful!` message
- Check console for: `✅ Successfully submitted to Supabase`
- Check Supabase dashboard for new record

---

## 📱 **NEW: Payment Method Testing**

### **Test Checkbox Multi-Select**
1. **Desktop**: Should see 2-3 payment options per row in grid layout
2. **Mobile**: Should see single column layout with large touch targets
3. **Selection**: Click multiple payment methods - should highlight in gold
4. **"Other" option**: Should show text field when "Other" is selected
5. **Validation**: Try submitting without selecting any payment method - should show error

### **Test Payment Options**
Available payment methods to test:
- ✅ Credit Card
- ✅ Debit Card  
- ✅ Bank Transfer
- ✅ PayPal
- ✅ Digital Wallet USDT (NEW)
- ✅ Other (with text field)

---

## 🌍 **NEW: Bilingual Form Testing**

### **Test in Spanish**
1. **Switch to Spanish** (🇪🇸 ES button)
2. **Fill form in Spanish** - all labels should be translated
3. **Test validation errors** - should appear in Spanish
4. **Submit form** - success message should be in Spanish
5. **Check data storage** - form should submit properly in Spanish

### **Translation Coverage to Verify**
- ✅ Header: "¡Bienvenidos al Pre-Lanzamiento de Sudamérica!"
- ✅ Form labels: "Nombre", "Apellido", "Móvil", etc.
- ✅ Payment methods: "Tarjeta de Crédito", "Billetera Digital USDT"
- ✅ Validation messages: "Este campo es obligatorio"
- ✅ Submit button: "Enviar Registro"
- ✅ Footer: "Pre-Lanzamiento Sudamérica"

---

## 🔍 Detailed Testing Scenarios

### **Test 1: Successful Submission**
**Purpose**: Verify normal form submission works

**Steps**:
1. Fill all required fields with valid data
2. Submit form
3. Check success message appears
4. Verify data in Supabase Table Editor

**Expected Results**:
- ✅ Success message displays properly
- ✅ Data appears in `lead_submissions` table
- ✅ No errors in browser console

### **Test 2: Validation Errors**
**Purpose**: Test form validation

**Steps**:
1. Leave required fields empty
2. Try to submit
3. Enter invalid email format
4. Enter invalid phone number

**Expected Results**:
- ❌ Form shows validation errors
- ❌ Form doesn't submit until fixed
- ✅ Errors clear when fields are corrected

### **Test 3: "Other" Payment Method**
**Purpose**: Test conditional field display

**Steps**:
1. Check "Other" from payment method checkboxes
2. Verify text field appears below
3. Submit with empty "other" field
4. Submit with custom payment method

**Expected Results**:
- ✅ Text field shows/hides correctly when "Other" is checked/unchecked
- ✅ Empty "other" field submits as "other"
- ✅ Custom text submits correctly

### **Test 4: Simplified Form (No Shipping Address)**
**Purpose**: Verify shipping address fields are hidden

**Steps**:
1. Scroll through entire form
2. Look for shipping address section
3. Submit form with only mailing address

**Expected Results**:
- ✅ No shipping address field visible
- ✅ Form submits successfully with only mailing address

---

## ✅ **COMPREHENSIVE TEST CHECKLIST**

### **🌍 Language & Localization**
- [ ] English loads by default
- [ ] Spanish toggle works (🇪🇸 ES button)
- [ ] Language preference persists after refresh
- [ ] All form labels translate correctly
- [ ] Validation messages appear in selected language
- [ ] Footer translates properly
- [ ] Meta tags update for each language

### **📱 Mobile & Responsive Design**
- [ ] Language toggle positioned correctly on mobile
- [ ] Payment checkboxes display in single column on mobile
- [ ] Payment checkboxes display in grid on desktop
- [ ] Form is fully responsive on tablet sizes
- [ ] Touch targets are adequate size on mobile
- [ ] No horizontal scrolling on any device

### **💳 Payment Method Features**
- [ ] All 6 payment options are visible
- [ ] Multiple payment methods can be selected
- [ ] "Digital Wallet USDT" option is present
- [ ] "Other" checkbox shows text field when selected
- [ ] Payment validation prevents submission without selection
- [ ] Payment clarification note is visible and translated

### **📝 Form Functionality**
- [ ] All required fields show validation errors when empty
- [ ] Email validation works correctly
- [ ] Phone number validation accepts international formats
- [ ] Name fields only accept letters and spaces
- [ ] Form submits successfully with valid data
- [ ] Notes field is optional and working

### **🗄️ Data Storage**
- [ ] Supabase receives form submissions
- [ ] Google Sheets receives form submissions
- [ ] Data is stored correctly in both systems
- [ ] Multiple payment methods save as comma-separated values
- [ ] Spanish form submissions work properly
- [ ] Success message displays after submission

### **🧪 Browser Compatibility**
- [ ] Chrome/Chromium - all features work
- [ ] Firefox - all features work
- [ ] Safari - all features work (if available)
- [ ] Mobile browsers - all features work
- [ ] No console errors in any browser

**Pass Criteria**: All checkboxes must be ✅ before deployment
- ✅ Field re-enables when unchecked

### **Test 5: Error Handling**
**Purpose**: Test error scenarios

**Steps**:
1. Temporarily change Supabase URL to invalid
2. Submit form
3. Check error message
4. Restore correct URL

**Expected Results**:
- ❌ Clear error message displayed
- ✅ Form data saved to localStorage as backup
- ✅ No app crashes

---

## 📊 Supabase Dashboard Verification

### **1. View Submissions**
1. Go to Supabase Dashboard
2. Click "Table Editor" → `lead_submissions`
3. Verify test data appears correctly

### **2. Check Data Integrity**
Verify these fields are populated correctly:
- `created_at` - Current timestamp
- `referred_by_*` - Referrer information
- `interest_level` - Radio button selection
- `package_preferred` - Radio button selection
- `payment_method` - Dropdown selection or custom text
- `contact_*` - Contact information
- `mailing_address` - Text area content
- `notes` - Text content or null

### **3. SQL Query Testing**
Run these queries in SQL Editor:

```sql
-- View recent submissions
SELECT * FROM lead_submissions ORDER BY created_at DESC LIMIT 5;

-- Count submissions by interest level
SELECT interest_level, COUNT(*) FROM lead_submissions GROUP BY interest_level;

-- Find submissions with notes
SELECT contact_first_name, contact_last_name, notes 
FROM lead_submissions 
WHERE notes IS NOT NULL;
```

---

## 🌐 Browser Compatibility Testing

Test in multiple browsers:

### **Chrome/Chromium**
- ✅ Form loads correctly
- ✅ Validation works
- ✅ Submission successful

### **Firefox**
- ✅ All features work
- ✅ Console shows correct messages

### **Safari** (if available)
- ✅ Mobile responsiveness
- ✅ Touch interactions

### **Mobile Browsers**
- ✅ Form fits screen
- ✅ Inputs are accessible
- ✅ Submission works on mobile data

---

## 🔧 Debugging Tools

### **Browser Console Commands**

```javascript
// Check Supabase client status
getSupabaseClient();

// Test connection manually
testSupabaseConnection();

// View stored form data
JSON.parse(localStorage.getItem('7kMetalsSubmissions'));

// Check form instance
document.querySelector('#leadCaptureForm');

// Manually trigger form validation
document.querySelector('#leadCaptureForm').reportValidity();
```

### **Network Tab Debugging**
1. Open Browser DevTools → Network tab
2. Submit form
3. Look for requests to `supabase.co`
4. Check request payload and response

**Successful Request**:
- Status: `201 Created`
- Response: Contains `id` field
- No CORS errors

---

## 📱 Mobile Testing

### **Responsive Design Check**
- [ ] Form fits mobile screen
- [ ] All buttons are tappable
- [ ] Text is readable
- [ ] Inputs work with mobile keyboards

### **Touch Interactions**
- [ ] Radio buttons respond to touch
- [ ] Dropdown works on mobile
- [ ] Checkboxes toggle correctly
- [ ] Form scrolls smoothly

### **Mobile-Specific Issues**
- Check phone number formatting
- Verify email keyboard appears
- Test form submission on cellular data

---

## 🚨 Common Issues & Solutions

### **❌ Issue: "Supabase client not initialized"**
**Solution**: Check `supabase-config.js` credentials

### **❌ Issue: Form submits but no data in Supabase**
**Debugging Steps**:
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check Supabase project isn't paused
4. Verify RLS policies are correct

### **❌ Issue: Validation not working**
**Solution**: Check HTML5 validation attributes and JavaScript event listeners

### **❌ Issue: Phone formatting breaks**
**Solution**: Check `formatPhoneNumber` function and input event listeners

---

## 📈 Performance Testing

### **Load Time Testing**
- [ ] Page loads under 3 seconds
- [ ] Supabase CDN loads quickly
- [ ] No JavaScript errors on load

### **Form Submission Speed**
- [ ] Submission completes under 5 seconds
- [ ] Loading state shows during submission
- [ ] Success message appears promptly

### **Memory Usage**
- Check browser DevTools → Performance tab
- Verify no memory leaks after multiple submissions

---

## ✅ Final Verification Checklist

### **Functionality**
- [ ] All form fields work correctly
- [ ] Validation prevents invalid submissions
- [ ] Success/error messages display properly
- [ ] Data saves to Supabase correctly
- [ ] Fallback to localStorage works
- [ ] Mobile responsiveness confirmed

### **Data Integrity**
- [ ] All form fields map to database columns
- [ ] Boolean values save correctly
- [ ] Text areas handle line breaks
- [ ] Special characters don't break submission
- [ ] Null values handled properly

### **User Experience**
- [ ] Form provides clear feedback
- [ ] Loading states work correctly
- [ ] Error messages are helpful
- [ ] Success confirmation is clear
- [ ] Form resets after successful submission

### **Security**
- [ ] Only anon key used in frontend
- [ ] RLS policies prevent unauthorized access
- [ ] No sensitive data logged to console
- [ ] HTTPS used for all requests

---

## 🎯 Production Readiness

Before going live, ensure:

1. **Replace test data** with real submissions
2. **Monitor error rates** in browser console
3. **Set up backup procedures** for form data
4. **Test with real users** on different devices
5. **Monitor Supabase usage** to avoid quotas

---

**🎉 If all tests pass, your lead capture form is ready for production!**