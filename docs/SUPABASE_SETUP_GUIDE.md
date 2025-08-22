# 🚀 Complete Supabase Setup Guide
## 7k Metals South America Pre-Launch Lead Capture Form

This guide will walk you through setting up Supabase integration for the lead capture form in **15 minutes**.

---

## 📋 Step 1: Create Free Supabase Account

1. **Visit Supabase**: Go to [https://supabase.com](https://supabase.com)
2. **Sign Up**: Click "Start your project" and create account (GitHub/Google recommended)
3. **Create Project**: 
   - Click "New Project"
   - Choose organization (or create new one)
   - Enter project name: `7k-metals-south-america`
   - Enter database password (save this somewhere safe!)
   - Select region closest to your users
   - Click "Create new project"

**⏱️ Wait 2-3 minutes** for project to initialize.

---

## 🗄️ Step 2: Create Database Table

1. **Open SQL Editor**: In your Supabase dashboard, click "SQL Editor" in sidebar
2. **Run Schema**: Copy and paste the entire contents of `docs/supabase-database-schema.sql`
3. **Execute**: Click "Run" button
4. **Verify**: You should see "Success. No rows returned" message

**✅ Expected Result**: Table `lead_submissions` created with all columns and policies.

---

## 🔑 Step 3: Get Your Credentials

1. **Go to Settings**: Click gear icon ⚙️ in sidebar
2. **API Settings**: Click "API" in settings menu
3. **Copy Credentials**:
   - **Project URL**: Copy the URL (looks like `https://abcdefg.supabase.co`)
   - **Anon Public Key**: Copy the `anon` `public` key (long string starting with `eyJ`)

**⚠️ Important**: The anon key is safe for frontend use. Never use the `service_role` key in frontend code!

---

## ⚙️ Step 4: Configure Your Application

1. **Open Configuration File**: Edit `src/js/supabase-config.js`
2. **Replace Placeholders**:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://vephxwkhhwjakzjrhlvq.supabase.co',  // 👈 Paste your Project URL here
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcGh4d2toaHdqYWt6anJobHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjY1MjUsImV4cCI6MjA3MTQwMjUyNX0.ZAXTXCulreaoOqMwCXvjNrXrzEHk6g3_j8Jklf9soyk'  // 👈 Paste your Anon Key here
};
```

3. **Save File**: Ctrl+S / Cmd+S

---

## 🧪 Step 5: Test the Integration

### **Local Testing**

1. **Start Development Server**:
   ```bash
   npm run dev
   # or
   npm start
   ```

2. **Open Browser**: Go to `http://localhost:3000`

3. **Fill Out Form**: Enter test data in all required fields

4. **Submit**: Click "Submit Registration"

5. **Check Browser Console**: 
   - Press F12 → Console tab
   - Look for: `✅ Successfully submitted to Supabase`

### **Verify in Supabase Dashboard**

1. **Go to Table Editor**: Click "Table Editor" in Supabase sidebar
2. **Select Table**: Click `lead_submissions`
3. **Check Data**: You should see your test submission

---

## 🔍 Step 6: Monitor Submissions

### **Real-time Viewing**
- **Supabase Dashboard** → Table Editor → `lead_submissions`
- Data appears instantly after form submission

### **Export Data**
1. In Table Editor, click "..." menu
2. Select "Download as CSV"

### **Advanced Queries**
Use the SQL Editor for custom reports:
```sql
-- Recent submissions (last 24 hours)
SELECT * FROM lead_submissions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Summary by interest level
SELECT interest_level, COUNT(*) as count
FROM lead_submissions 
GROUP BY interest_level;

-- Package preferences
SELECT package_preferred, COUNT(*) as count
FROM lead_submissions 
GROUP BY package_preferred;
```

---

## 🚨 Troubleshooting

### **Error: "Supabase client not initialized"**
- **Cause**: Invalid URL or API key
- **Fix**: Double-check your credentials in `supabase-config.js`

### **Error: "Failed to initialize Supabase"**
- **Cause**: Network issue or incorrect URL format
- **Fix**: Ensure URL starts with `https://` and ends with `.supabase.co`

### **Error: "relation 'lead_submissions' does not exist"**
- **Cause**: Database table not created
- **Fix**: Re-run the SQL schema from Step 2

### **Form submits but no data in Supabase**
- **Check**: Browser console for error messages
- **Verify**: Network tab shows successful POST to Supabase
- **Fallback**: Data is stored in localStorage as backup

### **Browser Console Commands for Testing**
```javascript
// Test Supabase connection
testSupabaseConnection();

// Check if Supabase is initialized
console.log(getSupabaseClient());

// View localStorage backup data
console.log(JSON.parse(localStorage.getItem('7kMetalsSubmissions')));
```

---

## 🔒 Security Notes

### **What's Safe**
- ✅ Using anon key in frontend code
- ✅ Row Level Security is enabled
- ✅ Only INSERT permissions for anonymous users

### **What to Avoid**
- ❌ Never use `service_role` key in frontend
- ❌ Don't commit real credentials to public repos
- ❌ Don't disable Row Level Security

---

## 🎯 Production Checklist

- [ ] Supabase project created
- [ ] Database table created with correct schema
- [ ] Credentials added to `supabase-config.js`
- [ ] Test form submission successful
- [ ] Data visible in Supabase dashboard
- [ ] Error handling tested (try submitting with invalid data)
- [ ] Browser console shows no JavaScript errors
- [ ] Form works in different browsers
- [ ] Mobile responsiveness verified

---

## 📞 Need Help?

### **Common Issues & Solutions**

1. **CORS Errors**: Supabase handles CORS automatically - if you see CORS errors, check your URL
2. **Network Errors**: Check your internet connection and Supabase project status
3. **Data Not Saving**: Verify RLS policies are correctly set
4. **Performance Issues**: Consider adding database indexes for large datasets

### **Supabase Resources**
- [Documentation](https://supabase.com/docs)
- [JavaScript Client Guide](https://supabase.com/docs/reference/javascript/installing)
- [Community Discord](https://discord.supabase.com/)

### **Project-Specific Help**
- Check browser console for detailed error messages
- Verify all form fields are filled correctly
- Ensure Supabase project is not paused (free tier auto-pauses after inactivity)

---

## 🔄 Next Steps

Once everything is working:

1. **Custom Domain**: Set up custom domain in Supabase settings
2. **Email Notifications**: Add email triggers for new submissions
3. **Analytics**: Connect to Google Analytics or similar
4. **Data Export**: Set up automated reports
5. **Monitoring**: Add uptime monitoring for your forms

---

**🎉 Congratulations! Your lead capture form is now connected to Supabase and ready to collect submissions!**