# SUPABASE AUTHENTICATION CONFIGURATION CHECKLIST

## 🔧 CRITICAL: Check These Settings in Supabase Dashboard

### 1. Authentication Settings
- Go to: **Authentication > Settings**
- **Enable email confirmations**: 
  - ✅ **DISABLE** for testing (enable later for production security)
  - Or configure email templates properly

### 2. URL Configuration
- **Site URL**: Add your production URL (e.g., `https://your-app.netlify.app`)
- **Redirect URLs**: Add both:
  - `https://your-app.netlify.app`
  - `https://your-app.netlify.app/**`
  - `http://localhost:5173` (for development)

### 3. Email Templates
- Go to: **Authentication > Email Templates**
- Configure "Confirm signup" template
- Set proper redirect URLs in templates

### 4. User Management
- Go to: **Authentication > Users**
- Check if users are being created but not confirmed
- Manually confirm users if needed for testing

### 5. Security Settings
- **Enable CAPTCHA**: Consider enabling for production
- **Rate limiting**: Configure as needed

## 🚨 QUICK FIXES FOR IMMEDIATE TESTING

### Option A: Disable Email Confirmation (Testing Only)
```
1. Go to Authentication > Settings
2. Turn OFF "Enable email confirmations"
3. Users can sign up and sign in immediately
```

### Option B: Manual User Confirmation
```
1. User signs up
2. Go to Authentication > Users in Supabase dashboard
3. Find the user and click "Send confirmation email" or manually confirm
```

### Option C: Use Test Email Service
```
1. Configure email service (SendGrid, etc.)
2. Set up proper SMTP settings
3. Test email delivery
```

## 🔍 DEBUGGING STEPS

### Check Browser Console in Production:
1. Open DevTools > Console
2. Look for Supabase-related errors
3. Check network requests to Supabase
4. Verify environment variables are loaded

### Test Authentication Flow:
1. Try signing up with a test email
2. Check Supabase Users table
3. Attempt sign in
4. Check session persistence
5. Test sign out functionality

## 📧 EMAIL CONFIGURATION (Required for Production)

### If using custom email service:
```
SMTP Host: your-smtp-host.com
SMTP Port: 587 (or 465 for SSL)
SMTP User: your-email@domain.com
SMTP Password: your-app-password
```

### Popular email services:
- **SendGrid**: Easy setup, reliable
- **AWS SES**: Cost-effective for high volume
- **Mailgun**: Developer-friendly
- **Resend**: Modern alternative
