-- ============================================
-- AI CHAT CONVERSATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated ON chat_conversations(updated_at DESC);

-- RLS for chat conversations
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own conversations" ON chat_conversations;
CREATE POLICY "Users can manage own conversations"
  ON chat_conversations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- AI USAGE TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('prediction', 'chat', 'analysis', 'content')),
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_type ON ai_usage_logs(feature_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage_logs(created_at DESC);

-- RLS for AI usage logs
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own usage logs" ON ai_usage_logs;
CREATE POLICY "Users can view own usage logs"
  ON ai_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- USER AI PREFERENCES
-- ============================================

CREATE TABLE IF NOT EXISTS user_ai_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferred_model TEXT DEFAULT 'claude-3-5-sonnet-20241022',
  chat_temperature DECIMAL(3, 2) DEFAULT 0.7,
  prediction_confidence_threshold INTEGER DEFAULT 60,
  auto_explain_predictions BOOLEAN DEFAULT true,
  preferred_language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_ai_preferences_user ON user_ai_preferences(user_id);

-- RLS for AI preferences
ALTER TABLE user_ai_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own preferences" ON user_ai_preferences;
CREATE POLICY "Users can manage own preferences"
  ON user_ai_preferences FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at for chat_conversations
CREATE OR REPLACE FUNCTION update_chat_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_chat_conversations_updated_at ON chat_conversations;
CREATE TRIGGER trigger_update_chat_conversations_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_conversations_updated_at();

-- Update updated_at for user_ai_preferences
CREATE OR REPLACE FUNCTION update_user_ai_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_ai_preferences_updated_at ON user_ai_preferences;
CREATE TRIGGER trigger_update_user_ai_preferences_updated_at
  BEFORE UPDATE ON user_ai_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_ai_preferences_updated_at();





