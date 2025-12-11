-- ============================================
-- FOOTPREDICT AI - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & PROFILES
-- ============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  credits_remaining INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TEAMS
-- ============================================

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  api_id INTEGER UNIQUE NOT NULL, -- ID from Football API
  name TEXT NOT NULL,
  logo_url TEXT,
  country TEXT,
  founded INTEGER,
  venue_name TEXT,
  venue_capacity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_api_id ON teams(api_id);
CREATE INDEX idx_teams_name ON teams(name);

-- ============================================
-- LEAGUES & COMPETITIONS
-- ============================================

CREATE TABLE leagues (
  id SERIAL PRIMARY KEY,
  api_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT,
  logo_url TEXT,
  season INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leagues_api_id ON leagues(api_id);

-- ============================================
-- MATCHES
-- ============================================

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  api_id INTEGER UNIQUE NOT NULL,
  league_id INTEGER REFERENCES leagues(id) ON DELETE SET NULL,
  home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  match_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'postponed', 'cancelled')),
  venue TEXT,
  referee TEXT,
  
  -- Scores
  home_score INTEGER,
  away_score INTEGER,
  half_time_home INTEGER,
  half_time_away INTEGER,
  
  -- Metadata
  round TEXT,
  season INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_api_id ON matches(api_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);

-- RLS for matches (public read)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT
  USING (true);

-- ============================================
-- MATCH STATISTICS
-- ============================================

CREATE TABLE match_statistics (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  
  -- Statistics
  shots_total INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  possession_percentage DECIMAL(5,2),
  passes_total INTEGER DEFAULT 0,
  passes_accurate INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  offsides INTEGER DEFAULT 0,
  corners INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_match_statistics_match ON match_statistics(match_id);

-- ============================================
-- TEAM FORM & STANDINGS
-- ============================================

CREATE TABLE team_standings (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  
  -- Standings
  position INTEGER,
  played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points INTEGER DEFAULT 0,
  
  -- Form (last 5 matches: W, D, L)
  form TEXT, -- e.g., "WWDLW"
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_standings_team ON team_standings(team_id);
CREATE INDEX idx_team_standings_league ON team_standings(league_id, season);

-- ============================================
-- AI PREDICTIONS
-- ============================================

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Prediction data
  predicted_home_score INTEGER,
  predicted_away_score INTEGER,
  predicted_winner TEXT CHECK (predicted_winner IN ('home', 'away', 'draw')),
  confidence_score DECIMAL(5,2), -- 0.00 to 100.00
  
  -- Probabilities
  home_win_probability DECIMAL(5,2),
  draw_probability DECIMAL(5,2),
  away_win_probability DECIMAL(5,2),
  
  -- AI Analysis
  analysis_text TEXT,
  key_factors JSONB, -- Array of important factors
  
  -- Model info
  model_version TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_match ON predictions(match_id);
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_created ON predictions(created_at DESC);

-- RLS for predictions
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own predictions"
  ON predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create predictions"
  ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER FAVORITES
-- ============================================

CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, team_id),
  UNIQUE(user_id, league_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);

-- RLS for favorites
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites"
  ON user_favorites FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- CREDIT TRANSACTIONS
-- ============================================

CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for credits added, negative for used
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT,
  prediction_id UUID REFERENCES predictions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);

-- RLS for transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to deduct credits on prediction
CREATE OR REPLACE FUNCTION deduct_credits_on_prediction()
RETURNS TRIGGER AS $$
BEGIN
  -- Deduct 1 credit from user
  UPDATE profiles
  SET credits_remaining = credits_remaining - 1
  WHERE id = NEW.user_id AND credits_remaining > 0;
  
  -- Log transaction
  INSERT INTO credit_transactions (user_id, amount, transaction_type, description, prediction_id)
  VALUES (NEW.user_id, -1, 'usage', 'Prediction for match', NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for credit deduction
CREATE TRIGGER on_prediction_created
  AFTER INSERT ON predictions
  FOR EACH ROW EXECUTE FUNCTION deduct_credits_on_prediction();

-- ============================================
-- VIEWS
-- ============================================

-- View for upcoming matches with team info
CREATE VIEW upcoming_matches_with_teams AS
SELECT 
  m.id,
  m.api_id,
  m.match_date,
  m.status,
  m.venue,
  ht.name AS home_team,
  ht.logo_url AS home_logo,
  at.name AS away_team,
  at.logo_url AS away_logo,
  l.name AS league_name,
  l.logo_url AS league_logo
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN teams at ON m.away_team_id = at.id
LEFT JOIN leagues l ON m.league_id = l.id
WHERE m.status = 'scheduled'
ORDER BY m.match_date ASC;

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert sample leagues
INSERT INTO leagues (api_id, name, country, season) VALUES
  (39, 'Premier League', 'England', 2024),
  (61, 'Ligue 1', 'France', 2024),
  (140, 'La Liga', 'Spain', 2024);

-- Note: Actual teams and matches would be imported from Football API

