# Moodily - Daily Mood & Energy Tracker

A simple, privacy-focused app for tracking your daily mood and energy levels. Built with Next.js 14, Supabase, and Tailwind CSS.

## Features

✨ **Core Functionality**
- 🎭 Quick daily check-in (mood + energy on 1-5 scale)
- 📝 Optional 60-character notes
- 📊 Weekly trend visualization
- 🔥 Streak tracking with gaps-and-islands algorithm
- 📈 Week-over-week comparison

🔐 **Authentication & Privacy**
- Magic link authentication (no passwords!)
- Row-level security (RLS) on all data
- Self-serve account deletion
- No PII beyond email
- Privacy and Terms pages

⚙️ **Settings & Preferences**
- Timezone configuration
- Email reminder preferences
- Pause/snooze reminders
- Data export (CSV/JSON)
- Full data control

📧 **Reminders**
- Daily email reminders via Supabase Edge Functions
- Cron-scheduled delivery
- Respects user preferences and pauses

📊 **Analytics** (Ready for integration)
- Event tracking structure in place
- Easy integration with Plausible, PostHog, or Google Analytics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Auth**: Supabase Auth (Magic Links)
- **State Management**: React Query / Tanstack Query
- **Notifications**: Sonner (Toast notifications)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- (Optional) Vercel account for deployment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gavelinrobert-beep/Moodily.git
   cd Moodily
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Set up Supabase**
   
   a. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```
   
   b. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   
   c. Apply database migrations:
   ```bash
   supabase db push
   ```
   
   Or manually run the SQL in `supabase/migrations/20240101000000_initial_schema.sql` in your Supabase SQL Editor.

5. **Deploy Edge Functions** (Optional - for reminders)
   ```bash
   supabase functions deploy daily-reminder
   ```
   
   Set up the cron job (see `supabase/README.md` for details).

6. **Configure email authentication**
   
   In your Supabase dashboard:
   - Go to Authentication > Settings
   - Enable "Email" provider
   - Configure email templates (optional)
   - Set Site URL to your app URL (e.g., `http://localhost:3000` for dev)
   - Add redirect URLs as needed

7. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
moodily/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Main dashboard
│   ├── settings/             # User settings
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (redirects)
├── components/               # React components
│   ├── MoodCheckin.tsx       # Daily check-in form
│   ├── StreakBadge.tsx       # Streak display
│   ├── WeekComparison.tsx    # Week-over-week stats
│   └── WeeklyTrend.tsx       # Trend chart
├── lib/                      # Utilities and helpers
│   ├── supabase/             # Supabase client configs
│   └── analytics.ts          # Analytics tracking
├── supabase/                 # Supabase configuration
│   ├── migrations/           # Database migrations
│   └── functions/            # Edge Functions
└── public/                   # Static assets
```

## Database Schema

### Tables

**profiles**
- `user_id` (UUID, PK) - References auth.users
- `timezone` (TEXT) - User's timezone
- `notification_pref` (TEXT) - 'email', 'push', or 'none'
- `paused_until` (DATE) - Pause reminders until date

**entries**
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References auth.users
- `mood` (INTEGER 1-5)
- `energy` (INTEGER 1-5)
- `note` (TEXT, max 60 chars)
- `created_at` (TIMESTAMPTZ)

### Views

**user_streaks** - Calculates current and historical streaks using gaps-and-islands technique

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up preview deployments for PRs
- Configure SSL/HTTPS

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for Edge Functions)

## Analytics Integration

The app has analytics event tracking ready. To integrate:

1. **Plausible** (Recommended - privacy-focused)
   ```tsx
   // Add to app/layout.tsx <head>
   <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
   ```

2. **PostHog**
   ```bash
   npm install posthog-js
   ```
   Then initialize in your layout.

3. **Google Analytics**
   Add GA4 script to your layout.

Events tracked:
- `sign_up` - User signs up
- `check_in` - User completes check-in
- `streak_length` - Current streak
- `chart_view` - Views trend chart
- More in `lib/analytics.ts`

## Customization

### Styling
- Colors and theme: Edit `tailwind.config.ts` and `app/globals.css`
- Mood emojis: Edit `components/MoodCheckin.tsx`

### Reminders
- Change reminder time: Edit cron expression in Supabase
- Customize email template: Edit `supabase/functions/daily-reminder/index.ts`

## Privacy & Security

- ✅ Row-level security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Magic link authentication (no password storage)
- ✅ Self-serve data deletion
- ✅ Minimal PII collection
- ✅ HTTPS enforced in production

## Roadmap

Future enhancements (not in MVP):
- [ ] Push notifications
- [ ] Custom reminder times per user
- [ ] Mood pattern insights
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

## Contributing

This is an MVP project. Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open a GitHub issue
- Check existing issues first

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Sonner](https://sonner.emilkowal.ski/)

---

**Note**: This is an MVP. The app is designed for personal wellness tracking and is not a medical or mental health tool. Always consult healthcare professionals for medical advice.
