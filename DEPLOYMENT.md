# Deployment Guide

This guide covers deploying Moodily to production using Vercel and Supabase.

## Prerequisites

- A Supabase project (free tier works fine)
- A Vercel account (free tier works fine)
- Your code pushed to GitHub

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Project name: `moodily` (or your choice)
   - Database Password: (generate a strong one)
   - Region: Choose closest to your users
4. Wait for the project to be created

### 1.2 Apply Database Migrations

Option A - Using Supabase Dashboard:
1. Go to your project dashboard
2. Click "SQL Editor" in the sidebar
3. Copy the contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste into a new query
5. Click "Run" to execute

Option B - Using Supabase CLI:
```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 1.3 Configure Authentication

1. In Supabase Dashboard, go to "Authentication" → "Providers"
2. Enable "Email" provider (should be enabled by default)
3. Go to "Authentication" → "URL Configuration"
4. Add your production URL (e.g., `https://moodily.vercel.app`)
5. Add redirect URLs:
   - `https://moodily.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

### 1.4 Get Your API Keys

1. Go to "Settings" → "API"
2. Copy these values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 2.2 Configure Environment Variables

In the "Configure Project" section, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **Important**: Never commit real API keys to Git!

### 2.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete (1-2 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### 2.4 Update Supabase URLs

Go back to Supabase Dashboard:
1. "Authentication" → "URL Configuration"
2. Update Site URL to your Vercel URL
3. Add Vercel URL to redirect URLs

## Step 3: Set Up Daily Reminders (Optional)

### 3.1 Deploy Edge Function

```bash
# Deploy the function
supabase functions deploy daily-reminder

# Set environment variable for the function
supabase secrets set APP_URL=https://your-app.vercel.app
```

### 3.2 Enable pg_cron Extension

1. In Supabase Dashboard, go to "Database" → "Extensions"
2. Search for "pg_cron"
3. Click "Enable" next to pg_cron

### 3.3 Schedule the Cron Job

1. Go to "SQL Editor"
2. Run this SQL (adjust time as needed):

```sql
-- Schedule daily reminders at 9 AM UTC
SELECT cron.schedule(
  'daily-reminder-job',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://your-project-ref.supabase.co/functions/v1/daily-reminder',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

Replace:
- `your-project-ref` with your actual project ref
- `YOUR_SERVICE_ROLE_KEY` with your service role key
- `0 9 * * *` with your preferred time ([cron format](https://crontab.guru))

### 3.4 Verify Cron Job

Check scheduled jobs:
```sql
SELECT * FROM cron.job;
```

## Step 4: Configure Email Sending (Optional)

The edge function currently logs email reminders. To actually send emails:

### Option A: Use Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to Supabase secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your-resend-api-key
   ```
4. Update `supabase/functions/daily-reminder/index.ts` to use Resend

### Option B: Use SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Add to Supabase secrets
4. Update edge function to use SendGrid

## Step 5: Set Up Analytics (Optional)

### Plausible (Recommended)

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add this to `app/layout.tsx` in the `<head>`:

```tsx
<Script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"
/>
```

### PostHog

1. Sign up at [posthog.com](https://posthog.com)
2. Install: `npm install posthog-js`
3. Initialize in your layout component

## Step 6: Custom Domain (Optional)

### On Vercel:

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Update Supabase:

1. Update Site URL and Redirect URLs in Supabase Dashboard
2. Update APP_URL secret for edge function

## Monitoring & Maintenance

### Check Supabase Logs

1. Go to "Logs" in Supabase Dashboard
2. Monitor for errors or issues

### Check Vercel Logs

1. Go to your project in Vercel
2. Click "Logs" tab
3. Monitor for errors

### Database Backups

Supabase automatically backs up your database daily (free tier: 7 days retention)

## Troubleshooting

### Users can't sign in

- Check Supabase auth settings
- Verify redirect URLs are correct
- Check email provider settings

### Reminders not sending

- Verify cron job is scheduled (check `cron.job` table)
- Check edge function logs
- Ensure service role key is correct

### Build fails on Vercel

- Check environment variables are set
- Look at build logs for specific errors
- Ensure all dependencies are in package.json

### Database errors

- Check RLS policies are applied
- Verify migrations ran successfully
- Check Supabase logs for SQL errors

## Security Checklist

- [ ] Service role key is only in Vercel/Supabase secrets, never in code
- [ ] RLS policies are enabled on all tables
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] Auth URLs are whitelisted in Supabase
- [ ] Regular security updates (`npm audit fix`)

## Cost Estimates

**Free Tier (perfectly fine for MVP):**
- Supabase: Free (up to 500MB database, 2GB bandwidth)
- Vercel: Free (100GB bandwidth, unlimited deployments)
- Total: $0/month

**If you outgrow free tier:**
- Supabase Pro: $25/month (8GB database, 250GB bandwidth)
- Vercel Pro: $20/month (1TB bandwidth, better performance)
- Total: ~$45/month

## Next Steps

1. Test the deployed app thoroughly
2. Set up monitoring/alerts
3. Invite beta users
4. Collect feedback
5. Iterate!

---

Need help? Check the README or open a GitHub issue.
