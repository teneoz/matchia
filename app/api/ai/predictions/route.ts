import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PredictionService } from '@/lib/ai/services/PredictionService'
import { UsageTrackingService } from '@/lib/ai/services/UsageTrackingService'

const predictionService = new PredictionService()
const usageTracking = new UsageTrackingService()

/**
 * POST /api/ai/predictions
 * Génère une prédiction améliorée pour un match
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { matchId } = body

    if (!matchId) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      )
    }

    // Récupérer le profil utilisateur pour vérifier les limites
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, credits_remaining')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Vérifier les limites
    const limitCheck = await usageTracking.checkLimit(
      user.id,
      'prediction',
      profile.subscription_tier || 'free'
    )

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Limit reached',
          message: `Vous avez atteint votre limite de prédictions pour ce mois. Limite restante: ${limitCheck.remaining || 0}`,
        },
        { status: 429 }
      )
    }

    // Récupérer les données du match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        league:leagues(*)
      `)
      .eq('id', matchId)
      .single()

    if (matchError || !match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Récupérer les statistiques des équipes
    const { data: homeStanding } = await supabase
      .from('team_standings')
      .select('*')
      .eq('team_id', match.home_team_id)
      .eq('league_id', match.league_id || 0)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    const { data: awayStanding } = await supabase
      .from('team_standings')
      .select('*')
      .eq('team_id', match.away_team_id)
      .eq('league_id', match.league_id || 0)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    // Générer la prédiction
    const prediction = await predictionService.generatePrediction({
      homeTeam: match.home_team.name,
      awayTeam: match.away_team.name,
      matchDate: match.match_date,
      league: match.league?.name || 'Ligue inconnue',
      homeTeamStats: {
        form: homeStanding?.form,
        position: homeStanding?.position,
        goalsFor: homeStanding?.goals_for,
        goalsAgainst: homeStanding?.goals_against,
        recentResults: [], // À récupérer depuis les matchs récents
      },
      awayTeamStats: {
        form: awayStanding?.form,
        position: awayStanding?.position,
        goalsFor: awayStanding?.goals_for,
        goalsAgainst: awayStanding?.goals_against,
        recentResults: [], // À récupérer depuis les matchs récents
      },
    })

    // Sauvegarder la prédiction dans la base de données
    const { data: savedPrediction, error: saveError } = await supabase
      .from('predictions')
      .insert({
        match_id: matchId,
        user_id: user.id,
        predicted_home_score: prediction.predictedHomeScore,
        predicted_away_score: prediction.predictedAwayScore,
        predicted_winner: prediction.predictedWinner,
        confidence_score: prediction.confidenceScore,
        home_win_probability: prediction.homeWinProbability,
        draw_probability: prediction.drawProbability,
        away_win_probability: prediction.awayWinProbability,
        analysis_text: prediction.analysisText,
        key_factors: prediction.keyFactors,
        model_version: 'claude-3-5-sonnet-20241022',
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving prediction:', saveError)
      // Continuer quand même, on retourne la prédiction
    }

    // Logger l'utilisation (estimation des tokens)
    // Note: On ne peut pas obtenir les tokens exacts depuis le service
    // On estime basé sur la longueur du prompt et de la réponse
    const estimatedInputTokens = 1000 // Estimation
    const estimatedOutputTokens = 500 // Estimation
    usageTracking
      .logUsage(
        user.id,
        'prediction',
        estimatedInputTokens,
        estimatedOutputTokens,
        'claude-3-5-sonnet-20241022'
      )
      .catch((err) => console.error('Error logging usage:', err))

    return NextResponse.json({
      prediction: {
        ...prediction,
        id: savedPrediction?.id,
      },
      remaining: limitCheck.remaining ? limitCheck.remaining - 1 : undefined,
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate prediction',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}





