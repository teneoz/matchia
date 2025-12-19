/**
 * Service pour suivre l'utilisation de l'IA
 */

import { createClient } from '@/lib/supabase/server'
import type { AIFeatureType } from '@/lib/types'
import { calculateCost } from '../utils/cost-calculator'

export class UsageTrackingService {
  /**
   * Enregistre l'utilisation de l'IA
   */
  async logUsage(
    userId: string,
    featureType: AIFeatureType,
    inputTokens: number,
    outputTokens: number,
    modelVersion: string
  ): Promise<void> {
    try {
      const supabase = await createClient()
      const cost = calculateCost(modelVersion, inputTokens, outputTokens)

      await supabase.from('ai_usage_logs').insert({
        user_id: userId,
        feature_type: featureType,
        tokens_used: inputTokens + outputTokens,
        cost_usd: cost,
        model_version: modelVersion,
      })
    } catch (error) {
      console.error('Error logging AI usage:', error)
      // Ne pas faire échouer l'opération principale si le logging échoue
    }
  }

  /**
   * Récupère l'utilisation d'un utilisateur
   */
  async getUserUsage(userId: string, days: number = 30) {
    try {
      const supabase = await createClient()
      const since = new Date()
      since.setDate(since.getDate() - days)

      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user usage:', error)
      return []
    }
  }

  /**
   * Récupère les statistiques d'utilisation
   */
  async getUserStats(userId: string, days: number = 30) {
    const usage = await this.getUserUsage(userId, days)

    const stats = {
      totalRequests: usage.length,
      totalCost: usage.reduce((sum, log) => sum + (log.cost_usd || 0), 0),
      totalTokens: usage.reduce((sum, log) => sum + (log.tokens_used || 0), 0),
      byFeature: {
        prediction: usage.filter((u) => u.feature_type === 'prediction').length,
        chat: usage.filter((u) => u.feature_type === 'chat').length,
        analysis: usage.filter((u) => u.feature_type === 'analysis').length,
        content: usage.filter((u) => u.feature_type === 'content').length,
      },
    }

    return stats
  }

  /**
   * Vérifie si l'utilisateur a atteint sa limite
   */
  async checkLimit(
    userId: string,
    featureType: AIFeatureType,
    subscriptionTier: 'free' | 'pro' | 'premium'
  ): Promise<{ allowed: boolean; remaining?: number }> {
    const limits: Record<string, Record<AIFeatureType, number>> = {
      free: {
        prediction: 10,
        chat: 50,
        analysis: 5,
        content: 0,
      },
      pro: {
        prediction: 100,
        chat: 500,
        analysis: 50,
        content: 5,
      },
      premium: {
        prediction: Infinity,
        chat: Infinity,
        analysis: Infinity,
        content: Infinity,
      },
    }

    const limit = limits[subscriptionTier]?.[featureType] ?? 0

    if (limit === Infinity) {
      return { allowed: true }
    }

    // Compter l'utilisation ce mois-ci
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const usage = await this.getUserUsage(userId, 365) // Récupérer toute l'année
    const monthlyUsage = usage.filter(
      (log) =>
        log.feature_type === featureType &&
        new Date(log.created_at) >= startOfMonth
    )

    const remaining = limit - monthlyUsage.length

    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
    }
  }
}





