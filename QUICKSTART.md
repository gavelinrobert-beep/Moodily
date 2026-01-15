# Quick Start Guide

Get Moodily running in 5 minutes!

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- A Supabase account ([sign up free](https://supabase.com))

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/gavelinrobert-beep/Moodily.git
cd Moodily

# Install dependencies
npm install

# Or use the setup script (Unix/Mac)
chmod +x setup.sh
./setup.sh
```

## Step 2: Set Up Supabase (2 minutes)

### Create a Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Give it a name (e.g., "moodily")
4. Choose a database password
5. Select a region close to you
6. Click "Create new project"

### Apply Database Schema

While your project is being created, it will take about 2 minutes. Once ready:

1. Click "SQL Editor" in the sidebar
2. Click "New query"
3. Copy the contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste it into the editor
5. Click "Run" or press Cmd/Ctrl + Enter

### Get Your API Keys

1. Go to "Settings" → "API" in the sidebar
2. You'll see:
   - **Project URL** - Copy this
   - **anon/public** key - Copy this

## Step 3: Configure Environment (30 seconds)

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
# Replace the placeholder values with your actual keys
```

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-actual-key-here...
```

## Step 4: Configure Auth (30 seconds)

In your Supabase dashboard:

1. Go to "Authentication" → "URL Configuration"
2. Add to "Site URL": `http://localhost:3000`
3. Add to "Redirect URLs": `http://localhost:3000/auth/callback`
4. Click "Save"

## Step 5: Run! (10 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the sign-in page! 🎉

## First Login

1. Enter your email address
2. Click "Send magic link"
3. Check your email
4. Click the link
5. You'll be redirected to the dashboard
6. Make your first mood check-in!

## Common Issues

### "Invalid API key" or connection errors
- Double-check your `.env.local` file
- Make sure you copied the entire API key (they're long!)
- Restart the dev server: `Ctrl+C` then `npm run dev`

### Email not arriving
- Check spam folder
- In Supabase dashboard, check "Authentication" → "Users" to see if sign-up was recorded
- Verify your email domain isn't blocked

### Database errors
- Make sure you ran the migration SQL
- Check "Database" → "Tables" in Supabase to verify tables exist
- Look for errors in the SQL Editor if the migration failed

### Build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Make sure you're using Node.js 18+

## Next Steps

✅ **You're all set!** Now you can:

- Make daily check-ins
- Watch your streak grow
- View your mood trends
- Customize settings

## Need Help?

- Check the full [README.md](README.md)
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Open an issue on GitHub

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Run production build locally
npm run lint       # Check code style
npm run type-check # Check TypeScript types
```

Happy mood tracking! 🎭✨
