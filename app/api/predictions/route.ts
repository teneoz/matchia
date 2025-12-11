import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateMatchPrediction } from '@/lib/api/anthropic';
import { fetchMatchStatistics, fetchLeagueStandings } from '@/lib/api/football';

/**
 * POST /api/predictions
 * Create a new prediction for a match
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { matchId } = body;

    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
    }

    // Fetch match data
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        league:leagues(*)
      `)
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Check user credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits_remaining < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Fetch additional data for analysis
    const homeTeamStats = await fetchTeamStats(match.home_team_id, match.league_id);
    const awayTeamStats = await fetchTeamStats(match.away_team_id, match.league_id);

    // Generate AI prediction
    const analysis = await generateMatchPrediction({
      homeTeam: match.home_team.name,
      awayTeam: match.away_team.name,
      homeTeamStats,
      awayTeamStats,
    });

    // Save prediction to database
    const { data: prediction, error: predictionError } = await supabase
      .from('predictions')
      .insert({
        match_id: matchId,
        user_id: user.id,
        predicted_home_score: analysis.predictedHomeScore,
        predicted_away_score: analysis.predictedAwayScore,
        predicted_winner: analysis.predictedWinner,
        confidence_score: analysis.confidenceScore,
        home_win_probability: analysis.homeWinProbability,
        draw_probability: analysis.drawProbability,
        away_win_probability: analysis.awayWinProbability,
        analysis_text: analysis.analysisText,
        key_factors: analysis.keyFactors,
        model_version: 'claude-3-5-sonnet-20241022',
      })
      .select()
      .single();

    if (predictionError) {
      return NextResponse.json(
        { error: 'Failed to save prediction' },
        { status: 500 }
      );
    }

    return NextResponse.json({ prediction }, { status: 201 });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to fetch team statistics
 */
async function fetchTeamStats(teamId: number, leagueId?: number) {
  try {
    if (!leagueId) return undefined;

    const standings = await fetchLeagueStandings(leagueId);
    const teamStanding = standings.find((s: any) => s.team.id === teamId);

    if (!teamStanding) return undefined;

    return {
      form: teamStanding.form,
      position: teamStanding.rank,
      goalsFor: teamStanding.all.goals.for,
      goalsAgainst: teamStanding.all.goals.against,
    };
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return undefined;
  }
}

