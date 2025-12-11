/**
 * Service pour générer des prédictions IA améliorées
 */

import Anthropic from '@anthropic-ai/sdk'
import { buildMatchPredictionPrompt, type MatchPredictionInput } from '../prompts/match-prediction'
import type { MatchAnalysis, MatchAnalysisInput } from '@/lib/api/anthropic'
import { UsageTrackingService } from './UsageTrackingService'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const usageTracking = new UsageTrackingService()

interface EnhancedPrediction extends MatchAnalysis {
  risks: string[]
  recommendation: string
  analysisText: string
}

export class PredictionService {
  private cache: Map<string, { data: EnhancedPrediction; expires: number }> = new Map()

  /**
   * Génère une prédiction améliorée pour un match
   */
  async generatePrediction(
    input: MatchPredictionInput
  ): Promise<EnhancedPrediction> {
    const cacheKey = this.getCacheKey(input)
    
    // Vérifier le cache (1 heure)
    const cached = this.cache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    const prompt = buildMatchPredictionPrompt(input)

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const content = message.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      // Parser la réponse JSON
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in Claude response')
      }

      const prediction = JSON.parse(jsonMatch[0]) as EnhancedPrediction

      // Valider la structure
      this.validatePrediction(prediction)

      // Logger l'utilisation (de manière asynchrone, ne pas bloquer)
      // Note: userId devrait être passé en paramètre pour le logging
      // Pour l'instant, on skip le logging ici car on n'a pas accès au userId
      // Il sera géré dans la route API

      // Mettre en cache (1 heure)
      this.cache.set(cacheKey, {
        data: prediction,
        expires: Date.now() + 3600000, // 1 heure
      })

      return prediction
    } catch (error) {
      console.error('Error generating prediction:', error)
      throw new Error(
        `Failed to generate prediction: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Explique une prédiction existante
   */
  async explainPrediction(
    predictionId: string,
    matchData: MatchPredictionInput
  ): Promise<string> {
    const prompt = `Tu as fait cette prédiction pour le match ${matchData.homeTeam} vs ${matchData.awayTeam}:
    
Prédiction: ${matchData.homeTeam} ${matchData.homeTeamStats.goalsFor || 0}-${matchData.awayTeamStats.goalsFor || 0} ${matchData.awayTeam}
Confiance: ${matchData.homeTeamStats.position || 'N/A'}%

Explique en détail (5-7 phrases) pourquoi tu as fait cette prédiction, en te basant sur les données du match.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    return content.text
  }

  /**
   * Génère une clé de cache unique pour un match
   */
  private getCacheKey(input: MatchPredictionInput): string {
    return `prediction:${input.homeTeam}:${input.awayTeam}:${input.matchDate}`
  }

  /**
   * Valide la structure d'une prédiction
   */
  private validatePrediction(prediction: EnhancedPrediction): void {
    if (
      typeof prediction.predictedHomeScore !== 'number' ||
      typeof prediction.predictedAwayScore !== 'number' ||
      typeof prediction.confidenceScore !== 'number' ||
      !prediction.analysisText ||
      !Array.isArray(prediction.keyFactors)
    ) {
      throw new Error('Invalid prediction structure')
    }
  }

  /**
   * Nettoie le cache (appelé périodiquement)
   */
  clearExpiredCache(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        this.cache.delete(key)
      }
    }
  }
}

