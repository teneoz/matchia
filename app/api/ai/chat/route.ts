import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ChatService, type ChatContext } from '@/lib/ai/services/ChatService'

/**
 * POST /api/ai/chat
 * Chat conversationnel avec l'IA
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
    const { message, conversationId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Récupérer l'historique de conversation
    let conversationHistory: Array<{ role: string; content: string; timestamp: string }> = []
    if (conversationId) {
      const { data: history } = await supabase
        .from('chat_conversations')
        .select('messages')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()

      if (history?.messages) {
        conversationHistory = history.messages
      }
    }

    // Récupérer les prédictions récentes (optionnel, ne pas faire échouer si erreur)
    let recentPredictions: any[] = []
    try {
      const { data: predictions } = await supabase
        .from('predictions')
        .select('predicted_home_score, predicted_away_score, match:matches(home_team_id, away_team_id)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (predictions) {
        recentPredictions = predictions.map(p => ({
          match: `Match ${p.predicted_home_score || 0}-${p.predicted_away_score || 0}`,
          prediction: `${p.predicted_home_score || 0}-${p.predicted_away_score || 0}`,
        }))
      }
    } catch (err) {
      console.warn('Error fetching recent predictions (non-blocking):', err)
      // Continue sans les prédictions récentes
    }

    // Construire le contexte
    const context: ChatContext = {
      userId: user.id,
      userName: profile?.full_name,
      favoriteTeams: [], // À implémenter avec user_favorites
      followedLeagues: [], // À implémenter
      recentPredictions,
      conversationHistory: conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    }

    // Vérifier que ANTHROPIC_API_KEY est configuré
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured')
      return NextResponse.json(
        {
          error: 'AI service not configured',
          message: 'ANTHROPIC_API_KEY is missing. Please configure it in .env.local',
        },
        { status: 500 }
      )
    }

    // Appeler le service de chat
    let response
    try {
      const chatService = new ChatService()
      response = await chatService.chat(message, context)
    } catch (chatError) {
      console.error('Chat service error:', chatError)
      return NextResponse.json(
        {
          error: 'Failed to get AI response',
          message: chatError instanceof Error ? chatError.message : 'Unknown error',
          details: process.env.NODE_ENV === 'development' ? String(chatError) : undefined,
        },
        { status: 500 }
      )
    }

    // Sauvegarder la conversation (ne pas faire échouer si erreur)
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }

    const assistantMessage = {
      role: 'assistant',
      content: response.message,
      timestamp: new Date().toISOString(),
    }

    try {
      if (conversationId) {
        // Mettre à jour la conversation existante
        await supabase
          .from('chat_conversations')
          .update({
            messages: [...conversationHistory, newMessage, assistantMessage],
            updated_at: new Date().toISOString(),
          })
          .eq('id', conversationId)
      } else {
        // Créer une nouvelle conversation
        const { data: newConversation, error: insertError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            messages: [newMessage, assistantMessage],
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error saving conversation:', insertError)
          // Continue quand même, on retourne la réponse
        } else {
          return NextResponse.json({
            ...response,
            conversationId: newConversation?.id,
          })
        }
      }
    } catch (saveError) {
      console.error('Error saving conversation (non-blocking):', saveError)
      // Continue quand même, on retourne la réponse
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    )
  }
}

