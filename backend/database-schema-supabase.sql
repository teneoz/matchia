-- ============================================
-- MATCHINSIGHT BACKEND - MIGRATION SUPABASE
-- ============================================
-- Ce fichier contient le schéma SQL pour créer les tables
-- du backend NestJS dans Supabase PostgreSQL
-- 
-- À exécuter dans l'éditeur SQL de Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  "fullName" VARCHAR,
  "avatarUrl" VARCHAR,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "subscriptionTier" VARCHAR DEFAULT 'free' CHECK ("subscriptionTier" IN ('free', 'pro', 'premium')),
  "creditsRemaining" INTEGER DEFAULT 10,
  "isActive" BOOLEAN DEFAULT true,
  "refreshToken" VARCHAR,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- PROJECTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects("userId");

-- ============================================
-- PREDICTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES users(id) ON DELETE SET NULL,
  "projectId" UUID REFERENCES projects(id) ON DELETE CASCADE,
  "matchId" INTEGER NOT NULL,
  "predictedHomeScore" INTEGER,
  "predictedAwayScore" INTEGER,
  "predictedWinner" VARCHAR CHECK ("predictedWinner" IN ('home', 'away', 'draw')),
  "confidenceScore" DECIMAL(5,2),
  "homeWinProbability" DECIMAL(5,2),
  "drawProbability" DECIMAL(5,2),
  "awayWinProbability" DECIMAL(5,2),
  "analysisText" TEXT,
  "keyFactors" JSONB,
  "modelVersion" VARCHAR,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions("userId");
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON predictions("matchId");
CREATE INDEX IF NOT EXISTS idx_predictions_project_id ON predictions("projectId");

-- ============================================
-- CREDIT TRANSACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  "transactionType" VARCHAR NOT NULL CHECK ("transactionType" IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT,
  "predictionId" UUID REFERENCES predictions(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions("userId");

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Projects policies
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;
CREATE POLICY "Users can manage own projects"
  ON projects FOR ALL
  USING (auth.uid()::text = "userId"::text);

-- Predictions policies
DROP POLICY IF EXISTS "Users can manage own predictions" ON predictions;
CREATE POLICY "Users can manage own predictions"
  ON predictions FOR ALL
  USING (auth.uid()::text = "userId"::text);

-- Credit transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;
CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid()::text = "userId"::text);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Table des utilisateurs du backend NestJS';
COMMENT ON TABLE projects IS 'Table des projets IA créés par les utilisateurs';
COMMENT ON TABLE predictions IS 'Table des prédictions IA générées';
COMMENT ON TABLE credit_transactions IS 'Table des transactions de crédits';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Toutes les tables ont été créées avec leurs index, 
-- triggers et politiques RLS.
-- 
-- Note: Les utilisateurs seront créés via l'API NestJS
--       et non via Supabase Auth directement dans ce schéma.
