# Moodily

A simple, privacy-focused daily mood and energy tracker. Build streaks, see trends, and understand your patterns.

## Features

- 🔐 **Magic Link Authentication** - Passwordless sign-in via email
- 📊 **Daily Check-ins** - Track mood and energy on a 1-5 scale
- 📈 **Trend Visualization** - 14-day sparkline charts
- 🔥 **Streak Tracking** - Build and maintain daily check-in streaks
- 📧 **Email Reminders** - Optional daily reminders to check in
- 🔒 **Privacy First** - Your data belongs to you, with self-serve deletion
- 📱 **Mobile Responsive** - Optimized for mobile-first experience

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Data Visualization**: Recharts
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel + Supabase

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A Supabase account and project
- (Optional) Vercel account for deployment

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/moodily.git
cd moodily
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**

Run the migration in your Supabase SQL editor:

```bash
# Copy the contents of supabase/migrations/20240101000000_initial_schema.sql
# and run it in your Supabase SQL editor
```

5. **Configure Supabase Auth**

In your Supabase project settings:
- Enable Email provider in Authentication > Providers
- Add your site URL to Authentication > URL Configuration

6. **Deploy the Edge Function** (Optional, for reminders)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the edge function
supabase functions deploy daily-reminder

# Set up a cron job in Supabase Dashboard to call this function daily
```

7. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
moodily/
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Main dashboard
│   ├── settings/            # User settings
│   ├── privacy/             # Privacy policy
│   └── terms/               # Terms of service
├── components/              # React components
│   ├── ui/                  # UI components (badges, cards)
│   ├── forms/               # Form components
│   └── charts/              # Chart components
├── lib/                     # Utility libraries
│   ├── supabase/           # Supabase client configs
│   ├── hooks/              # React hooks
│   └── utils/              # Utility functions
├── supabase/               # Supabase configs
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
└── types/                  # TypeScript types
```

## Database Schema

### `profiles` Table
- `user_id` (uuid, PK) - References auth.users
- `timezone` (text) - User's timezone
- `notification_pref` (text) - 'email', 'push', or 'none'
- `paused_until` (date) - Pause reminders until this date

### `entries` Table
- `id` (uuid, PK)
- `user_id` (uuid, FK) - References auth.users
- `mood` (int) - 1-5 scale
- `energy` (int) - 1-5 scale
- `note` (text, nullable) - Max 60 characters
- `created_at` (timestamptz) - Entry timestamp

### `user_streaks` View
- Calculated view showing current and longest streaks per user

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Deploy Edge Functions to Supabase

```bash
supabase functions deploy daily-reminder
```

Set up a daily cron job in Supabase Dashboard to trigger the reminder function.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Privacy & Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Self-serve account deletion
- No PII beyond email
- All mood data is private and scoped to users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
