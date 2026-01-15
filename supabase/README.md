# Supabase Configuration

This directory contains Supabase-specific configuration and migrations.

## Setup Instructions

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Link to your Supabase project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Apply migrations**:
   ```bash
   supabase db push
   ```

4. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy daily-reminder
   ```

5. **Set up cron job for daily reminders**:
   
   In your Supabase dashboard, go to Database > Extensions and enable `pg_cron`.
   
   Then run this SQL:
   ```sql
   -- Schedule the daily reminder function to run at 9 AM UTC daily
   SELECT cron.schedule(
     'daily-reminder-job',
     '0 9 * * *', -- Cron expression for 9 AM UTC
     $$
     SELECT
       net.http_post(
         url:='https://your-project-ref.supabase.co/functions/v1/daily-reminder',
         headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
       ) as request_id;
     $$
   );
   ```

## Database Schema

### Tables:
- **profiles**: User preferences (timezone, notification settings)
- **entries**: Daily mood and energy check-ins

### Views:
- **user_streaks**: Calculates user streaks using gaps-and-islands technique

### Functions:
- **get_current_streak**: Returns current streak length for a user
- **handle_new_user**: Automatically creates profile on user signup

## Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data.
