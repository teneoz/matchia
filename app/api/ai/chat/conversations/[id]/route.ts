import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/ai/chat/conversations/[id]
 * Récupère une conversation spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: conversation, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

