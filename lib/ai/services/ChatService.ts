/**
 * Service pour le chat conversationnel avec l'IA
 */

import Anthropic from '@anthropic-ai/sdk'
import { buildChatPrompt, type ChatContext } from '../prompts/chat-assistant'
import { UsageTrackingService } from './UsageTrackingService'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const usageTracking = new UsageTrackingService()

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatResponse {
  message: string
  suggestions?: string[]
  relatedMatches?: string[]
}

export class ChatService {
  /**
   * Envoie un message et reçoit une réponse de l'IA
   */
  async chat(
    userMessage: string,
    context: ChatContext
  ): Promise<ChatResponse> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    const prompt = buildChatPrompt(userMessage, context)

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      if (!message.content || message.content.length === 0) {
        throw new Error('Empty response from Claude API')
      }

      const content = message.content[0]
      if (content.type !== 'text') {
        throw new Error(`Unexpected response type from Claude API: ${content.type}`)
      }

      // Logger l'utilisation (de manière asynchrone, ne pas bloquer)
      if (context.userId && message.usage) {
        usageTracking
          .logUsage(
            context.userId,
            'chat',
            message.usage.input_tokens || 0,
            message.usage.output_tokens || 0,
            'claude-3-5-sonnet-20241022'
          )
          .catch((err) => console.error('Error logging usage:', err))
      }

      // Extraire des suggestions si présentes
      const suggestions = this.extractSuggestions(content.text)
      const relatedMatches = this.extractRelatedMatches(content.text)

      return {
        message: content.text,
        suggestions,
        relatedMatches,
      }
    } catch (error) {
      console.error('Error in chat service:', error)
      
      // Messages d'erreur plus détaillés
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('authentication')) {
          throw new Error('Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY in .env.local')
        }
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
        if (error.message.includes('500') || error.message.includes('server')) {
          throw new Error('Anthropic API server error. Please try again later.')
        }
      }
      
      throw new Error(
        `Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Extrait les suggestions de questions suivantes
   */
  private extractSuggestions(text: string): string[] {
    // Chercher des patterns comme "Vous pourriez aussi demander..."
    const suggestionPattern = /(?:Vous pourriez|Souhaitez-vous|Autres questions).*?[:]\s*(.+?)(?:\n|$)/gi
    const matches = [...text.matchAll(suggestionPattern)]
    return matches.map(m => m[1].trim()).slice(0, 3)
  }

  /**
   * Extrait les matchs mentionnés dans la réponse
   */
  private extractRelatedMatches(text: string): string[] {
    // Pattern pour détecter les noms d'équipes
    const teamPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+vs\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g
    const matches = [...text.matchAll(teamPattern)]
    return matches.map(m => `${m[1]} vs ${m[2]}`).slice(0, 3)
  }

  /**
   * Génère des suggestions de questions basées sur le contexte
   */
  generateQuestionSuggestions(context: ChatContext): string[] {
    const suggestions: string[] = []

    if (context.favoriteTeams && context.favoriteTeams.length > 0) {
      suggestions.push(
        `Quels sont les prochains matchs de ${context.favoriteTeams[0]} ?`
      )
    }

    if (context.followedLeagues && context.followedLeagues.length > 0) {
      suggestions.push(
        `Quelles sont les tendances actuelles en ${context.followedLeagues[0]} ?`
      )
    }

    suggestions.push('Quels sont les matchs les plus intéressants ce weekend ?')
    suggestions.push('Comment fonctionne le système de prédiction ?')

    return suggestions.slice(0, 4)
  }
}

