-- ============================================
-- CORRECTION DES ERREURS DE SÉCURITÉ SUPABASE
-- ============================================
-- Ce script corrige les 5 erreurs détectées par Security Advisor :
-- 1. Security Definer View sur upcoming_matches_with_teams
-- 2-5. RLS Disabled sur leagues, teams, match_statistics, team_standings
-- ============================================

-- ============================================
-- 1. CORRECTION DE LA VUE SECURITY DEFINER
-- ============================================

-- Supprimer l'ancienne vue si elle existe
DROP VIEW IF EXISTS public.upcoming_matches_with_teams;

-- Recréer la vue avec security_invoker = true pour éviter les problèmes de sécurité
-- Cela garantit que la vue utilise les permissions de l'utilisateur qui l'interroge
CREATE VIEW public.upcoming_matches_with_teams
WITH (security_invoker = true)
AS
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

-- Activer RLS sur la vue (les vues héritent des politiques des tables sous-jacentes)
-- Note: Les vues PostgreSQL n'ont pas de RLS direct, mais elles respectent les politiques
-- des tables sous-jacentes. Assurez-vous que les tables référencées ont RLS activé.

-- ============================================
-- 2. ACTIVATION RLS SUR LEAGUES
-- ============================================

ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (ces données sont publiques)
DROP POLICY IF EXISTS "Leagues are viewable by everyone" ON public.leagues;
CREATE POLICY "Leagues are viewable by everyone"
  ON public.leagues FOR SELECT
  USING (true);

-- ============================================
-- 3. ACTIVATION RLS SUR TEAMS
-- ============================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (ces données sont publiques)
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

-- ============================================
-- 4. ACTIVATION RLS SUR MATCH_STATISTICS
-- ============================================

ALTER TABLE public.match_statistics ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (ces statistiques sont publiques)
DROP POLICY IF EXISTS "Match statistics are viewable by everyone" ON public.match_statistics;
CREATE POLICY "Match statistics are viewable by everyone"
  ON public.match_statistics FOR SELECT
  USING (true);

-- ============================================
-- 5. ACTIVATION RLS SUR TEAM_STANDINGS
-- ============================================

ALTER TABLE public.team_standings ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (ces classements sont publics)
DROP POLICY IF EXISTS "Team standings are viewable by everyone" ON public.team_standings;
CREATE POLICY "Team standings are viewable by everyone"
  ON public.team_standings FOR SELECT
  USING (true);

-- ============================================
-- CORRECTION DES WARNINGS function_search_path_mutable
-- ============================================

-- Corriger update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Corriger deduct_credits_on_prediction (conserve SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.deduct_credits_on_prediction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Corriger update_user_projects_updated_at (si elle existe)
CREATE OR REPLACE FUNCTION public.update_user_projects_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- ============================================
-- RÉSUMÉ DES CORRECTIONS
-- ============================================
-- ✅ 1. Vue upcoming_matches_with_teams recréée avec security_invoker = true
--    (garantit que la vue utilise les permissions de l'utilisateur qui l'interroge)
-- ✅ 2. RLS activé sur leagues avec politique de lecture publique
-- ✅ 3. RLS activé sur teams avec politique de lecture publique
-- ✅ 4. RLS activé sur match_statistics avec politique de lecture publique
-- ✅ 5. RLS activé sur team_standings avec politique de lecture publique
-- ✅ 6. Fonctions corrigées avec SET search_path = public pour éviter les warnings
-- ============================================
