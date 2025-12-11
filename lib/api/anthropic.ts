/**
 * Anthropic Claude API Client
 * Used for generating match predictions and analysis
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface MatchAnalysisInput {
  homeTeam: string;
  awayTeam: string;
  homeTeamStats?: {
    form?: string;
    position?: number;
    goalsFor?: number;
    goalsAgainst?: number;
  };
  awayTeamStats?: {
    form?: string;
    position?: number;
    goalsFor?: number;
    goalsAgainst?: number;
  };
  headToHead?: Array<{
    date: string;
    homeScore: number;
    awayScore: number;
  }>;
  recentMatches?: {
    home: Array<{ opponent: string; score: string; result: string }>;
    away: Array<{ opponent: string; score: string; result: string }>;
  };
}

export interface MatchAnalysis {
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedWinner: 'home' | 'away' | 'draw';
  confidenceScore: number;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  analysisText: string;
  keyFactors: string[];
}

/**
 * Generate match prediction using Claude AI
 */
export async function generateMatchPrediction(
  input: MatchAnalysisInput
): Promise<MatchAnalysis> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const prompt = buildAnalysisPrompt(input);

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  // Parse the JSON response from Claude
  try {
    const analysis = JSON.parse(content.text) as MatchAnalysis;
    return analysis;
  } catch (error) {
    // If parsing fails, try to extract JSON from the text
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as MatchAnalysis;
    }
    throw new Error('Failed to parse Claude API response');
  }
}

/**
 * Build the analysis prompt for Claude
 */
function buildAnalysisPrompt(input: MatchAnalysisInput): string {
  return `Tu es un expert en analyse de football. Analyse le match suivant et fournis une prédiction détaillée.

Équipe à domicile: ${input.homeTeam}
Équipe à l'extérieur: ${input.awayTeam}

${input.homeTeamStats ? `
Statistiques de ${input.homeTeam}:
- Forme récente: ${input.homeTeamStats.form || 'N/A'}
- Position: ${input.homeTeamStats.position || 'N/A'}
- Buts marqués: ${input.homeTeamStats.goalsFor || 'N/A'}
- Buts encaissés: ${input.homeTeamStats.goalsAgainst || 'N/A'}
` : ''}

${input.awayTeamStats ? `
Statistiques de ${input.awayTeam}:
- Forme récente: ${input.awayTeamStats.form || 'N/A'}
- Position: ${input.awayTeamStats.position || 'N/A'}
- Buts marqués: ${input.awayTeamStats.goalsFor || 'N/A'}
- Buts encaissés: ${input.awayTeamStats.goalsAgainst || 'N/A'}
` : ''}

${input.headToHead && input.headToHead.length > 0 ? `
Confrontations directes:
${input.headToHead.map(m => `- ${m.date}: ${m.homeScore}-${m.awayScore}`).join('\n')}
` : ''}

${input.recentMatches ? `
Matchs récents:
${input.recentMatches.home.map(m => `- ${input.homeTeam} vs ${m.opponent}: ${m.score} (${m.result})`).join('\n')}
${input.recentMatches.away.map(m => `- ${input.awayTeam} vs ${m.opponent}: ${m.score} (${m.result})`).join('\n')}
` : ''}

Fournis une analyse complète au format JSON avec les champs suivants:
{
  "predictedHomeScore": nombre entier entre 0 et 5,
  "predictedAwayScore": nombre entier entre 0 et 5,
  "predictedWinner": "home" | "away" | "draw",
  "confidenceScore": nombre entre 0 et 100,
  "homeWinProbability": nombre entre 0 et 100,
  "drawProbability": nombre entre 0 et 100,
  "awayWinProbability": nombre entre 0 et 100,
  "analysisText": "texte d'analyse détaillé en français (3-5 phrases)",
  "keyFactors": ["facteur 1", "facteur 2", "facteur 3"]
}

Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.`;
}

