# Moodily Setup Guide

This guide will help you set up Moodily from scratch.

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- A Supabase account (free tier works fine)
- (Optional) A Vercel account for deployment

## Important Notes

### Known Limitations

1. **Streak Calculation**: The streak view uses UTC dates. Users in different timezones may experience streaks breaking at unexpected times. For production, consider implementing timezone-aware streak calculation on the client side or in a custom SQL function.

2. **Account Deletion**: The current implementation deletes user data (entries and profiles) but does not delete the auth user itself (requires service role key). You may want to implement an admin API endpoint for complete account deletion.

3. **Email Reminders**: The Edge Function logs emails but doesn't actually send them. You need to integrate with an email service (SendGrid, Resend, etc.) for production use.

## Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/moodily.git
cd moodily
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

### 2.2 Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

### 2.3 Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.4 Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run"

This will create:
- `profiles` table
- `entries` table
- `user_streaks` view
- All necessary RLS policies

### 2.5 Configure Authentication

1. In Supabase, go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. Go to **Authentication** > **URL Configuration**
4. Add your site URL:
   - For local development: `http://localhost:3000`
   - For production: Your production URL (e.g., `https://moodily.vercel.app`)
5. Add the following redirect URLs:
   - `http://localhost:3000/auth/callback` (local)
   - `https://your-domain.com/auth/callback` (production)

## Step 3: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test the Application

1. Go to the sign-in page
2. Enter your email
3. Check your email for the magic link
4. Click the link to sign in
5. You should be redirected to the dashboard
6. Try creating your first mood check-in!

## Step 5: Deploy to Vercel (Optional)

### 5.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 5.2 Deploy

```bash
vercel
```

Follow the prompts to:
1. Link to an existing project or create a new one
2. Confirm the project settings

### 5.3 Add Environment Variables

In the Vercel dashboard:
1. Go to your project **Settings** > **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click "Save"
4. Redeploy your project

## Step 6: Set Up Daily Reminders (Optional)

### 6.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 6.2 Login and Link Project

```bash
supabase login
supabase link --project-ref your-project-ref
```

Find your project ref in the Supabase dashboard URL:
`https://app.supabase.com/project/[YOUR-PROJECT-REF]`

### 6.3 Deploy Edge Function

```bash
supabase functions deploy daily-reminder
```

### 6.4 Set Up Cron Job

1. In Supabase dashboard, go to **Database** > **Cron**
2. Click "Create a new cron job"
3. Set:
   - **Name**: `daily-reminder`
   - **Schedule**: `0 9 * * *` (runs at 9 AM UTC daily)
   - **Command**: 
   ```sql
   SELECT
     net.http_post(
       url:='https://[YOUR-PROJECT-REF].supabase.co/functions/v1/daily-reminder',
       headers:='{"Content-Type": "application/json", "Authorization": "Bearer [YOUR-ANON-KEY]"}'::jsonb
     ) as request_id;
   ```
4. Replace `[YOUR-PROJECT-REF]` and `[YOUR-ANON-KEY]` with your values

Note: For production, integrate with an email service like SendGrid or Resend to actually send emails.

## Troubleshooting

### Build Fails

If the build fails, make sure:
- You have Node.js 20+ installed
- All dependencies are installed (`npm install`)
- Environment variables are set correctly

### Authentication Not Working

If authentication isn't working:
- Check that your Supabase URL and anon key are correct
- Verify that email provider is enabled in Supabase
- Check that redirect URLs are configured in Supabase
- Make sure you're checking the correct email inbox

### Database Errors

If you see database errors:
- Verify the migration ran successfully
- Check that RLS policies are enabled
- Make sure you're authenticated (signed in)

### Supabase Functions Issues

If edge functions aren't working:
- Verify the function was deployed successfully
- Check that your service role key is set (if needed)
- Look at function logs in Supabase dashboard

## Next Steps

Once you have everything working:

1. **Customize**: Update colors, fonts, and branding to match your style
2. **Add Features**: Consider adding:
   - Export data functionality
   - More detailed analytics
   - Custom mood/energy categories
   - Notes with more characters
   - Photo uploads
3. **Email Service**: Integrate a proper email service for reminders
4. **Analytics**: Set up proper analytics (PostHog, Plausible, etc.)
5. **Error Monitoring**: Add Sentry or similar for production error tracking

## Support

If you encounter issues:
- Check the GitHub Issues page
- Review Supabase documentation
- Check Next.js documentation

## Security Notes

- Never commit your `.env.local` file
- Keep your service role key secure (never expose in client-side code)
- Regularly review Supabase security settings
- Monitor for suspicious activity in your dashboard

## License

MIT License - see LICENSE file for details
