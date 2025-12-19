/**
 * Prompts pour les prédictions de matchs
 */

export interface MatchPredictionInput {
  homeTeam: string
  awayTeam: string
  matchDate: string
  league: string
  homeTeamStats: {
    form?: string
    position?: number
    goalsFor?: number
    goalsAgainst?: number
    recentResults?: Array<{ opponent: string; score: string; result: string }>
  }
  awayTeamStats: {
    form?: string
    position?: number
    goalsFor?: number
    goalsAgainst?: number
    recentResults?: Array<{ opponent: string; score: string; result: string }>
  }
  headToHead?: Array<{
    date: string
    homeScore: number
    awayScore: number
    winner: string
  }>
  injuries?: {
    home: string[]
    away: string[]
  }
  weather?: {
    condition: string
    temperature: number
  }
}

export function buildMatchPredictionPrompt(input: MatchPredictionInput): string {
  return `Tu es un expert en analyse de football avec accès à des millions de données historiques. 
Ton rôle est d'analyser ce match de manière approfondie et de fournir une prédiction précise et détaillée.

═══════════════════════════════════════════════════════════════
                    ANALYSE DE MATCH
═══════════════════════════════════════════════════════════════

MATCH: ${input.homeTeam} vs ${input.awayTeam}
DATE: ${input.matchDate}
LIGUE: ${input.league}

───────────────────────────────────────────────────────────────
STATISTIQUES ${input.homeTeam} (DOMICILE)
───────────────────────────────────────────────────────────────
${input.homeTeamStats.form ? `Forme récente: ${input.homeTeamStats.form}` : ''}
${input.homeTeamStats.position ? `Position au classement: ${input.homeTeamStats.position}` : ''}
${input.homeTeamStats.goalsFor ? `Buts marqués: ${input.homeTeamStats.goalsFor}` : ''}
${input.homeTeamStats.goalsAgainst ? `Buts encaissés: ${input.homeTeamStats.goalsAgainst}` : ''}
${input.homeTeamStats.recentResults && input.homeTeamStats.recentResults.length > 0 ? `
Derniers résultats:
${input.homeTeamStats.recentResults.map(r => `  - vs ${r.opponent}: ${r.score} (${r.result})`).join('\n')}
` : ''}

───────────────────────────────────────────────────────────────
STATISTIQUES ${input.awayTeam} (EXTÉRIEUR)
───────────────────────────────────────────────────────────────
${input.awayTeamStats.form ? `Forme récente: ${input.awayTeamStats.form}` : ''}
${input.awayTeamStats.position ? `Position au classement: ${input.awayTeamStats.position}` : ''}
${input.awayTeamStats.goalsFor ? `Buts marqués: ${input.awayTeamStats.goalsFor}` : ''}
${input.awayTeamStats.goalsAgainst ? `Buts encaissés: ${input.awayTeamStats.goalsAgainst}` : ''}
${input.awayTeamStats.recentResults && input.awayTeamStats.recentResults.length > 0 ? `
Derniers résultats:
${input.awayTeamStats.recentResults.map(r => `  - vs ${r.opponent}: ${r.score} (${r.result})`).join('\n')}
` : ''}

${input.headToHead && input.headToHead.length > 0 ? `
───────────────────────────────────────────────────────────────
CONFRONTATIONS DIRECTES
───────────────────────────────────────────────────────────────
${input.headToHead.map(h2h => `  - ${h2h.date}: ${input.homeTeam} ${h2h.homeScore}-${h2h.awayScore} ${input.awayTeam} (${h2h.winner})`).join('\n')}
` : ''}

${input.injuries ? `
───────────────────────────────────────────────────────────────
BLESSURES & SUSPENSIONS
───────────────────────────────────────────────────────────────
${input.injuries.home.length > 0 ? `${input.homeTeam}: ${input.injuries.home.join(', ')}` : `${input.homeTeam}: Équipe au complet`}
${input.injuries.away.length > 0 ? `${input.awayTeam}: ${input.injuries.away.join(', ')}` : `${input.awayTeam}: Équipe au complet`}
` : ''}

${input.weather ? `
───────────────────────────────────────────────────────────────
CONDITIONS MÉTÉO
───────────────────────────────────────────────────────────────
Condition: ${input.weather.condition}
Température: ${input.weather.temperature}°C
` : ''}

═══════════════════════════════════════════════════════════════
                    TON ANALYSE
═══════════════════════════════════════════════════════════════

Analyse ce match de manière approfondie en considérant:
1. La forme récente des deux équipes
2. Les statistiques offensives et défensives
3. L'historique des confrontations directes
4. L'avantage à domicile
5. Les blessures et suspensions
6. Les conditions météo (si pertinentes)
7. Le contexte de la compétition
8. Les enjeux du match

Fournis une prédiction complète au format JSON strict avec les champs suivants:

{
  "predictedHomeScore": nombre entier entre 0 et 5,
  "predictedAwayScore": nombre entier entre 0 et 5,
  "predictedWinner": "home" | "away" | "draw",
  "confidenceScore": nombre entre 0 et 100,
  "homeWinProbability": nombre entre 0 et 100,
  "drawProbability": nombre entre 0 et 100,
  "awayWinProbability": nombre entre 0 et 100,
  "analysisText": "texte d'analyse détaillé en français (5-8 phrases expliquant le raisonnement)",
  "keyFactors": ["facteur 1", "facteur 2", "facteur 3", "facteur 4", "facteur 5"],
  "risks": ["risque 1", "risque 2"],
  "recommendation": "recommandation courte (1-2 phrases)"
}

IMPORTANT:
- Sois précis et basé sur les données
- Indique ton niveau de confiance honnêtement
- Explique clairement ton raisonnement
- Identifie les facteurs clés qui influencent ta prédiction
- Mentionne les risques et incertitudes
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire`
}





