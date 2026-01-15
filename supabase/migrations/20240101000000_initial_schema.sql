-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  notification_pref TEXT NOT NULL DEFAULT 'email' CHECK (notification_pref IN ('email', 'push', 'none')),
  paused_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  energy INTEGER NOT NULL CHECK (energy >= 1 AND energy <= 5),
  note TEXT CHECK (LENGTH(note) <= 60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on created_at for efficient queries
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, DATE(created_at));

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
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

-- Entries policies
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

-- Create streak view using gaps-and-islands technique
CREATE OR REPLACE VIEW user_streaks AS
WITH daily_entries AS (
  SELECT 
    user_id,
    DATE(created_at AT TIME ZONE COALESCE(p.timezone, 'UTC')) AS entry_date
  FROM entries e
  LEFT JOIN profiles p ON e.user_id = p.user_id
  GROUP BY user_id, DATE(created_at AT TIME ZONE COALESCE(p.timezone, 'UTC'))
),
entry_groups AS (
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
  FROM entry_groups
  GROUP BY user_id, grp
)
SELECT
  user_id,
  streak_start,
  streak_end,
  streak_length,
  CASE 
    WHEN streak_end = CURRENT_DATE THEN TRUE
    WHEN streak_end = CURRENT_DATE - INTERVAL '1 day' THEN TRUE
    ELSE FALSE
  END AS is_current_streak
FROM streaks;

-- Function to get current streak for a user
CREATE OR REPLACE FUNCTION get_current_streak(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(MAX(streak_length), 0)
  FROM user_streaks
  WHERE user_id = p_user_id AND is_current_streak = TRUE;
$$ LANGUAGE SQL STABLE;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, timezone, notification_pref)
  VALUES (NEW.id, 'UTC', 'email');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
