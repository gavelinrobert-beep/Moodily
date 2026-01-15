-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone TEXT DEFAULT 'UTC',
  notification_pref TEXT DEFAULT 'email' CHECK (notification_pref IN ('email', 'push', 'none')),
  paused_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  energy INTEGER NOT NULL CHECK (energy >= 1 AND energy <= 5),
  note TEXT CHECK (LENGTH(note) <= 60),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id and created_at for efficient queries
CREATE INDEX IF NOT EXISTS idx_entries_user_created ON entries(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Entries RLS Policies
CREATE POLICY "Users can view own entries"
  ON entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON entries FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create streak view using gaps-and-islands technique
-- Note: This view calculates streaks using UTC dates. For timezone-aware streaks,
-- the application should filter/adjust dates on the client side or in queries
CREATE OR REPLACE VIEW user_streaks AS
WITH daily_entries AS (
  SELECT DISTINCT
    user_id,
    DATE(created_at) AS entry_date
  FROM entries
),
grouped_entries AS (
  SELECT
    user_id,
    entry_date,
    entry_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY entry_date))::INTEGER AS grp
  FROM daily_entries
),
streaks AS (
  SELECT
    user_id,
    MIN(entry_date) AS streak_start,
    MAX(entry_date) AS streak_end,
    COUNT(*) AS streak_length
  FROM grouped_entries
  GROUP BY user_id, grp
)
SELECT
  user_id,
  COALESCE(
    MAX(CASE 
      WHEN streak_end = CURRENT_DATE OR streak_end = CURRENT_DATE - INTERVAL '1 day'
      THEN streak_length 
      ELSE 0 
    END),
    0
  ) AS current_streak,
  COALESCE(MAX(streak_length), 0) AS longest_streak
FROM streaks
GROUP BY user_id;
