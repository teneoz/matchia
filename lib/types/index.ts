// User & Profile Types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'premium';
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

// Team Types
export interface Team {
  id: number;
  api_id: number;
  name: string;
  logo_url?: string;
  country?: string;
  founded?: number;
  venue_name?: string;
  venue_capacity?: number;
  created_at: string;
  updated_at: string;
}

// League Types
export interface League {
  id: number;
  api_id: number;
  name: string;
  country?: string;
  logo_url?: string;
  season: number;
  created_at: string;
}

// Match Types
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';

export interface Match {
  id: number;
  api_id: number;
  league_id?: number;
  home_team_id: number;
  away_team_id: number;
  match_date: string;
  status: MatchStatus;
  venue?: string;
  referee?: string;
  home_score?: number;
  away_score?: number;
  half_time_home?: number;
  half_time_away?: number;
  round?: string;
  season?: number;
  created_at: string;
  updated_at: string;
}

export interface MatchWithTeams extends Match {
  home_team: Team;
  away_team: Team;
  league?: League;
}

// Match Statistics Types
export interface MatchStatistics {
  id: number;
  match_id: number;
  team_id: number;
  shots_total: number;
  shots_on_target: number;
  possession_percentage?: number;
  passes_total: number;
  passes_accurate: number;
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  offsides: number;
  corners: number;
  created_at: string;
}

// Team Standings Types
export interface TeamStanding {
  id: number;
  team_id: number;
  league_id: number;
  season: number;
  position?: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form?: string;
  updated_at: string;
}

// Prediction Types
export type PredictedWinner = 'home' | 'away' | 'draw';

export interface Prediction {
  id: string;
  match_id: number;
  user_id?: string;
  predicted_home_score?: number;
  predicted_away_score?: number;
  predicted_winner?: PredictedWinner;
  confidence_score?: number;
  home_win_probability?: number;
  draw_probability?: number;
  away_win_probability?: number;
  analysis_text?: string;
  key_factors?: string[];
  model_version?: string;
  created_at: string;
}

export interface PredictionWithMatch extends Prediction {
  match: MatchWithTeams;
}

// User Favorites Types
export interface UserFavorite {
  id: string;
  user_id: string;
  team_id?: number;
  league_id?: number;
  created_at: string;
}

// Credit Transaction Types
export type TransactionType = 'purchase' | 'usage' | 'refund' | 'bonus';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: TransactionType;
  description?: string;
  prediction_id?: string;
  created_at: string;
}

// User Project Types
export interface UserProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  predictions: string[]; // Array of prediction IDs
  settings: Record<string, unknown>;
  is_public: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
}

